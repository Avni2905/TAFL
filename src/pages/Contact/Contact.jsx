import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSiteContent } from "../../services/userService";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [content, setContent] = useState({
    address: "TAFL Academy, Bangalore, Karnataka",
    phone: "+91 98765 43210",
    email: "info@taflacademy.com",
    hours: "Mon–Sat: 6AM–8PM\nSunday: 7AM–10AM",
  });

  useEffect(() => {
    const load = async () => {
      const data = await getSiteContent();
      setContent({
        address: data.address || "TAFL Academy, Bangalore, Karnataka",
        phone: data.phone || "+91 98765 43210",
        email: data.email || "info@taflacademy.com",
        hours: data.hours || "Mon–Sat: 6AM–8PM\nSunday: 7AM–10AM",
      });
    };
    load();
  }, []);

  return (
    <div className="pt-20 bg-[#0B3D2E]">
      <section className="py-20 px-6 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Get In Touch</p>
          <h1 className="text-5xl font-black text-white mb-4">Contact <span className="text-orange-400">Us</span></h1>
        </motion.div>
      </section>

      <section className="pb-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
          <div className="space-y-4 mb-8">
            {[
              { icon: "📍", label: "Address", value: content.address },
              { icon: "📞", label: "Phone", value: content.phone },
              { icon: "✉️", label: "Email", value: content.email },
              { icon: "⏰", label: "Hours", value: content.hours },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-orange-400 text-xs font-semibold mb-1">{item.label}</p>
                  <p className="text-white/70 text-sm whitespace-pre-line">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-white font-bold">Message sent!</p>
              <p className="text-white/40 text-sm mt-2">We'll get back to you soon.</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg">Send us a message</h3>
              {[
                { key: "name", label: "Your Name", placeholder: "Enter your name" },
                { key: "phone", label: "Phone Number", placeholder: "+91XXXXXXXXXX" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-white/40 text-xs mb-1 block">{field.label}</label>
                  <input value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                </div>
              ))}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button onClick={() => setSent(true)}
                disabled={!form.name || !form.phone}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                Send Message
              </button>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;