import { motion } from "framer-motion";

const PlayerTournaments = () => {
  const openAITA = () => {
    const url = "https://www.aitatennis.com";
    const win = window.open(url, "_blank");
    // Fallback if popup blocked
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = url;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">Tournaments</h2>
      <p className="text-white/40 text-sm mb-8">Register and track your tournament journey</p>

      {/* AITA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-400/30 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-orange-400 font-bold text-lg mb-1">🏆 AITA Tournament Calendar</p>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Browse upcoming AITA-sanctioned tournaments across India. Register directly on the official AITA website and track your matches here.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={openAITA}
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              >
                Open AITA Website →
              </button>
              <a
                href="https://www.aitatennis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Direct Link ↗
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: "📋", title: "How to Register", desc: "Visit AITA website → Find upcoming tournaments → Click Register → Complete entry form" },
          { icon: "📞", title: "Need Help?", desc: "Contact your coach for tournament recommendations and guidance on which events to enter." },
          { icon: "🎾", title: "Eligibility", desc: "Ensure you meet age and ranking requirements for each tournament category before registering." },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <p className="text-2xl mb-2">{card.icon}</p>
            <p className="text-white font-semibold text-sm mb-2">{card.title}</p>
            <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🎾</div>
        <p className="text-white font-semibold mb-2">No tournaments registered yet</p>
        <p className="text-white/40 text-sm">Visit AITA to register for upcoming tournaments</p>
      </div>
    </div>
  );
};

export default PlayerTournaments;
