import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSiteContent } from "../../services/userService";

const coaches = [
  { name: "Rahul Sharma", role: "Head Coach", exp: "15+ years", spec: "Advanced Training & Tournaments" },
  { name: "Priya Menon", role: "Junior Coach", exp: "8+ years", spec: "Junior Development & Beginner Batches" },
];

const facilities = [
  { icon: "🎾", title: "4 Clay Courts", desc: "Professional clay courts maintained to international standards" },
  { icon: "💪", title: "Fitness Center", desc: "Fully equipped gym for strength and conditioning" },
  { icon: "🎥", title: "Video Analysis", desc: "Game footage analysis for performance improvement" },
  { icon: "🏥", title: "Physiotherapy", desc: "On-site physio support for injury prevention" },
];

const About = () => {
  const [content, setContent] = useState({
    academyName: "TAFL Academy",
    aboutDescription: "TAFL Academy is a premier tennis training institute in Bangalore, dedicated to developing players with the right blend of technique, discipline and sportsmanship.",
    vision: "To be South India's most respected tennis academy — producing champions who excel on and off the court.",
    motto: "Discipline. Dedication. Domination.",
  });

  useEffect(() => {
    const load = async () => {
      const data = await getSiteContent();
      setContent({
        academyName: data.academyName || "TAFL Academy",
        aboutDescription: data.aboutDescription || "TAFL Academy is a premier tennis training institute in Bangalore, dedicated to developing players with the right blend of technique, discipline and sportsmanship.",
        vision: data.vision || "To be South India's most respected tennis academy — producing champions who excel on and off the court.",
        motto: data.motto || "Discipline. Dedication. Domination.",
      });
    };
    load();
  }, []);

  return (
  <div className="pt-20 bg-[#0B3D2E]">
    {/* Hero */}
    <section className="py-20 px-6 text-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Who We Are</p>
        <h1 className="text-5xl font-black text-white mb-4">About <span className="text-orange-400">{content.academyName}</span></h1>
        <p className="text-white/60 leading-relaxed">
          {content.aboutDescription}
        </p>
      </motion.div>
    </section>

    {/* Vision */}
    <section className="py-16 px-6 bg-[#0a2e20]">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {[
          { title: "Our Vision", text: content.vision, icon: "🎯" },
          { title: "Our Motto", text: `${content.motto} — Three pillars that define every TAFL student.`, icon: "💬" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-orange-400 font-bold text-lg mb-3">{item.title}</h3>
            <p className="text-white/60 leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Coaches */}
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Our Team</p>
        <h2 className="text-4xl font-black text-white">Meet the <span className="text-orange-400">Coaches</span></h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {coaches.map((coach, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-400/40 flex items-center justify-center text-2xl font-black text-orange-400 flex-shrink-0">
              {coach.name[0]}
            </div>
            <div>
              <p className="text-white font-bold">{coach.name}</p>
              <p className="text-orange-400 text-sm">{coach.role}</p>
              <p className="text-white/40 text-xs mt-1">{coach.exp} · {coach.spec}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Facilities */}
    <section className="py-20 px-6 bg-[#0a2e20]">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Infrastructure</p>
          <h2 className="text-4xl font-black text-white">Our <span className="text-orange-400">Facilities</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facilities.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-orange-400/30 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="text-white font-semibold text-sm mb-2">{f.title}</p>
              <p className="text-white/40 text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
  );
};

export default About;