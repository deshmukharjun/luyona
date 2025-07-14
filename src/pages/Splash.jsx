import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check auth state
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Check if onboarding info exists
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            navigate("/home", { replace: true });
          } else {
            navigate("/user-info", { replace: true });
          }
        } else {
          navigate("/gateway", { replace: true });
        }
      });
    }, 1000); // Shorter splash for better UX
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#222222]">
      {/* Replace with your logo */}
      <img src="/logowhite.svg" alt="Logo" className="h-40 w-40" />
    </div>
  );
}
