import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
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
    toast.success("!התנתקת בהצלחה");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <Link className="navbar-brand hide-on-mobile" to="/home">
          🎓 Scholarship Match
        </Link>
      </div>

      <div className={`collapse-nav ${menuOpen ? "open" : ""}`}>
        <ul className="ul-nav">
          <li className="nav-li">
            <Link className={`nav-link ${isActive("/home") ? "active" : ""}`} to="/home">🏠 דף הבית</Link>
          </li>

          {user && (
            <>
              <li className="nav-li">
                <Link className={`nav-link ${isActive("/search") ? "active" : ""}`} to="/search">🔍 חיפוש</Link>
              </li>
              <li className="nav-li">
                <Link className={`nav-link ${isActive("/profile") ? "active" : ""}`} to="/profile">👤 פרופיל</Link>
              </li>
              <li className="nav-li">
                <Link className={`nav-link ${isActive("/my-scholarships") ? "active" : ""}`} to="/my-scholarships"> מלגות שמורות 💾</Link>
              </li>
              <li className="nav-li">
              <Link className={`nav-link ${isActive("/help") ? "active" : ""}`} to="/help"> עזרה ❓</Link>
              </li>
              <li className="nav-li">
              <Link className={`nav-link ${isActive("/about") ? "active" : ""}`} to="/about"> מידע כללי ℹ️</Link>
              </li>
              {isAdmin && (
                <>
                  <li className="nav-li">
                    <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin"> ניהול ⚙️</Link>
                  </li>
                  <li className="nav-li">
                    <Link className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`} to="/admin/dashboard"> דף סטטיסטיקות 📊</Link>
                  </li>
                  <li className="nav-li">
                    <Link className={`nav-link ${isActive("/seed") ? "active" : ""}`} to="/seed"> הוספת מלגות ➕</Link>
                  </li>
                </>
              )}

              <li className="nav-li">
                <span className="nav-user">שלום, {fullName} 👋</span>
              </li>
              <li className="nav-li">
                <button onClick={handleLogout} className="nav-link logout-btn">🚪 התנתק</button>
              </li>
            </>
          )}
          

          {!user && (
            <li className="nav-li">
              <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">🔐 התחברות / הרשמה</Link>
            </li>
          )}

    
        </ul>
      </div>
    </nav>
  );
}
