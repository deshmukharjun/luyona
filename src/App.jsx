import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Gateway from "./pages/Gateway";
import UserInfo from "./pages/UserInfo";
import Referral from "./pages/Referral";
import ApplicationStatus from "./pages/ApplicationStatus";
import Privacy from "./pages/Privacy";
import Different from "./pages/Different";
import Permissions from "./pages/Permissions";
import WaitlistStatus from "./pages/WaitlistStatus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SettingsTab from "./pages/SettingsTab";
import "@ncdai/react-wheel-picker/style.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/application-status" element={<ApplicationStatus />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/different" element={<Different />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/waitlist-status" element={<WaitlistStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<SettingsTab />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
