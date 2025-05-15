import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import "../UserProfile/UserProfile.css";

export default function UserProfile() {
  const [form, setForm] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    field: "",
    institution: "",
    economicBackground: "",
    familyStatus: "",
    notifications: "email",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setForm((prev) => ({ ...prev, ...snap.data() }));
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...form,
        updatedAt: new Date(),
      });
      toast.success("✅ הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.log(error)
      toast.error("שגיאה בשמירת הנתונים");
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message">...טוען פרופיל</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">הפרופיל שלי</h2>

      <form onSubmit={handleSave} className="profile-form">
        <label>שם מלא</label>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />

        <label>תאריך לידה</label>
        <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />

        <label>מגדר</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">בחר</option>
          <option value="male">זכר</option>
          <option value="female">נקבה</option>
          <option value="other">אחר</option>
        </select>

        <label>תחום לימוד</label>
        <input type="text" name="field" value={form.field} onChange={handleChange} />

        <label>מוסד לימודים</label>
        <input type="text" name="institution" value={form.institution} onChange={handleChange} />

        <label>מצב משפחתי</label>
        <select name="familyStatus" value={form.familyStatus} onChange={handleChange}>
          <option value="">בחר</option>
          <option value="single">רווק/ה</option>
          <option value="married">נשוי/אה</option>
        </select>

        <label>רקע כלכלי</label>
        <select name="economicBackground" value={form.economicBackground} onChange={handleChange}>
          <option value="">בחר</option>
          <option value="low">חלש</option>
          <option value="medium">בינוני</option>
          <option value="high">גבוה</option>
        </select>

        <label>העדפות התראות</label>
        <select name="notifications" value={form.notifications} onChange={handleChange}>
          <option value="email">במייל</option>
          <option value="push">בהתראה באפליקציה</option>
        </select>

        <button type="submit" className="save-button">שמור שינויים</button>
      </form>
    </div>
  );
}
