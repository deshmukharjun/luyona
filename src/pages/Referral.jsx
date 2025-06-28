import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Referral() {
  const [step, setStep] = useState(1);
  const [showContactsPopup, setShowContactsPopup] = useState(false);
  const [referralCode, setReferralCode] = useState(['', '', '', '', '', '']); // Array for 6 digits
  const inputRefs = React.useRef([]); // To manage focus for referral code inputs
  const navigate = useNavigate(); // Hook for navigation

  const totalSteps = 2; // "See who you know" -> "Enter referral code"
  const progress = (step / totalSteps) * 100;

  const handleSeeWhoYouKnow = () => {
    // Show the contacts access popup
    setShowContactsPopup(true);
  };

  const handleAllowContacts = () => {
    // In a real app, you'd request contact permissions here.
    // For this example, we just proceed to the next step.
    setShowContactsPopup(false);
    setStep(2); // Move to the referral code input step
  };

  const handleDonAllowContacts = () => {
    setShowContactsPopup(false);
    setStep(2); // Move to the referral code input step even if not allowed
  };

  const handleReferralCodeChange = (e, index) => {
    const { value } = e.target;
    const newCode = [...referralCode];

    if (value.length === 1 && /^\d$/.test(value)) {
      newCode[index] = value;
      setReferralCode(newCode);

      // Move focus to the next input if current one is filled
      if (index < referralCode.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      // Allow clearing a digit
      newCode[index] = '';
      setReferralCode(newCode);

      // Move focus to the previous input if current one is cleared and not the first
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleReferralCodeKeyDown = (e, index) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && referralCode[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmitReferralCode = () => {
    const code = referralCode.join('');
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      console.log("Referral Code Submitted:", code);
      // Route to /waitlist-status
      navigate('/waitlist-status'); // Changed route path
    } else {
      alert("Please enter a valid 6-digit referral code.");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1); // Go back in history if on the first step
    } else if (step === 2) {
      setStep(1); // Go back to step 1 from step 2
    }
  };

  // Check if referral code is complete
  const isReferralCodeComplete = referralCode.every(digit => digit !== '' && /^\d$/.test(digit));

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
          <h1 className="text-xl font-semibold mb-4">Add your referrals</h1>
          <p className="text-sm text-gray-500 mb-6">
            Our review committee prioritize your connection to our community.
          </p>
          <p className="text-sm text-gray-500 flex-grow"> {/* flex-grow to push CTA to bottom */}
            On the next screen, allow full access to your contacts to add referrals and help our committee understand your connection within our community.
          </p>

          {/* Removed the orange 'F' logo div */}

          <button
            onClick={handleSeeWhoYouKnow}
            className="w-full py-4 rounded-xl text-white font-medium text-sm bg-[#222222] sticky bottom-6" // Sticky to bottom
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }} // For iPhone notch area
          >
            See who you know
          </button>
        </>
      )}

      {/* Step 2: Enter Referral Code */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-semibold mb-4">Referral code</h1>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your 6-digit referral code below
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {referralCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleReferralCodeChange(e, index)}
                onKeyDown={(e) => handleReferralCodeKeyDown(e, index)}
                ref={el => inputRefs.current[index] = el}
                className="w-12 h-16 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={handleSubmitReferralCode}
            disabled={!isReferralCodeComplete}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              isReferralCodeComplete ? "bg-[#222222]" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </>
      )}

      {/* Contacts Access Pop-up */}
      {showContactsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Center vertically and horizontally */}
          <div className="w-full max-w-sm bg-gray-700 p-6 rounded-xl shadow-lg relative text-white text-center"> {/* Dark background for popup */}
            <h2 className="text-lg font-semibold mb-2"> {/* Smaller title font size */}
              "Luyona" would like to access your contcts
            </h2>
            <p className="text-gray-300 text-xs mb-6"> {/* Smaller text, lighter color */}
              To better understand your connection to our community, we recommend allowing full access on the next steps
            </p>
            <div className="flex flex-col gap-3"> {/* Vertical stack for buttons */}
              <button
                onClick={handleDonAllowContacts}
                className="w-full py-3 rounded-lg text-white bg-transparent border border-white font-medium text-sm" // White border, transparent background
              >
                Don't allow
              </button>
              <button
                onClick={handleAllowContacts}
                className="w-full py-3 rounded-lg text-gray-700 bg-white font-medium text-sm" // White background, dark text
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