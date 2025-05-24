import { setDoc } from "firebase/firestore"; 
import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
    role: "user"
  });

  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const isProfileValid = !!data.fullName && !!data.gender && !!data.field;
        if (isProfileValid) {
          setProfileCompleted(true);
          setForm((prev) => ({ ...prev, ...data }));
        } else {
          setProfileCompleted(false);
        }

        setLoading(false);
      }
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
      await setDoc(doc(db, "users", user.uid), {
        ...form,
        updatedAt: new Date(),
        role: form.role || "user"
      }, { merge: true });
      toast.success("✅ הפרופיל נשמר בהצלחה!");
      setProfileCompleted(true);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בשמירת הנתונים");
    }
  };

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      toast.success("🗑️ פרופיל נמחק");
      setProfileCompleted(false);
      setForm({
        fullName: "",
        birthDate: "",
        gender: "",
        field: "",
        institution: "",
        economicBackground: "",
        familyStatus: "",
        notifications: "email"
      });
    } catch (error) {
      toast.error("שגיאה במחיקת הפרופיל");
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

  if (profileCompleted && !editMode) {
    return (
      <div className="profile-card">
        <h2>👤 פרטי המשתמש</h2>
        <p><strong>שם מלא:</strong> {form.fullName}</p>
        <p><strong>תאריך לידה:</strong> {form.birthDate}</p>
        <p><strong>מגדר:</strong> {form.gender}</p>
        <p><strong>תחום לימוד:</strong> {form.field}</p>
        <p><strong>מוסד לימודים:</strong> {form.institution}</p>
        <p><strong>מצב משפחתי:</strong> {form.familyStatus}</p>
        <p><strong>רקע כלכלי:</strong> {form.economicBackground}</p>
        <p><strong>העדפת התראות:</strong> {form.notifications}</p>

        <div className="profile-actions">
          <button className="save-button" onClick={() => setEditMode(true)}>✏️ ערוך</button>
          <button className="delete-button" onClick={handleDelete}>🗑️ מחק פרופיל</button>
        </div>
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
          <option>זכר</option>
          <option>נקבה</option>
          <option>אחר</option>
        </select>

        <label>תחום לימוד</label>
        <select name="field" value={form.field} onChange={handleChange}>
          <option value="">לא משנה</option>
          <option value="מדעי המחשב">מדעי המחשב</option>
          <option value="הנדסה">הנדסה</option>
          <option value="משפטים">משפטים</option>
          <option value="מנהל עסקים">מנהל עסקים</option>
          <option value="חינוך">חינוך</option>
          <option value="תקשורת">תקשורת</option>
          <option value="עבודה סוציאלית">עבודה סוציאלית</option>
        </select>

        <label>מוסד לימודים</label>
        <select name="institution" value={form.institution} onChange={handleChange}>
          <option value="">לא משנה</option>
          <option value="אוניברסיטת תל אביב">אוניברסיטת תל אביב</option>
          <option value="האוניברסיטה העברית בירושלים">האוניברסיטה העברית בירושלים</option>
          <option value="אוניברסיטת בן-גוריון">אוניברסיטת בן-גוריון</option>
          <option value="אוניברסיטת חיפה">אוניברסיטת חיפה</option>
          <option value="הטכניון">הטכניון</option>
          <option value="המכללה למנהל">המכללה למנהל</option>
          <option value="המכללה האקדמית תל אביב-יפו">המכללה האקדמית תל אביב-יפו</option>
        </select>

        <label>מצב משפחתי</label>
        <select name="familyStatus" value={form.familyStatus} onChange={handleChange}>
          <option value="">בחר</option>
          <option>רווק/ה</option>
          <option>נשוי/אה</option>
        </select>

        <label>רקע כלכלי</label>
        <select name="economicBackground" value={form.economicBackground} onChange={handleChange}>
          <option value="">בחר</option>
          <option>חלש</option>
          <option>בינוני</option>
          <option>גבוה</option>
        </select>

        <label>העדפות התראות</label>
        <select name="notifications" value={form.notifications} onChange={handleChange}>
          <option value="email">במייל</option>
          <option value="push">בהתראה באפליקציה</option>
        </select>

        <button type="submit" className="save-button">💾 שמור שינויים</button>
      </form>
    </div>
  );
}
