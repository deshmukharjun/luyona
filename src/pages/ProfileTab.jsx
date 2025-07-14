import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

export default function ProfileTab() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          setError("No user info found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Your Profile</h2>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {userInfo && (
        <div className="space-y-3 text-sm">
          <InfoRow label="Name" value={`${userInfo.firstName} ${userInfo.lastName}`} />
          <InfoRow label="Gender" value={userInfo.gender} />
          <InfoRow label="Date of Birth" value={userInfo.dob} />
          <InfoRow label="Current Location" value={userInfo.currentLocation} />
          <InfoRow label="Favourite Travel Destination" value={userInfo.favouriteTravelDestination} />
          <InfoRow
            label="Last Holiday Places"
            value={userInfo.lastHolidayPlaces?.map(p => p.name).join(", ") || "—"}
          />
          <InfoRow
            label="Favourite Places to Go"
            value={userInfo.favouritePlacesToGo?.map(p => p.name).join(", ") || "—"}
          />
          <InfoRow label="Email" value={userInfo.email} />
        </div>
      )}
      <button
        className="mt-8 w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
} 