import { useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/LoginRegister.css";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("התחברת בהצלחה!");
      navigate("/search");
    } catch (err) {
      toast.error("שגיאה בהתחברות: " + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("הסיסמאות אינן תואמות");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        uid: user.uid,
        createdAt: new Date(),
        role: "user",
      });
      toast.success("נרשמת בהצלחה!");
      navigate("/search");
    } catch (err) {
      toast.error("שגיאה בהרשמה: " + err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) return toast.error("יש להזין אימייל לאיפוס סיסמה");
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("נשלחה הודעת איפוס למייל.");
    } catch (err) {
      toast.error("שגיאה באיפוס: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          התחברות
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          הרשמה
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <label>אימייל</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
          />
          <label>סיסמה</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">
            התחבר
          </button>
          <button
            type="button"
            className="reset-link"
            onClick={handleResetPassword}
          >
            שכחת סיסמה?
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <label>שם מלא</label>
          <input
            type="text"
            name="fullName"
            onChange={handleChange}
            required
          />
          <label>אימייל</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
          />
          <label>סיסמה</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
          <label>אימות סיסמה</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">
            הרשמה
          </button>
        </form>
      )}
    </div>
  );
}
