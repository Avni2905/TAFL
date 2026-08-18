import { useState, useEffect } from "react";
import { addGalleryMedia, deleteGalleryMedia } from "../../../services/userService";
import { db } from "../../../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";

const CoachGallery = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await addGalleryMedia(file, caption);
      setFile(null);
      setCaption("");
      await fetchMedia();
    } catch (e) {
      setError("Upload failed. Please try again.");
      console.error(e);
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media?")) return;
    await deleteGalleryMedia(id);
    await fetchMedia();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Gallery Management</h2>
        <p className="text-white/40 text-sm">Upload and manage academy photos and videos</p>
      </div>

      {/* Upload */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-white font-semibold mb-4">Upload Media</p>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-3">
            {error}
          </div>
        )}

        <input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 mb-3"
        />

        <label
          htmlFor="gallery-upload"
          className="block border-2 border-dashed border-white/20 hover:border-orange-400/50 rounded-xl p-6 text-center cursor-pointer transition-all mb-4"
        >
          <p className="text-3xl mb-2">🖼️</p>
          <p className="text-white/50 text-sm">
            {file ? <span className="text-orange-400 font-medium">{file.name}</span> : "Click to upload photo or video"}
          </p>
          <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} className="hidden" id="gallery-upload" />
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload to Gallery"}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/40 animate-pulse">Loading gallery...</div>
      ) : media.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-white font-semibold">No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative group rounded-xl overflow-hidden aspect-square bg-white/5 border border-white/10"
            >
              {item.type === "video"
                ? <video src={item.url} className="w-full h-full object-cover" />
                : <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                {item.caption && <p className="text-white text-xs text-center">{item.caption}</p>}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-400 text-white text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachGallery;
