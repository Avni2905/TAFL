import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotApproved = () => {
  return (
    <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-6">😅</div>
        <h2 className="text-3xl font-black text-white mb-3">
          Oops! You're not a student yet.
        </h2>
        <p className="text-white/50 mb-4 leading-relaxed">
          Your registration is pending approval. Please visit the TAFL Academy in person to confirm your interest. Once approved, you'll have full access.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left">
          <p className="text-orange-400 font-semibold text-sm mb-3">What to do next:</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>✅ Visit TAFL Academy in person</li>
            <li>✅ Confirm your interest with the coach</li>
            <li>✅ Wait for approval notification</li>
            <li>✅ Login again once approved</li>
          </ul>
        </div>
        <Link to="/"
          className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-full font-bold transition-all inline-block"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotApproved;