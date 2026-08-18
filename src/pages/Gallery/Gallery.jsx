import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? media : media.filter(m => m.type === filter);

  return (
    <div className="pt-20 bg-[#0B3D2E]">
      {/* Header */}
      <section className="py-20 px-6 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Moments</p>
          <h1 className="text-5xl font-black text-white mb-4">
            Our <span className="text-orange-400">Gallery</span>
          </h1>
          <p className="text-white/60">Photos and videos from the academy and our students</p>
        </motion.div>
      </section>

      {/* Filter tabs */}
      <div className="flex justify-center gap-3 mb-10 px-6">
        {["all", "image", "video"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all
              ${filter === f ? "bg-orange-500 text-white" : "border border-white/20 text-white/50 hover:border-orange-400 hover:text-orange-400"}`}>
            {f === "all" ? "All" : f === "image" ? "📷 Photos" : "🎥 Videos"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="pb-20 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-white/40">Loading gallery...</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="text-white font-semibold">No media yet</p>
            <p className="text-white/40 text-sm mt-2">Check back soon — photos and videos will appear here</p>
          </motion.div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(item)}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
              >
                {item.type === "video" ? (
                  <video src={item.url} className="w-full rounded-xl" />
                ) : (
                  <img src={item.url} alt={item.caption || ""} className="w-full rounded-xl group-hover:scale-105 transition-transform duration-300" />
                )}
                {item.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-end p-3 rounded-xl">
                    <p className="text-white text-xs">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl">✕</button>
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            {selected.type === "video" ? (
              <video src={selected.url} controls className="w-full rounded-2xl" />
            ) : (
              <img src={selected.url} alt="" className="w-full rounded-2xl object-contain max-h-[85vh]" />
            )}
            {selected.caption && (
              <p className="text-white/60 text-sm text-center mt-3">{selected.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;