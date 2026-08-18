import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { uploadAchievement } from "../../../services/userService";
import { db } from "../../../services/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const PlayerAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef();

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", user.uid, "achievements"),
        orderBy("uploadedAt", "desc")
      );
      const snap = await getDocs(q);
      setAchievements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Fetch achievements error", e);
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(selected.type)) {
      setError("Only JPG, PNG, WebP, or PDF files are allowed.");
      return;
    }
    // Validate size
    if (selected.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError("Please enter a title for this achievement.");
      return;
    }
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      await uploadAchievement(user.uid, file, title.trim());
      setTitle("");
      setFile(null);
      setShowForm(false);
      setSuccess("Achievement uploaded successfully!");
      setTimeout(() => setSuccess(""), 4000);
      await fetchAchievements();
    } catch (e) {
      console.error("Upload error:", e);
      setError(e.message || "Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleDelete = async (achId) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "achievements", achId));
      await fetchAchievements();
    } catch (e) {
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Achievements</h2>
          <p className="text-white/40 text-sm">Upload trophies, certificates & medals</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          {showForm ? "✕ Cancel" : "+ Upload Achievement"}
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-400/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
          ✅ {success}
        </div>
      )}

      {/* Upload Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 border border-orange-400/30 rounded-2xl p-6 mb-6"
          >
            <p className="text-white font-semibold mb-4">Add New Achievement</p>

            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                ❌ {error}
              </div>
            )}

            {/* Title */}
            <div className="mb-4">
              <label className="text-white/40 text-xs mb-1 block">Achievement Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && file && handleUpload()}
                placeholder="e.g. Karnataka State Winner 2024"
                className="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* File upload */}
            <div className="mb-4">
              <label className="text-white/40 text-xs mb-1 block">File *</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-orange-400/50 rounded-xl p-6 text-center cursor-pointer transition-all"
              >
                <p className="text-3xl mb-2">{file ? "📎" : "☁️"}</p>
                {file ? (
                  <div>
                    <p className="text-orange-400 font-medium text-sm">{file.name}</p>
                    <p className="text-white/30 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white/50 text-sm">Click to select file</p>
                    <p className="text-white/30 text-xs mt-1">JPG, PNG, PDF — Max 10MB</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Upload button — enabled only when BOTH title and file are set */}
            <button
              onClick={handleUpload}
              disabled={uploading || !file || !title.trim()}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                !file || !title.trim()
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-400 text-white"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : !title.trim() ? "Enter a title first" : !file ? "Select a file first" : "Upload Achievement"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/40 animate-pulse">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🏅</div>
          <p className="text-white font-semibold mb-2">No achievements yet</p>
          <p className="text-white/40 text-sm">Upload your first trophy or certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-400/30 transition-all group"
            >
              {ach.type === "image" ? (
                <img src={ach.url} alt={ach.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <a href={ach.url} target="_blank" rel="noopener noreferrer"
                  className="block w-full h-44 bg-gradient-to-br from-orange-500/10 to-orange-600/5 flex flex-col items-center justify-center gap-2 hover:from-orange-500/20 transition-all">
                  <span className="text-5xl">📄</span>
                  <span className="text-white/40 text-xs">Click to view PDF</span>
                </a>
              )}
              <div className="p-4">
                <p className="text-white text-sm font-semibold mb-2">{ach.title}</p>
                <div className="flex items-center justify-between">
                  <a href={ach.url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-400 text-xs hover:text-orange-300 transition-colors font-medium">
                    View →
                  </a>
                  <button onClick={() => handleDelete(ach.id)}
                    className="text-red-400/40 hover:text-red-400 text-xs transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerAchievements;
