import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

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

  // Placeholder images
  const bgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
  const pfpUrl = "https://randomuser.me/api/portraits/men/32.jpg";

  // Helper to calculate age from dob
  function getAge(dob) {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="w-full max-w-md mx-auto pb-6">
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {/* Profile Header with background and avatar */}
      <div className="relative h-72 rounded-b-2xl overflow-hidden shadow-md">
        <img src={bgUrl} alt="Background" className="w-full h-full object-cover" />
        {/* Settings button */}
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
          onClick={() => navigate('/settings')}
        >
          <img src="/setting-icon.svg" alt="Settings" className="w-6 h-6" />
        </button>
        {/* Profile picture */}
        <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">

        </div>
      </div>
      {/* Main Info Card */}
      <div className="mt-16 px-4 flex flex-col items-center">
        <div className="text-xs text-gray-400 mb-1">Date</div>
        <div className="text-2xl font-semibold text-gray-900">
          {userInfo ? `${userInfo.firstName || ''}${userInfo.lastName ? ', ' + userInfo.lastName : ''}${userInfo.dob ? ', ' + getAge(userInfo.dob) : ''}` : 'Name, Age'}
        </div>
        {userInfo && userInfo.gender && (
          <div className="text-sm text-gray-500 font-medium">{userInfo.gender}</div>
        )}
        {userInfo && userInfo.email && (
          <div className="text-sm text-blue-600 font-medium">{userInfo.email}</div>
        )}
        {userInfo && userInfo.currentLocation && (
          <div className="text-xs text-gray-400">{userInfo.currentLocation}</div>
        )}
        <button
          className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 shadow hover:bg-gray-50 transition"
          onClick={() => navigate('/edit-profile')}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
          Edit Profile
        </button>
      </div>
      {/* Bio Card */}
      <div className="mt-8 px-4">
        <div className="bg-white rounded-xl shadow p-4 mb-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <button className="text-xs font-semibold bg-black text-white rounded px-2 py-0.5">Read</button>
            <button className="text-xs font-semibold text-gray-400 rounded px-2 py-0.5">Listen</button>
            <button className="ml-auto" onClick={() => navigate('/edit-profile')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
            </button>
          </div>
          <div className="text-gray-700 text-sm">
            {userInfo && userInfo.bio
              ? userInfo.bio
              : 'No bio set yet.'}
          </div>
        </div>
        {/* About Card */}
        <div className="bg-white rounded-xl shadow p-4 relative">
          <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700">About
            <button className="ml-auto" onClick={() => navigate('/edit-profile')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
            </button>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            {userInfo && userInfo.gender && (
              <div><span className="font-medium">Gender</span> <span className="ml-2">{userInfo.gender}</span></div>
            )}
            {userInfo && userInfo.dob && (
              <div><span className="font-medium">Age</span> <span className="ml-2">{getAge(userInfo.dob)} Years</span></div>
            )}
            {userInfo && userInfo.currentLocation && (
              <div><span className="font-medium">Lives in</span> <span className="ml-2">{userInfo.currentLocation}</span></div>
            )}
            {userInfo && userInfo.favouriteTravelDestination && (
              <div><span className="font-medium">Favourite Travel Destination</span> <span className="ml-2">{userInfo.favouriteTravelDestination}</span></div>
            )}
            {userInfo && userInfo.lastHolidayPlaces && userInfo.lastHolidayPlaces.length > 0 && (
              <div><span className="font-medium">Last Holiday Places</span> <span className="ml-2">{userInfo.lastHolidayPlaces.map(p => p.name).join(', ')}</span></div>
            )}
            {userInfo && userInfo.favouritePlacesToGo && userInfo.favouritePlacesToGo.length > 0 && (
              <div><span className="font-medium">Favourite Places to Go</span> <span className="ml-2">{userInfo.favouritePlacesToGo.map(p => p.name).join(', ')}</span></div>
            )}
            {userInfo && userInfo.email && (
              <div><span className="font-medium">Email</span> <span className="ml-2 text-blue-600">{userInfo.email}</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 