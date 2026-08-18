import { Link } from "react-router-dom";
import logo from "../../assets/logo/tafl.jpeg";

const Footer = () => {
  return (
    <footer className="bg-[#0a2e20] border-t border-white/10 pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt="TAFL" className="h-12 bg-white rounded-lg px-2 py-1 mb-4 object-contain" />
            <p className="text-white/40 text-sm leading-relaxed">
              Tennis Academy For Learning — Bangalore's premier tennis training institute.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "Programs", path: "/programs" },
                { label: "Gallery", path: "/gallery" },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/40 hover:text-orange-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Portals</p>
            <ul className="space-y-2">
              {[
                { label: "Player Portal", path: "/portal/player" },
                { label: "Coach Portal", path: "/portal/coach" },
                { label: "Join Now", path: "/join" },
                { label: "Rules & Regulations", path: "/rules" },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/40 hover:text-orange-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Contact</p>
            <ul className="space-y-2 text-white/40 text-sm">
              <li>📞 +91 98765 43210</li>
              <li>✉️ info@taflacademy.com</li>
              <li>📍 Bangalore, Karnataka</li>
              <li className="flex gap-3 pt-2">
                <a href="#" className="hover:text-orange-400 transition-colors">Instagram</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Facebook</a>
                <a href="#" className="hover:text-orange-400 transition-colors">YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">© 2024 TAFL Academy. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with ❤️ for tennis</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;