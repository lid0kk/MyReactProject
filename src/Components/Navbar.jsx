import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    toast.success("!התנתקת בהצלחה ")
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/home">
        Scholarship Match
      </Link>

      <div className="collapse-nav">
        <ul className="ul-nav">
          <li className="nav-li"><Link className="nav-link" to="/search">חיפוש</Link></li>
          <li className="nav-li"><Link className="nav-link" to="/profile">פרופיל</Link></li>
          <li className="nav-li"><Link className="nav-link" to="/my-scholarships">שמורים</Link></li>
          <li className="nav-li"><Link className="nav-link" to="/home">דף הבית</Link></li>

          {isAdmin && (
            <>
              <li className="nav-li"><Link className="nav-link" to="/admin">ניהול</Link></li>
              <li className="nav-li"><Link className="nav-link" to="/admin/dashboard">דף סטטיסטיקות</Link></li>
              <li className="nav-li"><Link className="nav-link" to="/seed"> הוספת מלגות ומשתמשים למערכת (זמני)</Link></li>
            </>
          )}

          {user ? (
            <>
              <li className="nav-li">
                <span className="nav-user">שלום, {fullName}</span>
              </li>
              <li className="nav-li">
                <button onClick={handleLogout} className="nav-link logout-btn">התנתק</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-li"><Link className="nav-link" to="/login">התחברות / הרשמה</Link></li>
           
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
