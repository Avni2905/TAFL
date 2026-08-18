import { useState } from "react";
import { submitRegistration, approveRegistration } from "../../../services/userService";
import { motion } from "framer-motion";

// Calculate age from DOB
const calcAge = (dob) => {
  if (!dob) return "";
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age.toString();
};

const CoachWalkIn = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("minor");
  const [ageWarning, setAgeWarning] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", age: "", dob: "",
    school: "", gender: "", playingExperience: "",
    parentName: "", parentPhone: "", parentEmail: "",
    areaOfInterest: [], notes: "", level: "Beginner"
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleDobChange = (dob) => {
    const calculatedAge = calcAge(dob);
    setForm(prev => ({ ...prev, dob, age: calculatedAge }));
    setAgeWarning("");
  };

  const handleAgeChange = (age) => {
    update("age", age);
    if (form.dob && age) {
      const calculatedAge = calcAge(form.dob);
      if (calculatedAge && age !== calculatedAge) {
        setAgeWarning(`⚠️ Age ${age} doesn't match date of birth (expected ${calculatedAge}).`);
      } else {
        setAgeWarning("");
      }
    }
  };

  const toggleInterest = (val) => {
    setForm(prev => ({
      ...prev,
      areaOfInterest: prev.areaOfInterest.includes(val)
        ? prev.areaOfInterest.filter(i => i !== val)
        : [...prev.areaOfInterest, val]
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter student name.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid 10-digit phone number.";
    if (type === "minor" && !form.parentName.trim()) return "Please enter parent name.";
    if (type === "minor" && !form.parentPhone.trim()) return "Please enter parent phone.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const level = form.playingExperience === "Never played" ? "Beginner"
        : form.playingExperience || "Beginner";

      const regId = await submitRegistration({
        ...form,
        level,
        type,
        source: "walkin",
        status: "pending"
      });
      await approveRegistration(regId, { ...form, level, type, source: "walkin" });
      setSubmitted(true);
    } catch (e) {
      console.error("Walk-in error", e);
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setError("");
    setAgeWarning("");
    setForm({
      name: "", phone: "", age: "", dob: "",
      school: "", gender: "", playingExperience: "",
      parentName: "", parentPhone: "", parentEmail: "",
      areaOfInterest: [], notes: "", level: "Beginner"
    });
  };

  if (submitted) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="text-2xl font-black text-white mb-2">Student Registered!</h2>
      <p className="text-white/50 mb-4">
        Profile created for <span className="text-orange-400 font-semibold">{form.name}</span>
      </p>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xs mx-auto mb-6 text-left space-y-2">
        <p className="text-white text-sm">📱 <span className="text-white/50">Phone:</span> <span className="text-orange-400">{form.phone}</span></p>
        <p className="text-white text-sm">🔑 <span className="text-white/50">Login via OTP to</span> <span className="text-orange-400">Player Portal</span></p>
      </div>
      <button onClick={resetForm}
        className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-xl font-bold transition-all">
        Register Another Student
      </button>
    </motion.div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Walk-in Registration</h2>
        <p className="text-white/40 text-sm">Register a student who visited in person — profile created instantly</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { value: "minor", label: "Junior (Below 18)", icon: "🎾" },
          { value: "adult", label: "Senior (18+)", icon: "🏆" },
        ].map(t => (
          <button key={t.value} onClick={() => setType(t.value)}
            className={`py-3 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2
              ${type === t.value
                ? "border-orange-400 bg-orange-400/10 text-orange-400"
                : "border-white/10 text-white/40 hover:border-white/30"}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          ❌ {error}
        </div>
      )}

      {ageWarning && (
        <div className="bg-yellow-500/10 border border-yellow-400/30 text-yellow-400 text-sm px-4 py-3 rounded-xl mb-4">
          {ageWarning}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

        {/* Student Details */}
        <div>
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-3">
            {type === "minor" ? "Student Details" : "Personal Details"}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Full Name *</label>
              <input value={form.name} onChange={e => update("name", e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Phone Number *</label>
              <input value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit number"
                maxLength={10}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Gender</label>
              <select value={form.gender} onChange={e => update("gender", e.target.value)}
                className="w-full bg-[#0a2e20] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={e => handleDobChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Age</label>
              <input
                value={form.age}
                onChange={e => handleAgeChange(e.target.value)}
                placeholder="Auto-filled from DOB"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">
                {type === "minor" ? "School Name" : "Occupation"}
              </label>
              <input value={form.school} onChange={e => update("school", e.target.value)}
                placeholder={type === "minor" ? "School name" : "Occupation"}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Playing Experience</label>
              <select value={form.playingExperience} onChange={e => update("playingExperience", e.target.value)}
                className="w-full bg-[#0a2e20] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                <option value="">Select level</option>
                <option>Never played</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parent Details (minor only) */}
        {type === "minor" && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-3">Parent / Guardian Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/40 text-xs mb-1 block">Parent Name *</label>
                <input value={form.parentName} onChange={e => update("parentName", e.target.value)}
                  placeholder="Parent full name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Parent Phone *</label>
                <input value={form.parentPhone} onChange={e => update("parentPhone", e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit number"
                  maxLength={10}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="col-span-2">
                <label className="text-white/40 text-xs mb-1 block">Parent Email</label>
                <input value={form.parentEmail} onChange={e => update("parentEmail", e.target.value)}
                  placeholder="parent@email.com" type="email"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          </div>
        )}

        {/* Area of Interest */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-3">Area of Interest</p>
          <div className="grid grid-cols-2 gap-3">
            {["Tennis Coaching", "Fitness Training", "Tournament Training", "One to One Coaching"].map(opt => (
              <button key={opt} onClick={() => toggleInterest(opt)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all text-left
                  ${form.areaOfInterest.includes(opt)
                    ? "border-orange-400 bg-orange-400/10 text-orange-400"
                    : "border-white/10 text-white/50 hover:border-white/30"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="pt-4 border-t border-white/10">
          <label className="text-white/40 text-xs mb-1 block">Additional Notes</label>
          <textarea value={form.notes} onChange={e => update("notes", e.target.value)}
            placeholder="Any additional information about the student..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none" />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.phone}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Registering...
            </span>
          ) : "Register Student"}
        </button>
      </div>
    </div>
  );
};

export default CoachWalkIn;
