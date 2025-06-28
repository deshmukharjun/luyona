import { useState, useMemo, useEffect, useCallback } from "react";
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@ncdai/react-wheel-picker";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Helper to get days in a month (handles leap years)
const getDaysInMonth = (year, month) => {
  // Month is 0-indexed for Date object, so January = 0, December = 11
  // new Date(year, month + 1, 0) gives the last day of the month
  return new Date(year, month + 1, 0).getDate();
};

export default function UserInfo() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [title, setTitle] = useState("Mr");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [showOtherDialog, setShowOtherDialog] = useState(false);
  const [dob, setDob] = useState(""); // Stores date as "YYYY-MM-DD" string
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize picker states with a valid date (e.g., current date)
  const [pickerDay, setPickerDay] = useState("");
  const [pickerMonth, setPickerMonth] = useState("");
  const [pickerYear, setPickerYear] = useState("");

  // New states for additional steps
  const [currentLocation, setCurrentLocation] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [email, setEmail] = useState("");
  // Initialize with default values for Instagram and LinkedIn
  const [instagramUsername, setInstagramUsername] = useState("@");
  const [linkedInUsername, setLinkedInUsername] = useState("linkedin.com/in/");

  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationType, setVerificationType] = useState(""); // 'email', 'instagram', 'linkedin'
  const [verificationValue, setVerificationValue] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Effect to synchronize picker states when DOB changes or picker is shown
  useEffect(() => {
    const initialDate = dob ? new Date(dob) : new Date();
    setPickerDay(String(initialDate.getDate()));
    setPickerMonth(String(initialDate.getMonth() + 1)); // 1-indexed
    setPickerYear(String(initialDate.getFullYear()));
  }, [dob, showDatePicker]);

  // Adjust pickerDay if month/year changes and the day becomes invalid
  const updatePickerDayBasedOnMonthYear = useCallback((year, month, day) => {
    const maxDays = getDaysInMonth(Number(year), Number(month) - 1);
    if (Number(day) > maxDays) {
      return String(maxDays);
    }
    return day;
  }, []);

  // Total logical steps for the progress bar
  // 1. Name, 2. Gender, 3. Age, 4. Location,
  // 5. Email (input + confirmation), 6. Instagram (input + confirmation), 7. LinkedIn (input + confirmation)
  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // If current step is 5 (Email input), 6 (Instagram input), or 7 (LinkedIn input),
    // trigger the verification popup. The actual step increment happens in handleVerificationConfirm.
    if (step === 5 && isStepFiveValid) {
      setVerificationType('email');
      setVerificationValue(email);
      setShowVerificationPopup(true);
    } else if (step === 6 && isStepSixValid) {
      setVerificationType('instagram');
      // Ensure we pass the clean username to the popup
      setVerificationValue(instagramUsername.startsWith('@') ? instagramUsername.substring(1) : instagramUsername);
      setShowVerificationPopup(true);
    } else if (step === 7 && isStepSevenValid) {
      setVerificationType('linkedin');
      // Ensure we pass the clean URL part to the popup
      setVerificationValue(linkedInUsername.replace('linkedin.com/in/', ''));
      setShowVerificationPopup(true);
    } else if (step < totalSteps) {
      // For non-verification steps (1-4), simply advance the step
      setStep(step + 1);
    } else {
      // This case should ideally not be reached if the final step correctly triggers a popup
      // before navigating. It's a fallback.
      console.log("Unexpected call to handleNext on last step without popup.");
    }
  };

  const handleBack = () => {
    if (step === 1) return navigate(-1); // Go back in browser history
    setStep(step - 1);
  };

  const handleVerificationConfirm = () => {
    setShowVerificationPopup(false);
    // After confirming, proceed to the next logical step
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps) {
      // This is the final confirmation (LinkedIn)
      console.log({
        firstName,
        lastName,
        title,
        gender: gender === "Other" ? customGender : gender,
        dob,
        currentLocation,
        homeLocation,
        email,
        instagramUsername: instagramUsername === "@" ? "" : instagramUsername,
        linkedInUsername: linkedInUsername === "linkedin.com/in/" ? "" : linkedInUsername,
      });
      // Route the user to referral.jsx using navigate
      navigate('/referral');
    }
  };

  const handleVerificationEdit = () => {
    setShowVerificationPopup(false);
    // User stays on the same step to edit the value, no step change needed
  };

  // Generate options for the WheelPicker components
  const dayOptions = useMemo(() => {
    const days = [];
    const maxDays = getDaysInMonth(Number(pickerYear), Number(pickerMonth) - 1);
    for (let i = 1; i <= maxDays; i++) {
      days.push({ label: String(i).padStart(2, '0'), value: String(i) });
    }
    return days;
  }, [pickerMonth, pickerYear]);

  const monthOptions = useMemo(() => {
    const months = [];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    for (let i = 0; i < 12; i++) {
      months.push({ label: monthNames[i], value: String(i + 1) });
    }
    return months;
  }, []);

  const yearOptions = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 120; i <= currentYear + 1; i++) {
      years.push({ label: String(i), value: String(i) });
    }
    return years;
  }, []);

  const handleDateConfirm = () => {
    const year = Number(pickerYear);
    const month = Number(pickerMonth); // 1-indexed
    const day = Number(updatePickerDayBasedOnMonthYear(pickerYear, pickerMonth, pickerDay));

    const selectedDate = new Date(year, month - 1, day);
    setDob(selectedDate.toISOString().split('T')[0]);
    setShowDatePicker(false);
  };

  // Validation for each step's input fields
  const isStepOneValid = firstName.trim() && lastName.trim();
  const isStepTwoValid = gender && (gender !== "Other" || customGender.trim());
  const isStepThreeValid = useMemo(() => {
    if (!dob) return false;
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, [dob]);
  const isStepFourValid = currentLocation.trim() && homeLocation.trim();
  const isStepFiveValid = email.trim() && /\S+@\S+\.\S+/.test(email); // Basic email validation
  // Instagram validation: must be more than just "@"
  const isStepSixValid = instagramUsername.trim() !== "@";
  // LinkedIn validation: must be more than just "linkedin.com/in/"
  const isStepSevenValid = linkedInUsername.trim() !== "linkedin.com/in/";


  const getNextButtonDisabled = () => {
    switch (step) {
      case 1: return !isStepOneValid;
      case 2: return !isStepTwoValid;
      case 3: return !isStepThreeValid;
      case 4: return !isStepFourValid;
      case 5: return !isStepFiveValid;
      case 6: return !isStepSixValid;
      case 7: return !isStepSevenValid;
      default: return true;
    }
  };

  const getNextButtonText = () => {
    // This function now only determines the text for the input screens' "Next" button
    return "Next";
  };

  const VerificationPopup = ({ type, value, onConfirm, onEdit }) => {
    let title = "";
    let displayValue = value; // Default to raw value
    let confirmButtonText = "Looks Good"; // Default for all confirmations

    switch (type) {
      case 'email':
        title = "Confirm Email Address";
        break;
      case 'instagram':
        title = "Confirm Instagram Username";
        displayValue = `@${value}`; // Prepend '@' for display
        break;
      case 'linkedin':
        title = "Confirm LinkedIn Profile";
        displayValue = `linkedin.com/in/${value}`; // Prepend base URL for display
        // As requested, the CTA for LinkedIn confirmation remains "Looks Good"
        break;
      default:
        return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
        <div className="w-full bg-white p-6 rounded-t-xl shadow-lg relative">
          <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Please confirm your {type.replace('linkedin', 'LinkedIn profile').replace('email', 'email address').replace('instagram', 'Instagram username')} for verification and account recovery.
          </p>
          <div className="flex justify-center mb-6">
            <img src="/verify.svg" alt="Verify" className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <span className="font-medium text-lg">{displayValue}</span>
            <button onClick={onEdit} className="text-blue-500 text-sm font-semibold">Edit</button>
          </div>
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm bg-[#222222]`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    );
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

      {/* Step 1: Name Details */}
      {step === 1 && (
        <>
          <h1 className="text-xl font-semibold mb-4">Let's start with your Full name.</h1>
          <div className="flex gap-2 mb-4">
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-lg text-sm"
            >
              <option>Mr</option>
              <option>Mrs</option>
              <option>Miss</option>
              <option>Ms</option>
            </select>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm mb-6"
          />
          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Step 2: Gender Details */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-semibold mb-6">
            Which gender best describes you?
          </h1>
          {[
            "Woman",
            "Man",
            "Non-binary",
            "Other",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 mb-3 cursor-pointer"
            >
              <span>{option}</span>
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={() => {
                  setGender(option);
                  if (option === "Other") {
                    setShowOtherDialog(true);
                  } else {
                    setShowOtherDialog(false);
                    setCustomGender("");
                  }
                }}
                className="accent-[#222222]"
              />
            </label>
          ))}

          {showOtherDialog && (
            <div className="mb-4">
              <input
                type="text"
                value={customGender}
                onChange={(e) => setCustomGender(e.target.value)}
                placeholder="Enter your gender"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          )}

          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            } mt-4`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Step 3: Age Details */}
      {step === 3 && (
        <>
          <h1 className="text-xl font-semibold mb-6">What's your Age?</h1>
          <div
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => {
              setShowDatePicker(true);
            }}
          >
            {dob ? new Date(dob).toLocaleDateString('en-GB') : "DD/MM/YYYY"}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Must be at least 18 years old
          </p>
          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>

          {/* Custom Date Picker Overlay */}
          {showDatePicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
              <div className="w-full bg-white p-4 rounded-t-xl shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setShowDatePicker(false)} className="text-blue-500">Cancel</button>
                  <div className="font-semibold">Select Date</div>
                  <button onClick={handleDateConfirm} className="text-blue-500 font-semibold">Done</button>
                </div>

                <WheelPickerWrapper
                  className="flex w-full justify-center h-48 py-2 relative"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05) 50%, transparent)',
                    backgroundSize: '100% 2px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  <WheelPicker
                    options={dayOptions}
                    value={pickerDay}
                    onValueChange={(val) => setPickerDay(updatePickerDayBasedOnMonthYear(pickerYear, pickerMonth, val))}
                    classNames={{
                      optionItem: "text-gray-400",
                      highlightWrapper: "bg-gray-100 rounded-md",
                      highlightItem: "text-gray-800 font-semibold",
                    }}
                    infinite={true}
                  />
                  <WheelPicker
                    options={monthOptions}
                    value={pickerMonth}
                    onValueChange={(val) => {
                      setPickerMonth(val);
                      setPickerDay(updatePickerDayBasedOnMonthYear(pickerYear, val, pickerDay));
                    }}
                    classNames={{
                      optionItem: "text-gray-400",
                      highlightWrapper: "bg-gray-100 rounded-md",
                      highlightItem: "text-gray-800 font-semibold",
                    }}
                    infinite={true}
                  />
                  <WheelPicker
                    options={yearOptions}
                    value={pickerYear}
                    onValueChange={(val) => {
                      setPickerYear(val);
                      setPickerDay(updatePickerDayBasedOnMonthYear(val, pickerMonth, pickerDay));
                    }}
                    classNames={{
                      optionItem: "text-gray-400",
                      highlightWrapper: "bg-gray-100 rounded-md",
                      highlightItem: "text-gray-800 font-semibold",
                    }}
                    infinite={false}
                  />
                </WheelPickerWrapper>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 4: Location Details */}
      {step === 4 && (
        <>
          <h1 className="text-xl font-semibold mb-4">Where are you living currently?</h1>
          <p className="text-sm text-gray-500 mb-6">This will help users see which city you are currently living in so they can connect accordingly.</p>
          <div className="relative mb-6">
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="Andheri"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm pr-10"
            />
            {currentLocation && (
              <button
                onClick={() => setCurrentLocation("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                &times;
              </button>
            )}
          </div>

          <h1 className="text-xl font-semibold mb-4">Where are you from?</h1>
          <p className="text-sm text-gray-500 mb-6">This will help users see which city you are originally from.</p>
          <div className="relative mb-6">
            <input
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              placeholder="Mumbai"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm pr-10"
            />
            {homeLocation && (
              <button
                onClick={() => setHomeLocation("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                &times;
              </button>
            )}
          </div>

          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Step 5: Email Verification */}
      {step === 5 && (
        <>
          <h1 className="text-xl font-semibold mb-6">What's your email?</h1>
          <div className="relative mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sheri13@gmail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm pr-10"
            />
            {email && (
              <button
                onClick={() => setEmail("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                &times;
              </button>
            )}
          </div>
          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Step 6: Instagram Verification */}
      {step === 6 && (
        <>
          <h1 className="text-xl font-semibold mb-6">What's your Instagram?</h1>
          <div className="relative mb-6">
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith('@')) {
                  val = '@' + val;
                }
                setInstagramUsername(val);
              }}
              onFocus={(e) => {
                if (e.target.value === '@') {
                  e.target.setSelectionRange(1, 1);
                }
              }}
              placeholder="@yourinstagram"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm pr-10"
            />
            {instagramUsername !== "@" && (
              <button
                onClick={() => setInstagramUsername("@")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                &times;
              </button>
            )}
          </div>
          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Step 7: LinkedIn Verification */}
      {step === 7 && (
        <>
          <h1 className="text-xl font-semibold mb-6">What's your LinkedIn?</h1>
          <div className="relative mb-6">
            <input
              type="text"
              value={linkedInUsername}
              onChange={(e) => {
                const prefix = "linkedin.com/in/";
                let val = e.target.value;
                if (!val.startsWith(prefix)) {
                  val = prefix + val.replace(prefix, '');
                }
                setLinkedInUsername(val);
              }}
              onFocus={(e) => {
                const prefix = "linkedin.com/in/";
                if (e.target.value === prefix) {
                  e.target.setSelectionRange(prefix.length, prefix.length);
                }
              }}
              placeholder="linkedin.com/in/yourprofile"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm pr-10"
            />
            {linkedInUsername !== "linkedin.com/in/" && (
              <button
                onClick={() => setLinkedInUsername("linkedin.com/in/")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                &times;
              </button>
            )}
          </div>
          <button
            disabled={getNextButtonDisabled()}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl text-white font-medium text-sm ${
              getNextButtonDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#222222]"
            }`}
          >
            {getNextButtonText()}
          </button>
        </>
      )}

      {/* Generic Verification Pop-up */}
      {showVerificationPopup && (
        <VerificationPopup
          type={verificationType}
          value={verificationValue}
          onConfirm={handleVerificationConfirm}
          onEdit={handleVerificationEdit}
        />
      )}
    </div>
  );
}