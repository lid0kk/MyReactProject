import { useState } from "react";
import { db } from "../../Firebase/Firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import '../AddScholarship/AddScholarship.css'

export default function AddScholarship() {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    deadline: "",
    summary: "",
    requirements: "",
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
        createdAt: Timestamp.now(),
      });

      navigate("/admin");
      toast.success("!המלגה נשמרה בהצלחה")
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
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>סכום המלגה</label>
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

      <label>תיאור / תקציר</label>
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

      <button type="submit" className="submit-btn">שמור מלגה</button>
    </form>
  </div>
);
}
