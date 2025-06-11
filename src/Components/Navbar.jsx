import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../Styles/Navbar.css";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || "");
          setIsAdmin(data.role === "admin");
        }
      } else {
        setFullName("");
        setIsAdmin(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    toast.success("!התנתקת בהצלחdה");
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="nav-container">
      <div className="nav-top-row">
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <div className="nav-logo">
          <Link to="/home" onClick={handleLinkClick}> Scholarship Match</Link>
        </div>
      </div>

      <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <ul>
          <li><Link className={isActive("/home") ? "active" : ""} to="/home" onClick={handleLinkClick}>🏠 דף הבית</Link></li>
          {user && (
            <>
                          <li><Link className={isActive("/profile") ? "active" : ""} to="/profile" onClick={handleLinkClick}>👤 פרופיל</Link></li>
              <li><Link className={isActive("/search") ? "active" : ""} to="/search" onClick={handleLinkClick}>🔍 תוצאות התאמה</Link></li>
              <li><Link className={isActive("/my-scholarships") ? "active" : ""} to="/my-scholarships" onClick={handleLinkClick}>💾 מלגות ששמרתי</Link></li>
              {isAdmin && (
                <>
                  <li><Link className={isActive("/admin") ? "active" : ""} to="/admin" onClick={handleLinkClick}>⚙️ ניהול</Link></li>
                  <li><Link className={isActive("/admin/dashboard") ? "active" : ""} to="/admin/dashboard" onClick={handleLinkClick}>📊 סטטיסטיקות</Link></li>
                </>
              )}
              <li className="nav-user">שלום, {fullName} 👋</li>
              <li><button onClick={handleLogout} className="logout">🚪 התנתק</button></li>
            </>
          )}
          {!user && (
            <li><Link className={isActive("/login") ? "active" : ""} to="/login" onClick={handleLinkClick}>🔐 התחברות</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
} 
