import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTrophy, FaUserGraduate, FaClock, FaChalkboardTeacher } from "react-icons/fa";
import { getSiteContent } from "../../services/userService";

const defaultContent = {
  heroTitle: "TRAIN. COMPETE. ACHIEVE.",
  heroSubtitle: "Building Champions On and Off the Court",
  heroDescription: "At TAFL Academy, we nurture talent, build character and create champions through world-class tennis training.",
  stat1Value: "200+", stat1Label: "Students Trained",
  stat2Value: "50+", stat2Label: "Tournament Wins",
  stat3Value: "10+", stat3Label: "Years of Excellence",
  stat4Value: "5", stat4Label: "Certified Coaches",
  aboutDescription: "TAFL Academy is a premier tennis training institute in Bangalore, dedicated to developing players with the right blend of technique, discipline and sportsmanship.",
  ach1Value: "100+", ach1Label: "National Level Titles",
  ach2Value: "25+", ach2Label: "State Level Titles",
  ach3Value: "10+", ach3Label: "ITF / AITA Titles",
  testimonialQuote: "TAFL has transformed my child's game and confidence. The coaches are exceptional!",
  testimonialName: "Priya Sharma", testimonialRole: "Parent",
  testimonial2Quote: "My son went from beginner to state finalist in 18 months. The coaching here is world class.",
  testimonial2Name: "Ramesh Nair", testimonial2Role: "Parent of Elite Student",
  testimonial3Quote: "Best decision we made was joining TAFL. Professional environment, dedicated coaches.",
  testimonial3Name: "Anita Menon", testimonial3Role: "Adult Program Student",
  player1Name: "Arjun R.", player1Title: "ITF Junior Champion",
  player2Name: "Diya P.", player2Title: "National Winner",
  player3Name: "Rohan M.", player3Title: "State Champion",
  phone: "+91 98765 43210",
  email: "info@taflacademy.com",
  address: "TAFL Academy, Bangalore, Karnataka",
  instagram: "#", facebook: "#", youtube: "#",
};

// Testimonial Carousel
const TestimonialCarousel = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <p className="text-white/70 text-sm italic mb-4 leading-relaxed">
            "{testimonials[current].quote}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-400 text-sm font-black flex-shrink-0">
              {testimonials[current].name[0]}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{testimonials[current].name}</p>
              <p className="text-orange-400 text-xs">{testimonials[current].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Dots */}
      <div className="flex gap-2 mt-4 justify-center">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-orange-400 w-5" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [content, setContent] = useState(defaultContent);
  const heroRef = useRef(null);

  useEffect(() => {
    getSiteContent().then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  const stats = [
    { value: content.stat1Value, label: content.stat1Label, icon: <FaUserGraduate /> },
    { value: content.stat2Value, label: content.stat2Label, icon: <FaTrophy /> },
    { value: content.stat3Value, label: content.stat3Label, icon: <FaClock /> },
    { value: content.stat4Value, label: content.stat4Label, icon: <FaChalkboardTeacher /> },
  ];

  const achievements = [
    { value: content.ach1Value, label: content.ach1Label },
    { value: content.ach2Value, label: content.ach2Label },
    { value: content.ach3Value, label: content.ach3Label },
  ];

  const starPlayers = [
    { name: content.player1Name, title: content.player1Title },
    { name: content.player2Name, title: content.player2Title },
    { name: content.player3Name, title: content.player3Title },
  ];

  const testimonials = [
    { quote: content.testimonialQuote, name: content.testimonialName, role: content.testimonialRole },
    { quote: content.testimonial2Quote, name: content.testimonial2Name, role: content.testimonial2Role },
    { quote: content.testimonial3Quote, name: content.testimonial3Name, role: content.testimonial3Role },
  ];

  return (
    <div className="bg-[#0B3D2E]">

      {/* HERO — no pt-20, navbar melts in */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Tennis court line pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#072b1e] via-[#0B3D2E] to-[#0d4a32]" />
          {/* Decorative court lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="2"/>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2"/>
            <rect x="15%" y="20%" width="70%" height="60%" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="25%" y="20%" width="50%" height="60%" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="50%" cy="50%" r="80" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E] via-[#0B3D2E]/80 to-[#0B3D2E]/40" />
          {/* Top fade for navbar */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0B3D2E] to-transparent" />
        </div>

        {/* Decorative circles */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full" />
        <div className="absolute right-32 top-1/2 -translate-y-1/2 w-56 h-56 border border-orange-500/10 rounded-full" />
        <div className="absolute -left-20 top-1/3 w-80 h-80 border border-white/5 rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full pt-24 pb-12">
          {/* Left — hero text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-orange-400 tracking-[0.3em] text-xs uppercase mb-4 font-medium"
            >
              Tennis Academy For Learning · Bangalore
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-7xl font-black text-white leading-none mb-6 uppercase"
            >
              {content.heroTitle.split(" ").map((word, i, arr) => (
                <span key={i}>
                  <span className={i === arr.length - 1 ? "text-orange-500" : "text-white"}>
                    {word}
                  </span>
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-lg mb-2 font-medium"
            >
              {content.heroSubtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/60 text-sm mb-8 max-w-md leading-relaxed"
            >
              {content.heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <Link
                to="/join"
                className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded font-bold tracking-wide transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
              >
                JOIN NOW
              </Link>
              <Link
                to="/programs"
                className="border-2 border-white/40 hover:border-orange-400 text-white hover:text-orange-400 px-8 py-3 rounded font-bold tracking-wide transition-all hover:scale-105"
              >
                EXPLORE PROGRAMS
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-8 mt-12 pt-8 border-t border-white/10 flex-wrap"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-orange-400 text-xl mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Registration card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hidden md:block"
          >
            <h3 className="text-white font-bold text-xl mb-1 text-center">
              JOIN <span className="text-orange-400">TAFL</span> ACADEMY
            </h3>
            <p className="text-white/50 text-sm text-center mb-6">Start your journey with us!</p>

            <p className="text-white/70 text-sm mb-4 text-center">Select your registration type:</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link to="/join?type=junior" className="border border-white/20 hover:border-orange-400 rounded-xl p-4 text-center transition-all group">
                <div className="text-2xl mb-2">🎾</div>
                <div className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">JUNIOR</div>
                <div className="text-white/40 text-xs">Below 18 Years</div>
              </Link>
              <Link to="/join?type=senior" className="border border-white/20 hover:border-orange-400 rounded-xl p-4 text-center transition-all group">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">SENIOR</div>
                <div className="text-white/40 text-xs">18 Years & Above</div>
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              {[
                "Fill the registration form",
                "Visit the academy in person",
                "Confirm your interest with coach",
                "Get approved & start training!"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange-400/20 border border-orange-400/40 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>

            <Link
              to="/join"
              className="block w-full bg-orange-500 hover:bg-orange-400 text-white text-center py-3 rounded-xl font-bold transition-all"
            >
              REGISTER NOW
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-orange-400 tracking-widest text-xs uppercase mb-3">Who We Are</p>
            <h2 className="text-4xl font-black text-white mb-5">
              ABOUT <span className="text-orange-400">TAFL</span> ACADEMY
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">{content.aboutDescription}</p>
            <Link
              to="/about"
              className="border border-white/30 hover:border-orange-400 text-white hover:text-orange-400 px-6 py-2 rounded text-sm font-semibold transition-all inline-block"
            >
              KNOW MORE ABOUT US →
            </Link>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🎾", label: "World-class Courts" },
              { icon: "🏆", label: "Championship Training" },
              { icon: "💪", label: "Fitness Center" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-orange-400/30 transition-all"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-white/50 text-xs">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20 px-6 bg-[#0a2e20]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Training</p>
            <h2 className="text-4xl font-black text-white uppercase">
              Our Programs <span className="text-orange-400">At A Glance</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Age Group", icon: "👶", desc: "4 – 18+ Years\nPrograms for all age groups and skill levels." },
              { title: "Training Levels", icon: "📈", desc: "Beginner\nIntermediate\nAdvanced\nOne to One (Advanced)\nCustomized training for every player." },
              { title: "Batch Timings", icon: "⏰", desc: "Morning\nEvening\nWeekends\nFlexible timings to suit your schedule." },
              { title: "Fee Calculator", icon: "💰", desc: "Estimate your training fees based on your preferences.", cta: "CALCULATE NOW" },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-400/40 transition-all"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wide mb-3">{p.title}</h3>
                <p className="text-white/60 text-sm whitespace-pre-line leading-relaxed">{p.desc}</p>
                {p.cta && (
                  <Link to="/programs" className="mt-4 text-orange-400 text-xs font-bold tracking-wide hover:text-orange-300 transition-colors block">
                    {p.cta} →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS & TESTIMONIALS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">

          {/* Achievements + Testimonial Carousel */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">What Parents Say</p>
            <h2 className="text-3xl font-black text-white uppercase mb-6">
              Achievements & <span className="text-orange-400">Testimonials</span>
            </h2>

            <TestimonialCarousel testimonials={testimonials} />

            <div className="flex gap-8 mt-8 pt-6 border-t border-white/10">
              {achievements.map((a, i) => (
                <div key={i}>
                  <div className="text-orange-400 font-black text-2xl">{a.value}</div>
                  <div className="text-white/50 text-xs mt-1">{a.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Star Players */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Our Athletes</p>
            <h2 className="text-3xl font-black text-white uppercase mb-6">
              Star <span className="text-orange-400">Players</span>
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {starPlayers.map((p, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 hover:border-orange-400/30 rounded-2xl p-5 text-center transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-orange-400/30 mx-auto mb-3 flex items-center justify-center text-2xl">
                    🎾
                  </div>
                  <p className="text-white text-sm font-bold">{p.name}</p>
                  <p className="text-orange-400 text-xs mt-1">{p.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 bg-[#0a2e20]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-3xl p-14"
        >
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/60 mb-8">Join TAFL Academy and train with Bangalore's finest tennis coaches.</p>
          <Link
            to="/join"
            className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 inline-block shadow-lg shadow-orange-500/30"
          >
            Enroll Today
          </Link>
        </motion.div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-8 flex-wrap">
            <p className="text-white/40 text-sm">📞 {content.phone}</p>
            <p className="text-white/40 text-sm">✉️ {content.email}</p>
            <p className="text-white/40 text-sm">📍 {content.address}</p>
          </div>
          <div className="flex gap-4">
            <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-orange-400 transition-colors text-sm">Instagram</a>
            <a href={content.facebook} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-orange-400 transition-colors text-sm">Facebook</a>
            <a href={content.youtube} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-orange-400 transition-colors text-sm">YouTube</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
