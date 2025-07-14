import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeTab from "./HomeTab";
import ExploreTab from "./ExploreTab";
import MessagesTab from "./MessagesTab";
import ProfileTab from "./ProfileTab";

const navOptions = [
  { key: "home", label: "Home" },
  { key: "explore", label: "Explore" },
  { key: "messages", label: "Messages" },
  { key: "profile", label: "Profile" },
];

export default function Home() {
  const [selected, setSelected] = useState("home");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  let ContentComponent;
  switch (selected) {
    case "home":
      ContentComponent = HomeTab;
      break;
    case "explore":
      ContentComponent = ExploreTab;
      break;
    case "messages":
      ContentComponent = MessagesTab;
      break;
    case "profile":
      ContentComponent = ProfileTab;
      break;
    default:
      ContentComponent = HomeTab;
  }

  return (
    <div className="h-screen flex flex-col bg-white font-sans">
      <div className="p-4 border-b">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={handleBack} className="w-6 h-6 flex items-center justify-center">
            <img src="/backarrow.svg" alt="Back" width={24} height={24} />
          </button>
          <div className="text-gray-400 text-[14px] font-semibold mx-auto">
            Luyona.
          </div>
          <div style={{ width: 24 }}></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-20 px-4">
        <ContentComponent />
      </div>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm flex justify-around items-center h-16">
        {navOptions.map(opt => (
          <button
            key={opt.key}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${
              selected === opt.key ? "text-black font-semibold" : "text-gray-400"
            }`}
            onClick={() => setSelected(opt.key)}
          >
            <span className="text-sm">{opt.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
