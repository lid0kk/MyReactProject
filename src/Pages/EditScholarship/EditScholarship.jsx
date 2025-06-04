import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import '../EditScholarship/EditScholarship.css';

export default function EditScholarship() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const ref = doc(db, "scholarships", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || "",
            amount: data.amount || "",
            deadline: data.deadline
              ? new Date(data.deadline.seconds * 1000).toISOString().split("T")[0]
              : "",
            summary: data.summary || "",
            requirements: data.requirements || "",
            gender: data.gender || "",
            field: data.field || "",
            institution: data.institution || "",
            economicBackground: data.economicBackground || "",
            familyStatus: data.familyStatus || ""
          });
        } else {
          toast.error("המלגה לא נמצאה");
        }
      } catch (err) {
        console.log(err);
        toast.error("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ref = doc(db, "scholarships", id);

    try {
      await updateDoc(ref, {
        ...form,
        amount: Number(form.amount),
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        updatedAt: Timestamp.now(),
      });

      toast.success("המלגה עודכנה בהצלחה!");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      toast.error("שגיאה בשמירת השינויים");
    }
  };

  if (loading) return <p className="text-center mt-5">טוען...</p>;

  return (
    <div className="edit-scholarship-container">
      <h2 className="edit-title">עריכת מלגה</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <label>שם המלגה</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>סכום</label>
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

        <div className="btn-div">
          <button type="submit" className="btn-save">שמור שינויים</button>
        </div>
      </form>
    </div>
  );
}
