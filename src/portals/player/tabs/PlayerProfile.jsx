import { useState, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { updateUserProfile, uploadProfilePicture } from "../../../services/userService";
import { motion } from "framer-motion";

const levelMap = {
  "Never played": "Beginner",
  "Beginner": "Beginner",
  "Intermediate": "Intermediate",
  "Advanced": "Advanced",
};

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

const PlayerProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [saveMsg, setSaveMsg] = useState("");
  const [ageWarning, setAgeWarning] = useState("");
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: user?.age || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    school: user?.school || "",
    level: user?.level || levelMap[user?.playingExperience] || "Beginner",
    playingExperience: user?.playingExperience || "",
    coach: user?.coach || "",
    areaOfInterest: Array.isArray(user?.areaOfInterest)
      ? user.areaOfInterest.join(", ")
      : user?.areaOfInterest || "",
    parentName: user?.parentName || "",
    parentPhone: user?.parentPhone || "",
  });

  // Auto-calculate age from DOB and warn on mismatch
  const handleDobChange = (dob) => {
    const calculatedAge = calcAge(dob);
    setForm(prev => ({ ...prev, dob, age: calculatedAge }));
    if (form.age && calculatedAge && form.age !== calculatedAge) {
      setAgeWarning(`Age updated to ${calculatedAge} based on date of birth.`);
      setTimeout(() => setAgeWarning(""), 4000);
    }
  };

  const handleAgeChange = (age) => {
    setForm(prev => ({ ...prev, age }));
    if (form.dob) {
      const calculatedAge = calcAge(form.dob);
      if (calculatedAge && age !== calculatedAge) {
        setAgeWarning(`⚠️ Age ${age} doesn't match your date of birth (should be ${calculatedAge}).`);
      } else {
        setAgeWarning("");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      // Clean up the data before saving
      const cleanData = {
        name: form.name,
        age: form.age,
        dob: form.dob,
        gender: form.gender,
        school: form.school,
        level: form.level,
        playingExperience: form.playingExperience,
        coach: form.coach,
        areaOfInterest: form.areaOfInterest,
        parentName: form.parentName,
        parentPhone: form.parentPhone,
      };
      await updateUserProfile(user.uid, cleanData);
      setSaveMsg("✅ Profile updated successfully!");
      setEditing(false);
      setAgeWarning("");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (e) {
      console.error("Save error:", e);
      setSaveMsg("❌ Error saving. Please try again.");
    }
    setSaving(false);
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveMsg("❌ Please select an image file.");
      return;
    }

    setUploadingPic(true);
    setSaveMsg("Uploading photo...");
    try {
      const url = await uploadProfilePicture(user.uid, file);
      setProfilePic(url);
      setSaveMsg("✅ Profile photo updated!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      console.error("Pic upload error:", e);
      setSaveMsg(`❌ ${e.message}`);
    }
    setUploadingPic(false);
  };

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "phone", label: "Phone Number", disabled: true },
    { key: "dob", label: "Date of Birth", type: "date", onChange: handleDobChange },
    { key: "age", label: "Age", onChange: handleAgeChange },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { key: "school", label: "School / College / Occupation" },
    { key: "level", label: "Training Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { key: "playingExperience", label: "Playing Experience", type: "select", options: ["Never played", "Beginner", "Intermediate", "Advanced"] },
    { key: "coach", label: "Assigned Coach" },
    { key: "areaOfInterest", label: "Area of Interest" },
    { key: "parentName", label: "Parent / Guardian Name" },
    { key: "parentPhone", label: "Parent Phone" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">My Profile</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all">
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setEditing(false); setSaveMsg(""); setAgeWarning(""); }}
              className="border border-white/20 text-white/60 hover:text-white px-5 py-2 rounded-xl text-sm transition-all">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {saveMsg && (
        <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${
          saveMsg.includes("❌") ? "bg-red-500/10 border border-red-400/30 text-red-400"
          : saveMsg.includes("✅") ? "bg-green-500/10 border border-green-400/30 text-green-400"
          : "bg-blue-500/10 border border-blue-400/30 text-blue-400"
        }`}>
          {saveMsg}
        </div>
      )}

      {ageWarning && (
        <div className="text-sm px-4 py-3 rounded-xl mb-4 bg-yellow-500/10 border border-yellow-400/30 text-yellow-400">
          {ageWarning}
        </div>
      )}

      {/* Profile Picture */}
      <div className="flex items-center gap-6 mb-6 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-orange-500/20 border-2 border-orange-400/40 flex items-center justify-center overflow-hidden">
            {uploadingPic ? (
              <div className="text-white/40 text-xs text-center animate-pulse px-2">Uploading...</div>
            ) : profilePic ? (
              <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-3xl">{user?.name?.[0] || "P"}</span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingPic}
            className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-lg"
            title="Change photo"
          >
            <span className="text-white text-xs">📷</span>
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePicUpload} className="hidden" />
        </div>
        <div>
          <p className="text-white font-bold text-xl">{user?.name}</p>
          <p className="text-orange-400 text-sm">Student · TAFL Academy</p>
          <p className="text-white/40 text-xs mt-1">Click 📷 to update photo (JPG, PNG, max 10MB)</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">{form.level}</span>
            {form.areaOfInterest && (
              <span className="text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full truncate max-w-[180px]">
                {form.areaOfInterest}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="text-white/40 text-xs uppercase tracking-wide block mb-2">{field.label}</label>
            {editing && !field.disabled ? (
              field.type === "select" ? (
                <select
                  value={form[field.key]}
                  onChange={e => {
                    if (field.onChange) field.onChange(e.target.value);
                    else setForm({ ...form, [field.key]: e.target.value });
                  }}
                  className="w-full bg-[#0a2e20] text-white text-sm focus:outline-none border-b border-orange-400/50 pb-1"
                >
                  <option value="">Select...</option>
                  {field.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={e => {
                    if (field.onChange) field.onChange(e.target.value);
                    else setForm({ ...form, [field.key]: e.target.value });
                  }}
                  onKeyDown={e => e.key === "Enter" && !saving && handleSave()}
                  className="w-full bg-transparent text-white text-sm focus:outline-none border-b border-orange-400/50 pb-1"
                />
              )
            ) : (
              <p className="text-white text-sm">{form[field.key] || "—"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerProfile;
