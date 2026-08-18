import { useState, useEffect } from "react";
import { getPendingRegistrations, approveRegistration, rejectRegistration } from "../../../services/userService";
import { motion, AnimatePresence } from "framer-motion";

const CoachApprovals = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null); // id of registration being processed
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const list = await getPendingRegistrations();
      // Filter out registrations that are expired
      const active = list.filter(reg => {
        if (!reg.expiresAt) return true;
        const expiry = reg.expiresAt.toDate ? reg.expiresAt.toDate() : new Date(reg.expiresAt);
        return expiry > new Date();
      });
      setRegistrations(active);
    } catch (e) {
      console.error("Error fetching registrations", e);
    }
    setLoading(false);
  };

  const handleApprove = async (reg) => {
    setActioning(reg.id);
    setMessage("");
    try {
      await approveRegistration(reg.id, reg);
      setMessage(`Approved ${reg.name} successfully! Student profile created with default password 'Tafl@123'.`);
      await fetchRegistrations();
    } catch (e) {
      console.error("Error approving registration", e);
      setMessage("Error approving registration. Try again.");
    }
    setActioning(null);
  };

  const handleReject = async (id) => {
    setActioning(id);
    setMessage("");
    try {
      await rejectRegistration(id);
      setMessage("Registration rejected successfully.");
      await fetchRegistrations();
    } catch (e) {
      console.error("Error rejecting registration", e);
      setMessage("Error rejecting registration.");
    }
    setActioning(null);
  };

  const getDaysRemaining = (expiresAt) => {
    if (!expiresAt) return 30;
    const expiry = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
    const diff = expiry - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? 0 : days;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">REGISTRATION APPROVALS</h1>
        <p className="text-white/40 text-sm">Review and approve online registrations. Profiles expire 30 days after submission.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm border ${
          message.includes("Error") 
            ? "bg-red-500/10 border-red-500/30 text-red-400" 
            : "bg-green-500/10 border-green-500/30 text-green-400"
        }`}>
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-white/40 text-center py-12">Loading pending registrations...</p>
      ) : registrations.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-white font-semibold">No pending registrations</p>
          <p className="text-white/40 text-sm mt-1">All registrations have been processed or have expired.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {registrations.map((reg) => {
              const daysLeft = getDaysRemaining(reg.expiresAt);
              const isMinor = reg.type === "minor";

              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex-1 space-y-4">
                    {/* Basic Info Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{reg.name}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        isMinor ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {isMinor ? "👦 Minor" : "🧑 Adult"}
                      </span>
                      <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">
                        ⏳ {daysLeft} days remaining
                      </span>
                    </div>

                    {/* Registration details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                      <div>
                        <p className="text-white/30 text-xs uppercase font-semibold">Contact Details</p>
                        <p className="mt-1 font-medium">{reg.phone}</p>
                        <p className="text-white/40 text-xs">DOB: {reg.dob || "—"} ({reg.age} yrs)</p>
                        <p className="text-white/40 text-xs capitalize">Gender: {reg.gender || "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs uppercase font-semibold">Experience & School</p>
                        <p className="mt-1 font-medium">{reg.playingExperience || "No experience listed"}</p>
                        <p className="text-white/40 text-xs truncate">{isMinor ? "School:" : "Occ:"} {reg.school || "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs uppercase font-semibold">Areas of Interest</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {reg.areaOfInterest && reg.areaOfInterest.length > 0 ? (
                            reg.areaOfInterest.map((interest, i) => (
                              <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded">
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/40 text-xs">None listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Parent info for Minor */}
                    {isMinor && (
                      <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-white/70">
                        <p className="text-white/30 text-xs uppercase font-semibold mb-1">Parent / Guardian Information</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <p>👤 <span className="font-semibold">{reg.parentName}</span></p>
                          <p>📞 {reg.parentPhone}</p>
                          {reg.parentEmail && <p>✉️ {reg.parentEmail}</p>}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {reg.notes && (
                      <div className="text-sm bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-orange-400/90 italic">
                        💬 Notes: "{reg.notes}"
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex md:flex-col items-center justify-end gap-3 shrink-0 self-center w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(reg)}
                      disabled={actioning !== null}
                      className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 min-w-[120px]"
                    >
                      {actioning === reg.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(reg.id)}
                      disabled={actioning !== null}
                      className="flex-1 md:flex-none border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 min-w-[120px]"
                    >
                      {actioning === reg.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CoachApprovals;
