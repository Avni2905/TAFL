import { useState, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { updateUserProfile, uploadProfilePicture } from "../../../services/userService";

const CoachSettings = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    experience: user?.experience || "",
    specialization: user?.specialization || "",
    bio: user?.bio || "",
  });

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await updateUserProfile(user.uid, {
        name: form.name,
        experience: form.experience,
        specialization: form.specialization,
        bio: form.bio,
      });
      setMsg("✅ Profile saved successfully!");
      setTimeout(() => setMsg(""), 4000);
    } catch (e) {
      console.error("Save error:", e);
      setMsg("❌ Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg("❌ Please select an image file.");
      return;
    }
    setUploadingPic(true);
    setMsg("Uploading photo...");
    try {
      const url = await uploadProfilePicture(user.uid, file);
      setProfilePic(url);
      setMsg("✅ Profile photo updated!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      console.error("Pic upload error:", e);
      setMsg(`❌ ${e.message}`);
    }
    setUploadingPic(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">My Profile</h2>
        <p className="text-white/40 text-sm">Update your coach profile and photo</p>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${
          msg.includes("❌") ? "bg-red-500/10 border border-red-400/30 text-red-400"
          : msg.includes("✅") ? "bg-green-500/10 border border-green-400/30 text-green-400"
          : "bg-blue-500/10 border border-blue-400/30 text-blue-400"
        }`}>
          {msg}
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-white font-semibold mb-4">Profile Photo</p>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-orange-500/20 border-2 border-orange-400/40 flex items-center justify-center overflow-hidden">
              {uploadingPic ? (
                <div className="text-white/40 text-xs animate-pulse text-center px-2">Uploading...</div>
              ) : profilePic ? (
                <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-3xl">{user?.name?.[0] || "C"}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingPic}
              className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-lg"
            >
              <span className="text-white text-xs">📷</span>
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePicUpload} className="hidden" />
          </div>
          <div>
            <p className="text-white font-bold">{user?.name}</p>
            <p className="text-orange-400 text-sm capitalize">{user?.role}</p>
            <p className="text-white/40 text-xs mt-2">Click 📷 to change photo (JPG, PNG, max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-white font-semibold mb-4">Profile Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { key: "name", label: "Full Name" },
            { key: "phone", label: "Phone (cannot change)", disabled: true },
            { key: "experience", label: "Years of Experience", placeholder: "e.g. 10 years" },
            { key: "specialization", label: "Specialization", placeholder: "e.g. Advanced Training" },
          ].map(field => (
            <div key={field.key}>
              <label className="text-white/40 text-xs mb-1 block">{field.label}</label>
              <input
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                disabled={field.disabled}
                placeholder={field.placeholder || ""}
                onKeyDown={e => e.key === "Enter" && !saving && handleSave()}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="text-white/40 text-xs mb-1 block">Bio / About</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="A short bio about yourself..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default CoachSettings;
