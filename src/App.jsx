import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Gateway from "./pages/Gateway";
import MobileVerification from "./pages/MobileVerification";
import UserInfo from "./pages/UserInfo";
import Referral from "./pages/Referral";
import WaitlistStatus from "./pages/WaitlistStatus";
import "@ncdai/react-wheel-picker/style.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/mobile-verification" element={<MobileVerification />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/waitlist-status" element={<WaitlistStatus />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
