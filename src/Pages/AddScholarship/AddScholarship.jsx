import { useState } from "react";
import { db } from "../../Firebase/Firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import '../AddScholarship/AddScholarship.css';

export default function AddScholarship() {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    deadline: "",
    summary: "",
    requirements: "",
    gender: "",
    field: "",
    institution: "",
    economicBackground: "",
    familyStatus: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addDoc(collection(db, "scholarships"), {
        ...form,
        amount: Number(form.amount),
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        createdAt: Timestamp.now()
      });

      navigate("/admin");
      toast.success("!המלגה נשמרה בהצלחה");
    } catch (err) {
      toast.error("שגיאה בהוספת המלגה: " + err.message);
    }
  };

  return (
    <div className="add-scholarship-container">
      <h2 className="add-scholarship-title">הוספת מלגה חדשה</h2>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="add-scholarship-form">
        <label>שם המלגה</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>סכום המלגה</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required />

        <label>תאריך סיום</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />

        <label>תיאור / תקציר</label>
        <textarea name="summary" rows="3" value={form.summary} onChange={handleChange} required />

        <label>דרישות הגשה</label>
        <textarea name="requirements" rows="2" value={form.requirements} onChange={handleChange} />

        <label>מגדר מתאים</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">לא משנה</option>
          <option>זכר</option>
          <option>נקבה</option>
          <option>אחר</option>
        </select>

        <label>תחום לימודים נדרש</label>
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

        <label>מוסד לימודים רלוונטי</label>
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

        <label>רקע כלכלי מתאים</label>
        <select name="economicBackground" value={form.economicBackground} onChange={handleChange}>
          <option value="">לא משנה</option>
          <option>חלש</option>
          <option>בינוני</option>
          <option>גבוה</option>
        </select>

        <label>מצב משפחתי מתאים</label>
        <select name="familyStatus" value={form.familyStatus} onChange={handleChange}>
          <option value="">לא משנה</option>
          <option>רווק/ה</option>
          <option>נשוי/אה</option>
        </select>

        <button type="submit" className="submit-btn">שמור מלגה</button>
      </form>
    </div>
  );
}
