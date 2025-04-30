import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import '../EditScholarship/EditScholarship.css'

export default function EditScholarship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    amount: "",
    deadline: "",
    summary: "",
    requirements: "",
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
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
  
      <label>סכום</label>
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
  
      <label>תאריך סיום</label>
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        required
      />
  
      <label>תקציר / תיאור</label>
      <textarea
        name="summary"
        rows="3"
        value={form.summary}
        onChange={handleChange}
        required
      />
  
      <label>דרישות הגשה</label>
      <textarea
        name="requirements"
        rows="2"
        value={form.requirements}
        onChange={handleChange}
      />
    <div className="btn-div">
      <button type="submit" className="btn-save">שמור שינויים</button>
      </div>
    </form>
  </div>
  );
}
