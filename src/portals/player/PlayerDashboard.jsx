import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlayerProfile from "./tabs/PlayerProfile";
import PlayerTournaments from "./tabs/PlayerTournaments";
import PlayerAchievements from "./tabs/PlayerAchievements";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "tournaments", label: "Tournaments", icon: "🏆" },
  { id: "achievements", label: "Achievements", icon: "🥇" },
];

const PlayerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <PlayerProfile />;
      case "tournaments": return <PlayerTournaments />;
      case "achievements": return <PlayerAchievements />;
      default: return <DashboardHome user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3D2E] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-[#072b1e] border-r border-white/10 flex flex-col min-h-screen fixed top-0 left-0 z-40`}>

        <div className="p-4 border-b border-white/10 flex items-center gap-3 min-h-[72px]">
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-orange-400 font-black text-xl leading-none">TAFL</p>
              <p className="text-white/40 text-xs mt-0.5">Player Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all flex-shrink-0"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/30 border border-orange-400/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.profilePic
                  ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                  : <span className="text-orange-400 font-black">{user?.name?.[0] || "P"}</span>}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user?.name || "Player"}</p>
                <p className="text-orange-400 text-xs">{user?.level || "Student"}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
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

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-medium border border-red-500/20"
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

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

const DashboardHome = ({ user, setActiveTab }) => {
  const quickStats = [
    { label: "Training Level", value: user?.level || "Beginner", icon: "📈" },
    { label: "Area of Interest", value: Array.isArray(user?.areaOfInterest) ? user.areaOfInterest[0] || "—" : user?.areaOfInterest || "—", icon: "🎾" },
    { label: "Assigned Coach", value: user?.coach || "TBD", icon: "👨‍🏫" },
    { label: "Member Since", value: user?.createdAt?.toDate?.()?.getFullYear?.() || "2024", icon: "📅" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-white/50 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-black text-white">
          {user?.name || "Player"} <span className="text-orange-400">👋</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-400/30 transition-all"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-white font-bold text-sm truncate">{stat.value}</div>
            <div className="text-white/40 text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Edit My Profile", desc: "Update personal info & photo", icon: "👤", tab: "profile" },
          { label: "Tournaments", desc: "Register & track matches", icon: "🎾", tab: "tournaments" },
          { label: "Achievements", desc: "Upload certificates & trophies", icon: "🥇", tab: "achievements" },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            onClick={() => setActiveTab(action.tab)}
            className="bg-white/5 border border-white/10 hover:border-orange-400/40 rounded-2xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">{action.icon}</div>
            <p className="text-white font-semibold group-hover:text-orange-400 transition-colors">{action.label}</p>
            <p className="text-white/40 text-sm mt-1">{action.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-orange-500/10 border border-orange-400/20 rounded-2xl p-5"
      >
        <p className="text-orange-400 font-semibold text-sm mb-1">🎾 AITA Tournament Calendar</p>
        <p className="text-white/50 text-sm mb-3">Browse and register for upcoming national tournaments.</p>
        <a
          href="https://www.aitatennis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
        >
          Open AITA Calendar →
        </a>
      </motion.div>
    </div>
  );
};

export default PlayerDashboard;
