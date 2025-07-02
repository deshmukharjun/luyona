import { useState, useEffect, useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom";

export default function MobileVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  // Change otp to an array for individual digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits for OTP
  const [resendTimer, setResendTimer] = useState(120);
  const inputRefs = useRef([]); // To manage focus for OTP inputs

  useEffect(() => {
    // Start the timer only when on step 2 and timer is greater than 0
    if (step === 2 && resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      // Clean up the timer when the component unmounts or dependencies change
      return () => clearTimeout(timerId);
    }
  }, [step, resendTimer]); // Dependencies for the useEffect hook

  // Function to format time for the resend timer display
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0"); // Calculate minutes and pad with leading zero
    const s = (seconds % 60).toString().padStart(2, "0"); // Calculate seconds and pad with leading zero
    return `${m}:${s}`; // Return formatted time string
  };

  // Regular expression to validate a 10-digit phone number
  const isPhoneValid = /^\d{10}$/.test(phoneNumber);

  // Function to handle the back button click
  const handleBack = () => {
    if (step === 1) {
      // If on step 1, navigate back in browser history
      window.history.back();
    } else if (step === 2) {
      // If on step 2, go back to step 1 and reset the resend timer
      setStep(1);
      setResendTimer(120);
    } else if (step === 3) {
      // If on step 3, go back to step 2
      setStep(2);
    }
  };

  // New functions for OTP input management, same as referral code UI
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];

    if (value.length === 1 && /^\d$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input if current one is filled
      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      // Allow clearing a digit
      newOtp[index] = '';
      setOtp(newOtp);

      // Move focus to the previous input if current one is cleared and not the first
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Check if OTP is complete
  const isOtpComplete = otp.every(digit => digit !== '' && /^\d$/.test(digit));


  return (
    <div className="h-screen bg-white px-6 pt-10 flex flex-col font-['Inter']">
      {/* Header section with back button and logo */}
      <div className="flex items-center justify-between mb-6">
        {/* Back button, always visible */}
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="w-6 h-6 flex items-center justify-center" // Added flex for centering image
        >
          {/* Back arrow SVG icon */}
          <img
            src="/backarrow.svg" // Placeholder for backarrow.svg
            alt="Back"
            width={24}
            height={24}
            draggable={false} // Prevent image dragging
          />
        </button>

        {/* Luyona logo text */}
        <div className="text-gray-400 text-[14px] font-semibold mx-auto">Luyona.</div>

        {/* Spacer div to maintain layout balance */}
        <div style={{ width: 24 }}></div>
      </div>

      {/* Conditional rendering for Step 1: Phone Number Input */}
      {step === 1 && (
        <>
          <h1 className="text-xl font-semibold mb-1">Verify your number</h1>
          <p className="text-sm text-gray-500 mb-6">
            Let’s get your number verified with an OTP
          </p>

          {/* Phone number input field */}
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 mb-6">
            {/* Country code and flag */}
            <span className="mr-3 flex items-center select-none">
              <span
                role="img"
                aria-label="India Flag"
                className="mr-1 text-xl"
              >
                🇮🇳
              </span>
              <span className="text-gray-700 font-medium">+91</span>
            </span>

            {/* Input for mobile number */}
            <input
              type="tel"
              placeholder="Mobile number"
              maxLength={10} // Restrict input to 10 characters
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
              value={phoneNumber}
              onChange={(e) => {
                // Allow only digits and limit to 10 characters
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhoneNumber(val);
              }}
            />
          </div>

          {/* Next button for Step 1 */}
          <button
            disabled={!isPhoneValid} // Disable if phone number is not valid
            onClick={() => setStep(2)} // Move to Step 2 on click
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              isPhoneValid ? "bg-black" : "bg-gray-300 cursor-not-allowed" // Dynamic styling based on validity
            }`}
          >
            Next
          </button>
        </>
      )}

      {/* Conditional rendering for Step 2: OTP Input */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-semibold mb-1">Verify your number</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your verification code</p>

          {/* OTP input fields using the new UI */}
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric" // Suggest numeric keyboard
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                ref={el => inputRefs.current[index] = el}
                className="w-12 h-16 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Resend OTP timer display */}
          <p className="text-xs text-gray-400 mb-6">
            Resend OTP in {formatTime(resendTimer)}
          </p>

          {/* Next button for Step 2 */}
          <button
            disabled={!isOtpComplete} // Disable if OTP is not 6 digits long
            onClick={() => setStep(3)} // Move to Step 3 on click
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              isOtpComplete ? "bg-black" : "bg-gray-300 cursor-not-allowed" // Dynamic styling based on OTP length
            }`}
          >
            Next
          </button>
        </>
      )}

      {/* Conditional rendering for Step 3: Verification Success - Now using the desired animation */}
      {step === 3 && (
        <div className="flex flex-col flex-1 justify-center items-center text-center px-4">
          {/* Success icon with animation as seen in WaitlistStatus screenshot */}
          <div className="mb-8 w-24 h-24 relative animate-success-burst flex justify-center items-center">
            {/* The circle and checkmark are combined in the image as a single element for simplicity */}
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse-background"></div> {/* Faint pulsing background */}
            <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center z-10">
              <img src="/success.svg" alt="Success Check" className="w-10 h-10" /> {/* Assuming check-white.svg exists */}
            </div>
            {/* Confetti-like elements from the screenshot */}
            <div className="absolute inset-0 z-0">
                <span className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-300 rounded-full rotate-45 transform -translate-x-1/2 -translate-y-1/2"></span>
                <span className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-gray-300 rounded-full -rotate-12 transform -translate-x-1/2 -translate-y-1/2"></span>
                <span className="absolute top-3/4 left-1/4 w-2.5 h-2.5 bg-gray-300 rounded-full rotate-30 transform -translate-x-1/2 -translate-y-1/2"></span>
                <span className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-300 rounded-full rotate-60 transform -translate-x-1/2 -translate-y-1/2"></span>
                <span className="absolute bottom-1/4 left-1/2 w-2 h-0.5 bg-gray-300 rotate-90 transform -translate-x-1/2 -translate-y-1/2"></span>
                <span className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-gray-300 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></span>
            </div>
          </div>

          <h1 className="text-xl font-semibold mb-2">Verification successful</h1>
          <p className="text-gray-500 mb-12">Start your application</p>

          {/* "Let's go" button */}
          <button
            onClick={() => navigate("/user-info")}
            className="w-full max-w-xs py-4 rounded-xl bg-black text-white font-medium text-sm"
          >
            Let&apos;s go
          </button>
        </div>
      )}

      {/* Custom CSS for the success animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* New animations from WaitlistStatus */
        @keyframes pulse-background {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
        }

        @keyframes success-burst {
            0% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }

        .animate-pulse-background {
            animation: pulse-background 2s infinite ease-in-out;
        }

        .animate-success-burst {
            animation: success-burst 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </div>
  );
}