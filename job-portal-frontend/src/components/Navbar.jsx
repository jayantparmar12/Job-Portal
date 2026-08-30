import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">JobPortal</Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-blue-400">Jobs</Link>
        {user?.role === "RECRUITER" && (
          <Link to="/post-job" className="hover:text-blue-400">Post Job</Link>
        )}
        {user?.role === "CANDIDATE" && (
          <Link to="/my-applications" className="hover:text-blue-400">My Applications</Link>
        )}
          {user?.role === "RECRUITER" && (
            <>
              <Link to="/my-jobs" className="hover:text-blue-400">My Jobs</Link>
            </>
          )}
        {user && (
          <Link to="/profile" className="hover:text-blue-400">Profile</Link>
        )}
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout ({user.email})
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}