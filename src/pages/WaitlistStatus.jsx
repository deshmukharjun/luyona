import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WaitlistStatus() {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0); // 0-100%
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 4 seconds
    const duration = 4000; // 4 seconds
    const interval = 50; // Update every 50ms
    const totalUpdates = duration / interval;
    let currentUpdate = 0;

    const progressTimer = setInterval(() => {
      currentUpdate += 1;
      const newProgress = (currentUpdate / totalUpdates) * 100;
      setLoadingProgress(Math.min(newProgress, 100)); // Ensure it doesn't go over 100

      if (currentUpdate >= totalUpdates) {
        clearInterval(progressTimer);
        setIsLoading(false); // Stop loading after 4 seconds
      }
    }, interval);

    return () => clearInterval(progressTimer); // Cleanup on unmount
  }, []);

  // Function to render the custom loading bar
  const renderCustomProgressBar = () => {
    const totalBars = 40; // As seen in image_183d16.png
    const filledBars = Math.round(loadingProgress / (100 / totalBars));
    const bars = [];

    for (let i = 0; i < totalBars; i++) {
      bars.push(
        <div
          key={i}
          className={`w-0.5 h-4 m-0.5 p-0.3 ${i < filledBars ? 'bg-black' : 'bg-gray-300'}`} // Black for filled, gray for empty
        ></div>
      );
    }
    return <div className="flex justify-center">{bars}</div>;
  };

  return (
    <div className="h-screen bg-white px-6 pt-10 flex flex-col font-sans">
      {/* Header - Common to both loading and status screens */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)} // Go back
          className="w-6 h-6 flex items-center justify-center"
        >
          <img src="/backarrow.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="text-gray-400 text-[14px] font-semibold mx-auto">
          Luyona.
        </div>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </div>

      {isLoading ? (
        // Application Submission / Loading Screen
        <div className="flex flex-col flex-1 items-center justify-center text-center px-4">
          <div className="mb-8 relative flex flex-col items-center">
            {/* Removed the blue 'S' icon */}
            <p className="text-gray-700 mb-2">Submitting application...</p>
            <p className="text-sm text-gray-500 mb-4">{Math.round(loadingProgress)}%</p>
            {renderCustomProgressBar()} {/* Custom progress bar */}
          </div>
        </div>
      ) : (
        // Waitlist Status Screen - After loading completes
        <div className="flex flex-col flex-1 justify-center items-center text-center px-4">
          {/* Success icon with animation as per screenshot */}
          <div className="mb-8 w-24 h-24 relative animate-success-burst flex justify-center items-center">
             {/* The circle and checkmark are combined in the image as a single element for simplicity */}
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse-background"></div> {/* Faint pulsing background */}
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center z-10">
                <img src="/success.svg" alt="Success Check" className="w-10 h-10" />
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

          <h1 className="text-xl font-semibold mb-2">You're on the waitlist</h1>
          <p className="text-gray-500 mb-12">
            Your application is in the hands of the pros. Sit tight, sip your favourite beverage, and let us work our magic—matches coming soon.
          </p>

          <button
            onClick={() => console.log("Play a quiz clicked")} // Or navigate to a quiz page
            className="w-full max-w-xs py-4 rounded-xl bg-[#222222] text-white font-medium text-sm"
          >
            Play a quiz
          </button>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
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