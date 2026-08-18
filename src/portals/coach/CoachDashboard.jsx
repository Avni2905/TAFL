import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CoachOverview from "./tabs/CoachOverview";
import CoachStudents from "./tabs/CoachStudents";
import CoachApprovals from "./tabs/CoachApprovals";
import CoachWalkIn from "./tabs/CoachWalkIn";
import CoachGallery from "./tabs/CoachGallery";
import CoachSiteEditor from "./tabs/CoachSiteEditor";
import CoachSettings from "./tabs/CoachSettings";

const navItems = [
  { id: "overview", label: "Dashboard", icon: "🏠" },
  { id: "students", label: "Students", icon: "👥" },
  { id: "approvals", label: "Approvals", icon: "✅" },
  { id: "walkin", label: "Walk-in", icon: "🚶" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "siteeditor", label: "Edit Website", icon: "✏️" },
  { id: "settings", label: "My Profile", icon: "👤" },
];

const CoachDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "students": return <CoachStudents />;
      case "approvals": return <CoachApprovals />;
      case "walkin": return <CoachWalkIn />;
      case "gallery": return <CoachGallery />;
      case "siteeditor": return <CoachSiteEditor />;
      case "settings": return <CoachSettings />;
      default: return <CoachOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3D2E] flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-[#072b1e] border-r border-white/10 flex flex-col min-h-screen fixed top-0 left-0 z-40`}>

        {/* Logo + toggle */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 min-h-[72px]">
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-orange-400 font-black text-xl leading-none">TAFL</p>
              <p className="text-white/40 text-xs mt-0.5">Coach Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all flex-shrink-0"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Coach profile */}
        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/30 border border-orange-400/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.profilePic
                  ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                  : <span className="text-orange-400 font-black">{user?.name?.[0] || "C"}</span>}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user?.name || "Coach"}</p>
                <p className="text-orange-400 text-xs capitalize">{user?.role || "Coach"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                ${activeTab === item.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"}`}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout — clearly visible */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-medium border border-red-500/20`}
            title={!sidebarOpen ? "Logout" : ""}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300 p-6 min-h-screen`}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </main>
    </div>
  );
};

export default CoachDashboard;
