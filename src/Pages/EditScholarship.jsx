import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

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
    <div className="container py-5">
      <h2 className="mb-4 text-center">עריכת מלגה</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px" }}>
        <div className="mb-3">
          <label className="form-label">שם המלגה</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">סכום</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תאריך סיום</label>
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תקציר / תיאור</label>
          <textarea
            name="summary"
            className="form-control"
            rows="3"
            value={form.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">דרישות הגשה</label>
          <textarea
            name="requirements"
            className="form-control"
            rows="2"
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-success">שמור שינויים</button>
        </div>
      </form>
    </div>
  );
}
