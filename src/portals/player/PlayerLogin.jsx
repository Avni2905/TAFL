import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP, verifyOTP } from "../../services/authService";
import { motion } from "framer-motion";

const PlayerLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (phone.length < 10) return setError("Enter a valid 10-digit phone number");
    setError("");
    setLoading(true);
    try {
      await sendOTP(phone);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError("Enter 6-digit OTP");
    setError("");
    setLoading(true);
    try {
      await verifyOTP(otp, ["student"]);
      navigate("/portal/player/dashboard");
    } catch (err) {
      if (err.message === "NOT_APPROVED") navigate("/portal/player/not-approved");
      else if (err.message === "NOT_REGISTERED") setError("You are not registered in TAFL. Please register first.");
      else if (err.message === "ACCESS_DENIED") setError("This portal is for students only.");
      else setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center px-4">
      <div id="recaptcha-container" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center mx-auto mb-4 text-3xl">🎾</div>
          <h2 className="text-2xl font-bold text-white">Player Portal</h2>
          <p className="text-white/50 text-sm mt-1">Login with your registered phone number</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <label className="text-white/60 text-sm mb-2 block">Phone Number</label>
            <div className="flex gap-2 mb-6">
              <span className="bg-white/10 border border-white/10 text-white px-3 py-3 rounded-xl text-sm flex-shrink-0">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && handleSendOTP()}
                placeholder="9876543210"
                autoFocus
                className="flex-1 bg-white/10 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <button onClick={handleSendOTP} disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 mb-4">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <p className="text-white/60 text-sm mb-2">
              OTP sent to <span className="text-orange-400">+91 {phone}</span>
            </p>
            <label className="text-white/60 text-sm mb-2 block">Enter OTP</label>
            <input
              type="tel"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleVerifyOTP()}
              placeholder="6-digit OTP"
              autoFocus
              className="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 mb-4"
            />
            <button onClick={handleVerifyOTP} disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 mb-3">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button onClick={() => { setStep(1); setOtp(""); setError(""); }}
              className="w-full text-white/40 hover:text-white text-sm transition-colors">
              ← Change number
            </button>
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-white/30 hover:text-white text-sm transition-colors">← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerLogin;
