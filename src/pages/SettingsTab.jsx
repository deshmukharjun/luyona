import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsTab() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", user.uid));
      // Delete user from Firebase Auth
      await deleteUser(user);
      // Log out and redirect
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <button
        className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-700 transition"
        onClick={handleDeleteProfile}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
} 