import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitRegistration } from "../../services/userService";
import { Link, useSearchParams } from "react-router-dom";

const JoinNow = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "senior" ? "adult" : null;

  const [type, setType] = useState(initialType);
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", age: "", dob: "",
    school: "", gender: "", playingExperience: "",
    parentName: "", parentPhone: "", parentEmail: "",
    areaOfInterest: [], notes: ""
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleInterest = (val) => {
    setForm(prev => ({
      ...prev,
      areaOfInterest: prev.areaOfInterest.includes(val)
        ? prev.areaOfInterest.filter(i => i !== val)
        : [...prev.areaOfInterest, val]
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      await submitRegistration({ ...form, type, source: "website" });
      setSubmitted(true);
    } catch (e) {
      alert("Submission failed. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) return (
    <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-6 text-4xl">✅</div>
        <h2 className="text-3xl font-black text-white mb-3">Thank You!</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          We appreciate your interest in TAFL Academy. Please visit the academy in person to confirm your interest. Once our coach approves your registration, you will receive access to the student portal.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left">
          <p className="text-orange-400 font-semibold text-sm mb-3">What to do next:</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-center gap-2"><span className="text-orange-400">→</span> Visit TAFL Academy, Bangalore</li>
            <li className="flex items-center gap-2"><span className="text-orange-400">→</span> Meet the coach in person</li>
            <li className="flex items-center gap-2"><span className="text-orange-400">→</span> Confirm your interest within 30 days</li>
            <li className="flex items-center gap-2"><span className="text-orange-400">→</span> Get approved and start training!</li>
          </ul>
        </div>
        <Link to="/" className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-full font-bold transition-all inline-block">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );

  // Type selector
  if (!type) return (
    <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Enroll Now</p>
          <h2 className="text-3xl font-black text-white">Join <span className="text-orange-400">TAFL</span> Academy</h2>
          <p className="text-white/50 text-sm mt-2">Select your registration category:</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setType("minor"); setStep(1); }}
            className="bg-white/5 border-2 border-white/10 hover:border-orange-400 rounded-2xl p-8 text-center transition-all group"
          >
            <div className="text-4xl mb-3">🎾</div>
            <p className="text-white font-bold group-hover:text-orange-400 transition-colors">JUNIOR</p>
            <p className="text-white/40 text-xs mt-1">Below 18 Years</p>
          </button>
          <button
            onClick={() => { setType("adult"); setStep(1); }}
            className="bg-white/5 border-2 border-white/10 hover:border-orange-400 rounded-2xl p-8 text-center transition-all group"
          >
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-white font-bold group-hover:text-orange-400 transition-colors">SENIOR</p>
            <p className="text-white/40 text-xs mt-1">18 Years & Above</p>
          </button>
        </div>
      </motion.div>
    </div>
  );

  const steps = type === "minor"
    ? ["Student Details", "Parent / Guardian Details", "Area of Interest"]
    : ["Personal Details", "Area of Interest"];

  const isLastStep = (type === "adult" && step === 2) || (type === "minor" && step === 3);

  return (
    <div className="min-h-screen bg-[#0B3D2E] px-4 pt-24 pb-12">
      <div className="max-w-xl mx-auto">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-orange-500 text-white" : "bg-white/10 text-white/40"}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block truncate ${step === i + 1 ? "text-orange-400" : "text-white/30"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${step > i + 1 ? "bg-green-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {/* Step 1 — Student/Personal */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">
                  {type === "minor" ? "Student Details" : "Personal Details"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name *", placeholder: "Enter full name", col: 2 },
                    { key: "dob", label: "Date of Birth", type: "date" },
                    { key: "age", label: "Age *", placeholder: "Enter age" },
                    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                    { key: "phone", label: "Phone Number *", placeholder: "+91XXXXXXXXXX" },
                    { key: "school", label: type === "minor" ? "School Name" : "Occupation", placeholder: type === "minor" ? "School name" : "Occupation" },
                    { key: "playingExperience", label: "Playing Experience", type: "select", options: ["Never played", "Beginner", "Intermediate", "Advanced"], col: 2 },
                  ].map(field => (
                    <div key={field.key} className={field.col === 2 ? "col-span-2" : ""}>
                      <label className="text-white/40 text-xs mb-1 block">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          value={form[field.key]}
                          onChange={e => update(field.key, e.target.value)}
                          className="w-full bg-[#0a2e20] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                        >
                          <option value="">Select...</option>
                          {field.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={form[field.key]}
                          onChange={e => update(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Parent (minor only) */}
            {step === 2 && type === "minor" && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">Parent / Guardian Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "parentName", label: "Parent Name *", placeholder: "Parent full name" },
                    { key: "parentPhone", label: "Parent Phone *", placeholder: "+91XXXXXXXXXX" },
                    { key: "parentEmail", label: "Parent Email", placeholder: "parent@email.com", col: 2 },
                  ].map(field => (
                    <div key={field.key} className={field.col === 2 ? "col-span-2" : ""}>
                      <label className="text-white/40 text-xs mb-1 block">{field.label}</label>
                      <input
                        value={form[field.key]}
                        onChange={e => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last step — Area of Interest */}
            {isLastStep && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Area of Interest</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["Tennis Coaching", "Fitness Training", "Tournament Training", "One to One Coaching"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all text-left
                        ${form.areaOfInterest.includes(opt)
                          ? "border-orange-400 bg-orange-400/10 text-orange-400"
                          : "border-white/10 text-white/50 hover:border-white/30"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => update("notes", e.target.value)}
                    placeholder="Anything you'd like us to know..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => step === 1 ? setType(null) : setStep(step - 1)}
                className="border border-white/10 text-white/50 hover:text-white px-6 py-2 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              {!isLastStep ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!form.name || !form.phone}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.phone}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JoinNow;
