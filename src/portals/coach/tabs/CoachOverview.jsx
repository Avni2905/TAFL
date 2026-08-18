import { useState, useEffect } from "react";
import { getAllStudents, getPendingRegistrations } from "../../../services/userService";
import { motion } from "framer-motion";

const CoachOverview = ({ setActiveTab }) => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await getAllStudents();
        const p = await getPendingRegistrations();
        setStudents(s);
        setPending(p);
      } catch (e) {
        console.error("Error loading overview", e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Students", value: students.length, icon: "👥", color: "text-blue-400" },
    { label: "Pending Approvals", value: pending.length, icon: "⏳", color: "text-yellow-400" },
    { label: "Active Coaches", value: "1", icon: "🎾", color: "text-green-400" },
    { label: "Upcoming Matches", value: "—", icon: "🏆", color: "text-orange-400" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-white/50 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-black text-white">Coach Dashboard <span className="text-orange-400">🎾</span></h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{loading ? "..." : stat.value}</div>
            <div className="text-white/40 text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Review Approvals", desc: `${pending.length} pending`, icon: "✅", tab: "approvals" },
          { label: "View Students", desc: `${students.length} registered`, icon: "👥", tab: "students" },
          { label: "Walk-in Registration", desc: "Add new student", icon: "🚶", tab: "walkin" },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            onClick={() => setActiveTab(action.tab)}
            className="bg-white/5 border border-white/10 hover:border-orange-400/40 rounded-2xl p-6 text-left transition-all"
          >
            <div className="text-3xl mb-3">{action.icon}</div>
            <p className="text-white font-semibold">{action.label}</p>
            <p className="text-white/40 text-sm">{loading ? "Loading..." : action.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Pending registrations preview */}
      {!loading && pending.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Pending Approvals</p>
            <button onClick={() => setActiveTab("approvals")} className="text-orange-400 text-sm hover:text-orange-300">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 3).map((reg, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white text-sm font-semibold">{reg.name}</p>
                  <p className="text-white/40 text-xs capitalize">{reg.type} · {Array.isArray(reg.areaOfInterest) ? reg.areaOfInterest[0] : reg.areaOfInterest || "—"}</p>
                </div>
                <span className="text-yellow-400 text-xs bg-yellow-400/10 px-3 py-1 rounded-full">Pending</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {!loading && students.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Recent Students</p>
            <button onClick={() => setActiveTab("students")} className="text-orange-400 text-sm hover:text-orange-300">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {students.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {s.profilePic
                    ? <img src={s.profilePic} alt="" className="w-full h-full object-cover" />
                    : <span className="text-orange-400 font-bold text-xs">{s.name?.[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                  <p className="text-white/40 text-xs">{s.level || "Beginner"}</p>
                </div>
                <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CoachOverview;
