import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const programs = [
  { title: "Beginner", age: "All ages", desc: "Foundation skills, grip, stance, basic strokes. Perfect for first-timers.", timings: "Morning / Evening", fee: 2000 },
  { title: "Intermediate", age: "All ages", desc: "Rally consistency, footwork, serve technique, and match play introduction.", timings: "Morning / Evening / Weekend", fee: 2500 },
  { title: "Advanced", age: "12+", desc: "Competitive match training, tournament prep, tactical development.", timings: "Morning / Evening", fee: 3500 },
  { title: "One to One", age: "Advanced players only", desc: "Private coaching sessions tailored for tournament-level players.", timings: "Flexible", fee: 5000 },
];

const FeeCalculator = () => {
  const [level, setLevel] = useState("Beginner");
  const [sessions, setSessions] = useState(12);
  const base = { Beginner: 2000, Intermediate: 2500, Advanced: 3500, "One to One": 5000 };
  const estimate = Math.round((base[level] / 12) * sessions);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
      <h3 className="text-white font-bold text-lg mb-4 text-center">💰 Fee Calculator</h3>
      <div className="mb-4">
        <label className="text-white/40 text-xs mb-1 block">Training Level</label>
        <select value={level} onChange={e => setLevel(e.target.value)}
          className="w-full bg-[#0a2e20] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400">
          {Object.keys(base).map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="mb-6">
        <label className="text-white/40 text-xs mb-1 block">Sessions per month: <span className="text-orange-400">{sessions}</span></label>
        <input type="range" min={4} max={24} value={sessions} onChange={e => setSessions(Number(e.target.value))}
          className="w-full accent-orange-500" />
      </div>
      <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4 text-center">
        <p className="text-white/50 text-xs mb-1">Estimated Monthly Fee</p>
        <p className="text-orange-400 text-3xl font-black">₹{estimate.toLocaleString()}</p>
        <p className="text-white/30 text-xs mt-1">*Approximate estimate. Visit academy for exact pricing.</p>
      </div>
    </div>
  );
};

const Programs = () => (
  <div className="pt-20 bg-[#0B3D2E]">
    <section className="py-20 px-6 text-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Training</p>
        <h1 className="text-5xl font-black text-white mb-4">Our <span className="text-orange-400">Programs</span></h1>
        <p className="text-white/60">Structured training for every age group and skill level</p>
      </motion.div>
    </section>

    {/* Program cards */}
    <section className="pb-20 px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {programs.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 hover:border-orange-400/40 rounded-2xl p-6 transition-all">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-black text-xl">{p.title}</h3>
              <span className="text-orange-400 text-xs bg-orange-400/10 px-3 py-1 rounded-full">{p.age}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{p.desc}</p>
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs">⏰ {p.timings}</p>
              <p className="text-orange-400 font-bold">from ₹{p.fee.toLocaleString()}/mo</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Batch timings */}
      <div className="bg-[#0a2e20] border border-white/10 rounded-2xl p-8 mb-16">
        <h3 className="text-white font-black text-xl text-center mb-6">Batch Timings</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[{ time: "6:00 AM – 8:00 AM", label: "Morning" }, { time: "5:00 PM – 7:00 PM", label: "Evening" }, { time: "7:00 AM – 10:00 AM", label: "Weekend" }].map((b, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4">
              <p className="text-orange-400 font-bold text-sm">{b.label}</p>
              <p className="text-white/60 text-xs mt-1">{b.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fee calculator */}
      <FeeCalculator />

      <div className="text-center mt-10">
        <Link to="/join" className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-full font-bold transition-all inline-block">
          Enroll Now
        </Link>
      </div>
    </section>
  </div>
);

export default Programs;