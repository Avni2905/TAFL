import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Programs from "../pages/Programs/Programs";
import Achievements from "../pages/Achievements/Achievements";
import Gallery from "../pages/Gallery/Gallery";
import Rules from "../pages/Rules/Rules";
import Contact from "../pages/Contact/Contact";
import JoinNow from "../pages/Home/JoinNow";
import PlayerLogin from "../portals/player/PlayerLogin";
import NotApproved from "../portals/player/NotApproved";
import PlayerDashboard from "../portals/player/PlayerDashboard";
import CoachLogin from "../portals/coach/CoachLogin";
import CoachDashboard from "../portals/coach/CoachDashboard";
import { useAuth } from "../hooks/useAuth.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center">
      <div className="text-orange-400 text-xl animate-pulse">Loading...</div>
    </div>
  );
  if (!user || !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with navbar/footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/join" element={<JoinNow />} />
      </Route>

      {/* Player Portal */}
      <Route path="/portal/player" element={<PlayerLogin />} />
      <Route path="/portal/player/not-approved" element={<NotApproved />} />
      <Route
        path="/portal/player/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PlayerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Coach Portal */}
      <Route path="/portal/coach" element={<CoachLogin />} />
      <Route
        path="/portal/coach/dashboard"
        element={
          <ProtectedRoute allowedRoles={["coach", "admin"]}>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
