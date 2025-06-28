import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/gateway");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#222222]">
      {/* Replace with your logo */}
      <img src="/logowhite.svg" alt="Logo" className="h-40 w-40" />
    </div>
  );
}
