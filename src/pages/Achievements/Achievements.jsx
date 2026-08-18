import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { motion } from "framer-motion";

const highlights = [
  { value: "100+", label: "National Level Titles" },
  { value: "25+", label: "State Level Titles" },
  { value: "10+", label: "ITF / AITA Titles" },
  { value: "50+", label: "Ranked Players" },
];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch all public achievements from all students
        const usersSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "student"))
        );
        const all = [];
        for (const userDoc of usersSnap.docs) {
          const achSnap = await getDocs(
            query(
              collection(db, "users", userDoc.id, "achievements"),
              orderBy("uploadedAt", "desc")
            )
          );
          achSnap.docs.forEach(d => {
            all.push({
              id: d.id,
              studentName: userDoc.data().name,
              studentPic: userDoc.data().profilePic || null,
              ...d.data()
            });
          });
        }
        setAchievements(all);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="pt-20 bg-[#0B3D2E]">
      {/* Header */}
      <section className="py-20 px-6 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Pride of TAFL</p>
          <h1 className="text-5xl font-black text-white mb-4">
            Our <span className="text-orange-400">Achievements</span>
          </h1>
          <p className="text-white/60">Celebrating the champions TAFL has produced</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a2e20] py-16 px-6 border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl font-black text-orange-400">{h.value}</div>
              <div className="text-white/50 text-sm mt-1">{h.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">
            Student <span className="text-orange-400">Achievements</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-white/40">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-white font-semibold">Achievements coming soon</p>
            <p className="text-white/40 text-sm mt-2">Student achievements will be showcased here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach, i) => (
              <motion.div key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 hover:border-orange-400/30 rounded-2xl overflow-hidden transition-all"
              >
                {ach.type === "image" ? (
                  <img src={ach.url} alt={ach.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-orange-500/10 flex items-center justify-center text-5xl">📄</div>
                )}
                <div className="p-4">
                  <p className="text-white font-bold mb-2">{ach.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center overflow-hidden">
                      {ach.studentPic
                        ? <img src={ach.studentPic} alt="" className="w-full h-full object-cover" />
                        : <span className="text-orange-400 text-xs font-bold">{ach.studentName?.[0]}</span>}
                    </div>
                    <p className="text-white/50 text-xs">{ach.studentName}</p>
                  </div>
                  {ach.type === "pdf" && (
                    <a href={ach.url} target="_blank" rel="noopener noreferrer"
                      className="text-orange-400 text-xs mt-2 inline-block hover:text-orange-300">
                      View Certificate →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Achievements;