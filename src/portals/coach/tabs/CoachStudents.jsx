import { useState, useEffect } from "react";
import { getAllStudents, updateUserProfile, deleteStudent } from "../../../services/userService";
import { motion, AnimatePresence } from "framer-motion";

const StudentModal = ({ student, onClose, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: student.name || "",
    phone: student.phone || "",
    age: student.age || "",
    gender: student.gender || "",
    school: student.school || "",
    level: student.level || "Beginner",
    playingExperience: student.playingExperience || "",
    coach: student.coach || "",
    areaOfInterest: Array.isArray(student.areaOfInterest)
      ? student.areaOfInterest.join(", ")
      : student.areaOfInterest || "",
    parentName: student.parentName || "",
    parentPhone: student.parentPhone || "",
    parentEmail: student.parentEmail || "",
    notes: student.notes || "",
    status: student.status || "approved",
  });

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile(student.uid, form);
    setSaving(false);
    setEditing(false);
    onSave();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${student.name} from the system? This cannot be undone.`)) return;
    await deleteStudent(student.uid);
    onDelete();
    onClose();
  };

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "phone", label: "Phone", disabled: true },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { key: "school", label: "School / College" },
    { key: "level", label: "Training Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { key: "playingExperience", label: "Playing Experience", type: "select", options: ["Never played", "Beginner", "Intermediate", "Advanced"] },
    { key: "coach", label: "Assigned Coach" },
    { key: "areaOfInterest", label: "Area of Interest" },
    { key: "parentName", label: "Parent Name" },
    { key: "parentPhone", label: "Parent Phone" },
    { key: "parentEmail", label: "Parent Email" },
    { key: "status", label: "Status", type: "select", options: ["approved", "suspended"] },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0B3D2E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0B3D2E] z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center overflow-hidden">
              {student.profilePic
                ? <img src={student.profilePic} alt="" className="w-full h-full object-cover" />
                : <span className="text-orange-400 font-black text-lg">{student.name?.[0]}</span>}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{student.name}</p>
              <p className="text-orange-400 text-xs">{student.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                ✏️ Edit
              </button>
            ) : (
              <>
                <button onClick={() => setEditing(false)}
                  className="border border-white/20 text-white/60 px-4 py-2 rounded-xl text-sm transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
            <button onClick={onClose}
              className="text-white/40 hover:text-white px-3 py-2 rounded-xl transition-all text-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-2">{field.label}</label>
              {editing && !field.disabled ? (
                field.type === "select" ? (
                  <select
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-[#0a2e20] text-white text-sm focus:outline-none border-b border-orange-400/50 pb-1"
                  >
                    <option value="">Select...</option>
                    {field.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-transparent text-white text-sm focus:outline-none border-b border-orange-400/50 pb-1"
                  />
                )
              ) : (
                <p className="text-white text-sm">{form[field.key] || "—"}</p>
              )}
            </div>
          ))}
        </div>

        {/* Delete */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleDelete}
            className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            🗑️ Remove Student from System
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CoachStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    const s = await getAllStudents();
    setStudents(s);
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search) ||
    s.level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Students</h2>
          <p className="text-white/40 text-sm">{students.length} registered students · Click any student to view / edit</p>
        </div>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, phone, or level..."
        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 mb-6"
      />

      {loading ? (
        <div className="text-center py-12 text-white/40 animate-pulse">Loading students...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-white font-semibold">No students found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((student, i) => (
            <motion.div
              key={student.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(student)}
              className="bg-white/5 border border-white/10 hover:border-orange-400/40 rounded-2xl px-5 py-4 flex items-center gap-4 transition-all cursor-pointer hover:bg-white/8"
            >
              <div className="w-11 h-11 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {student.profilePic
                  ? <img src={student.profilePic} alt="" className="w-full h-full object-cover" />
                  : <span className="text-orange-400 font-bold">{student.name?.[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{student.name}</p>
                <p className="text-white/40 text-xs">{student.phone} · {student.school || "—"}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  student.level === "Advanced" ? "bg-orange-500/20 text-orange-400" :
                  student.level === "Intermediate" ? "bg-blue-500/20 text-blue-400" :
                  "bg-white/10 text-white/50"
                }`}>
                  {student.level || "Beginner"}
                </span>
                <span className="text-xs bg-green-400/10 text-green-400 px-3 py-1 rounded-full">Active</span>
                <span className="text-white/20 text-sm">›</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <StudentModal
            student={selected}
            onClose={() => setSelected(null)}
            onSave={() => { loadStudents(); setSelected(null); }}
            onDelete={() => loadStudents()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachStudents;
