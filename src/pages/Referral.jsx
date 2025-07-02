import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Referral() {
  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef([]);
  const navigate = useNavigate();

  // State to control the visibility of the invalid code modal
  const [showInvalidCodeModal, setShowInvalidCodeModal] = useState(false);
  // NEW State for the Contact Permission Modal
  const [showContactPermissionModal, setShowContactPermissionModal] = useState(false);


  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const handleReferralCodeChange = (e, index) => {
    const { value } = e.target;
    const newCode = [...referralCode];

    if (value.length === 1 && /^\d$/.test(value)) {
      newCode[index] = value;
      setReferralCode(newCode);
      if (index < referralCode.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      newCode[index] = '';
      setReferralCode(newCode);
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleReferralCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace' && referralCode[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmitReferralCode = () => {
    const code = referralCode.join('');
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      console.log("Referral Code Submitted:", code);
      navigate('/application-status');
    } else {
      setShowInvalidCodeModal(true); // Show the custom iOS-style modal
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else if (step === 2) {
      setStep(1);
    }
  };

  // MODIFIED: handleNext now shows the contact permission modal
  const handleNext = () => {
    setShowContactPermissionModal(true);
  };

  // NEW: Function to handle actions within the contact permission modal
  const handleContactModalAction = (action) => {
    setShowContactPermissionModal(false); // Close the modal
    // In both cases (allow/deny), proceed to step 2
    setStep(2);
    // You could add specific logic here if 'allow' or 'deny' needs different handling later
    // For now, both move to the next step
    if (action === 'allow') {
      console.log('User allowed contact access.');
    } else {
      console.log('User denied contact access.');
    }
  };

  const isReferralCodeComplete = referralCode.every(digit => digit !== '' && /^\d$/.test(digit));

  // Function to close the invalid code modal
  const handleCloseInvalidCodeModal = () => {
    setShowInvalidCodeModal(false);
  };

  return (
    <div className="h-screen bg-white px-6 pt-10 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="w-6 h-6 flex items-center justify-center"
        >
          <img src="/backarrow.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="text-gray-400 text-[14px] font-semibold mx-auto">
          Luyona.
        </div>
        <div style={{ width: 24 }}></div>
      </div>

      {/* Top Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-[#222222] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step 1: Add Referrals */}
      {step === 1 && (
        <>
          {/* Centered logo and text */}
          <div className="flex flex-col items-center justify-center flex-1">
            <img src="/referral.png" alt="Lock" className="h-32 mb-4" />
            <h1 className="text-xl font-semibold text-black mb-2 text-center">
              Add your referrals
            </h1>
            <p className="text-center text-gray-500 text-sm max-w-md">
              You’re not getting in alone. Drop a name,
            </p>
            <p className="text-center text-gray-500 text-sm max-w-md mb-6">get their nod, and we’ll hold the door.</p>
          </div>

          {/* CTA Button */}
          <div className="w-full mb-10">
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl bg-[#222222] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 2: Enter Referral Code */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-semibold mb-4">Enter Referral Code</h1>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your 6-digit referral code below
          </p>

          <div className="flex justify-center gap-3 mb-8">
            {referralCode.map((digit, index) => (
              <input
                key={index}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleReferralCodeChange(e, index)}
                onKeyDown={(e) => handleReferralCodeKeyDown(e, index)}
                ref={el => (inputRefs.current[index] = el)}
                className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222222] focus:border-transparent"
              />
            ))}
          </div>

          <button
            onClick={handleSubmitReferralCode}
            disabled={!isReferralCodeComplete}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              isReferralCodeComplete
                ? "bg-[#222222] hover:bg-[#333333]"
                : "bg-gray-300 cursor-not-allowed"
            } transition-colors`}
          >
            Submit
          </button>
        </>
      )}

      {/* Simulated iOS-style Invalid Code Modal (existing) */}
      {showInvalidCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
            <p className="text-lg font-semibold mb-2">Invalid Referral Code</p>
            <p className="text-gray-600 text-sm mb-6">
              Please enter a valid 6-digit referral code.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCloseInvalidCodeModal}
                className="w-full py-3 rounded-lg text-blue-600 font-bold border-t border-gray-200 pt-3"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Simulated iOS-style Contact Permission Modal */}
      {showContactPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#515151] rounded-xl shadow-lg w-72 text-center overflow-hidden">
            <div className="p-4 pt-5">
              <p className="text-white text-[17px] font-semibold mb-1">
                "Luyona" would like to access your contacts
              </p>
              <p className="text-[#D0D0D0] text-[13px] leading-tight px-2">
                To better understand your connection to our community, we recommend allowing full access on the next steps
              </p>
            </div>
            <div className="flex border-t border-[#636363]">
              <button
                onClick={() => handleContactModalAction('deny')}
                className="flex-1 py-2 text-blue-400 font-normal text-[17px] border-r border-[#636363]"
              >
                Don't allow
              </button>
              <button
                onClick={() => handleContactModalAction('allow')}
                className="flex-1 py-2 text-blue-400 font-normal text-[17px]"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}