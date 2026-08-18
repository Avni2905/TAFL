import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import logo from "../../assets/logo/tafl.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Programs", path: "/programs" },
  { label: "Achievements", path: "/achievements" },
  { label: "Gallery", path: "/gallery" },
  { label: "Rules", path: "/rules" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const { user, role } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`w-full px-8 py-3 flex items-center justify-between fixed top-0 z-50 transition-all duration-300 ${
      isHome
        ? "bg-transparent border-b border-white/0"
        : "bg-[#0B3D2E]/95 backdrop-blur-md border-b border-white/10"
    }`}>

      {/* Logo */}
      <Link to="/">
        <img
          src={logo}
          alt="TAFL Logo"
          className="h-14 w-auto object-contain bg-white rounded-lg px-2 py-1"
        />
      </Link>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`transition-colors text-sm tracking-wide font-medium ${
                location.pathname === link.path
                  ? "text-orange-400"
                  : "text-white/80 hover:text-orange-400"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Portal Buttons / Profile */}
      <div className="flex items-center gap-3">
        {user && role === "student" ? (
          <Link to="/portal/player/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-400/40 hover:border-orange-400 flex items-center justify-center text-orange-400 font-bold text-sm overflow-hidden transition-all">
              {user.profilePic
                ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                : user.name?.[0]?.toUpperCase() || "P"}
            </div>
            <span className="text-sm text-white/80 group-hover:text-orange-400 transition-colors font-medium">
              {user.name?.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <Link
            to="/portal/player"
            className="border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-sm px-4 py-2 rounded-full transition-all"
          >
            Player Portal
          </Link>
        )}

        {user && (role === "coach" || role === "admin") ? (
          <Link to="/portal/coach/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-400/40 hover:border-orange-400 flex items-center justify-center text-orange-400 font-bold text-sm overflow-hidden transition-all">
              {user.profilePic
                ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                : user.name?.[0]?.toUpperCase() || "C"}
            </div>
            <span className="text-sm text-white/80 group-hover:text-orange-400 transition-colors font-medium">
              {user.name?.split(" ")[0]} (Coach)
            </span>
          </Link>
        ) : (
          <Link
            to="/portal/coach"
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-full transition-all font-medium"
          >
            Coach Portal
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
