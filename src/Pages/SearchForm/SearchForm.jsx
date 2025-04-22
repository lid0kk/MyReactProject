import { useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import "../SearchForm/SearchForm.css";

export default function SearchForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    field: "",
    institution: "",
    familyStatus: "",
    economicBackground: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("יש להתחבר כדי למלא את הטופס.");
      return;
    }
  
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          uid: user.uid,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      toast.success("הנתונים נשמרו בהצלחה");
      navigate("/results");
    } catch (err) {
      toast.error("שגיאה בשמירת הנתונים: " + err.message);
    }
  };
  
  return (
    <div className="search-form-container">
      <h2 className="search-form-title">טופס התאמת מלגות</h2>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="search-form">
        <label>גיל</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>מגדר</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">בחר</option>
          <option value="male">זכר</option>
          <option value="female">נקבה</option>
          <option value="other">אחר</option>
        </select>

        <label>תחום לימוד</label>
        <input
          type="text"
          name="field"
          value={formData.field}
          onChange={handleChange}
          required
        />

        <label>מוסד לימודים</label>
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
        />

        <label>מצב משפחתי</label>
        <select
          name="familyStatus"
          value={formData.familyStatus}
          onChange={handleChange}
          required
        >
          <option value="">בחר</option>
          <option value="single">רווק/ה</option>
          <option value="married">נשוי/אה</option>
        </select>

        <label>רקע כלכלי</label>
        <select
          name="economicBackground"
          value={formData.economicBackground}
          onChange={handleChange}
          required
        >
          <option value="">בחר</option>
          <option value="low">חלש</option>
          <option value="medium">בינוני</option>
          <option value="high">גבוה</option>
        </select>

        <button type="submit" className="submit-btn">
          מצא מלגות
        </button>
      </form>
    </div>
  );
}
