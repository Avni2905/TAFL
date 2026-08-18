import { useState, useEffect } from "react";
import { getSiteContent, updateSiteContent } from "../../../services/userService";
import { motion } from "framer-motion";

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-all"
      >
        <p className="text-white font-bold">{title}</p>
        <span className="text-white/40 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, value, onChange, multiline = false, hint = "" }) => (
  <div>
    <label className="text-white/40 text-xs uppercase tracking-wide block mb-1">{label}</label>
    {hint && <p className="text-white/20 text-xs mb-1">{hint}</p>}
    {multiline ? (
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none"
      />
    ) : (
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400"
      />
    )}
  </div>
);

const CoachSiteEditor = () => {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent().then(data => {
      setContent({
        heroTitle: data.heroTitle || "TRAIN. COMPETE. ACHIEVE.",
        heroSubtitle: data.heroSubtitle || "Building Champions On and Off the Court",
        heroDescription: data.heroDescription || "At TAFL Academy, we nurture talent, build character and create champions through world-class tennis training.",
        stat1Value: data.stat1Value || "200+", stat1Label: data.stat1Label || "Students Trained",
        stat2Value: data.stat2Value || "50+", stat2Label: data.stat2Label || "Tournament Wins",
        stat3Value: data.stat3Value || "10+", stat3Label: data.stat3Label || "Years of Excellence",
        stat4Value: data.stat4Value || "5", stat4Label: data.stat4Label || "Certified Coaches",
        aboutDescription: data.aboutDescription || "TAFL Academy is a premier tennis training institute in Bangalore.",
        vision: data.vision || "To be South India's most respected tennis academy.",
        motto: data.motto || "Discipline. Dedication. Domination.",
        ach1Value: data.ach1Value || "100+", ach1Label: data.ach1Label || "National Level Titles",
        ach2Value: data.ach2Value || "25+", ach2Label: data.ach2Label || "State Level Titles",
        ach3Value: data.ach3Value || "10+", ach3Label: data.ach3Label || "ITF / AITA Titles",
        testimonialQuote: data.testimonialQuote || "TAFL has transformed my child's game and confidence.",
        testimonialName: data.testimonialName || "Priya Sharma",
        testimonialRole: data.testimonialRole || "Parent",
        testimonial2Quote: data.testimonial2Quote || "My son went from beginner to state finalist in 18 months.",
        testimonial2Name: data.testimonial2Name || "Ramesh Nair",
        testimonial2Role: data.testimonial2Role || "Parent of Elite Student",
        testimonial3Quote: data.testimonial3Quote || "Best decision we made was joining TAFL.",
        testimonial3Name: data.testimonial3Name || "Anita Menon",
        testimonial3Role: data.testimonial3Role || "Adult Program Student",
        player1Name: data.player1Name || "Arjun R.", player1Title: data.player1Title || "ITF Junior Champion",
        player2Name: data.player2Name || "Diya P.", player2Title: data.player2Title || "National Winner",
        player3Name: data.player3Name || "Rohan M.", player3Title: data.player3Title || "State Champion",
        phone: data.phone || "+91 98765 43210",
        email: data.email || "info@taflacademy.com",
        address: data.address || "TAFL Academy, Bangalore, Karnataka",
        hours: data.hours || "Mon–Sat: 6AM–8PM\nSunday: 7AM–10AM",
        instagram: data.instagram || "#",
        facebook: data.facebook || "#",
        youtube: data.youtube || "#",
      });
      setLoading(false);
    });
  }, []);

  const update = (key, val) => setContent(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await updateSiteContent(content);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-white/40 animate-pulse">Loading site content...</p>
    </div>
  );

  return (
    <div>
      {/* Single header with single save button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white">Edit Website Content</h2>
          <p className="text-white/40 text-sm">Changes reflect live on the website after saving</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 min-w-[140px]"
        >
          {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>

      <Section title="🎯 Hero Section">
        <Field label="Main Title" value={content.heroTitle} onChange={v => update("heroTitle", v)} hint="e.g. TRAIN. COMPETE. ACHIEVE." />
        <Field label="Subtitle" value={content.heroSubtitle} onChange={v => update("heroSubtitle", v)} />
        <Field label="Description" value={content.heroDescription} onChange={v => update("heroDescription", v)} multiline />
      </Section>

      <Section title="📊 Statistics" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { vKey: "stat1Value", lKey: "stat1Label" },
            { vKey: "stat2Value", lKey: "stat2Label" },
            { vKey: "stat3Value", lKey: "stat3Label" },
            { vKey: "stat4Value", lKey: "stat4Label" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
              <Field label={`Stat ${i + 1} Number`} value={content[s.vKey]} onChange={v => update(s.vKey, v)} />
              <Field label="Label" value={content[s.lKey]} onChange={v => update(s.lKey, v)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="🏫 About & Vision" defaultOpen={false}>
        <Field label="About Description" value={content.aboutDescription} onChange={v => update("aboutDescription", v)} multiline />
        <Field label="Our Vision" value={content.vision} onChange={v => update("vision", v)} multiline />
        <Field label="Our Motto" value={content.motto} onChange={v => update("motto", v)} />
      </Section>

      <Section title="🏆 Achievement Numbers" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { vKey: "ach1Value", lKey: "ach1Label" },
            { vKey: "ach2Value", lKey: "ach2Label" },
            { vKey: "ach3Value", lKey: "ach3Label" },
          ].map((a, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
              <Field label="Number" value={content[a.vKey]} onChange={v => update(a.vKey, v)} />
              <Field label="Label" value={content[a.lKey]} onChange={v => update(a.lKey, v)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="💬 Testimonials (3 rotating cards)" defaultOpen={false}>
        {[
          { qKey: "testimonialQuote", nKey: "testimonialName", rKey: "testimonialRole", label: "Testimonial 1" },
          { qKey: "testimonial2Quote", nKey: "testimonial2Name", rKey: "testimonial2Role", label: "Testimonial 2" },
          { qKey: "testimonial3Quote", nKey: "testimonial3Name", rKey: "testimonial3Role", label: "Testimonial 3" },
        ].map((t, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
            <p className="text-orange-400 text-xs font-bold uppercase">{t.label}</p>
            <Field label="Quote" value={content[t.qKey]} onChange={v => update(t.qKey, v)} multiline />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" value={content[t.nKey]} onChange={v => update(t.nKey, v)} />
              <Field label="Role" value={content[t.rKey]} onChange={v => update(t.rKey, v)} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="⭐ Star Players" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { nKey: "player1Name", tKey: "player1Title" },
            { nKey: "player2Name", tKey: "player2Title" },
            { nKey: "player3Name", tKey: "player3Title" },
          ].map((p, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
              <p className="text-orange-400 text-xs font-bold uppercase">Player {i + 1}</p>
              <Field label="Name" value={content[p.nKey]} onChange={v => update(p.nKey, v)} />
              <Field label="Title / Achievement" value={content[p.tKey]} onChange={v => update(p.tKey, v)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="📞 Contact & Social" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" value={content.phone} onChange={v => update("phone", v)} />
          <Field label="Email" value={content.email} onChange={v => update("email", v)} />
          <Field label="Instagram URL" value={content.instagram} onChange={v => update("instagram", v)} />
          <Field label="Facebook URL" value={content.facebook} onChange={v => update("facebook", v)} />
          <Field label="YouTube URL" value={content.youtube} onChange={v => update("youtube", v)} />
        </div>
        <Field label="Address" value={content.address} onChange={v => update("address", v)} />
        <Field label="Opening Hours" value={content.hours} onChange={v => update("hours", v)} multiline />
      </Section>
    </div>
  );
};

export default CoachSiteEditor;
