import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { toast } from "react-toastify";

import "../ScholarshipDetail/ScholarshipDetail.css";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      const docRef = doc(db, "scholarships", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScholarship(docSnap.data());
      }

      setLoading(false);
    };

    fetchScholarship();
  }, [id]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("יש להתחבר כדי לשמור מלגה");
      return;
    }

    try {
      await setDoc(
        doc(db, `users/${user.uid}/savedScholarships`, id),
        {
          scholarshipId: id,
          name: scholarship.name,
          amount: scholarship.amount,
          deadline: scholarship.deadline,
          savedAt: new Date(),
        }
      );
      toast.success("המלגה נשמרה לדשבורד שלך!");
    } catch (err) {
      console.error("שגיאה בשמירה:", err);
      toast.error("אירעה שגיאה בשמירת המלגה");
    }
  };

  if (loading) return <p className="loading-message">טוען פרטי מלגה...</p>;
  if (!scholarship) return <p className="error-message">המלגה לא נמצאה</p>;

  return (
    <div className="scholarship-detail-container">
      <div className="scholarship-card">
        <h2>{scholarship.name}</h2>
        <p><strong>סכום:</strong> ₪{scholarship.amount}</p>
        <p>
          <strong>מועד אחרון:</strong>{" "}
          {new Date(scholarship.deadline.seconds * 1000).toLocaleDateString("he-IL")}
        </p>
        <p><strong>תיאור:</strong> {scholarship.summary}</p>

        {scholarship.requirements && (
          <p><strong>דרישות הגשה:</strong> {scholarship.requirements}</p>
        )}

        <div className="scholarship-actions">
          <button className="btn-apply">הגש מועמדות למלגה</button>
          <button className="btn-save" onClick={handleSave}>
            שמור לדשבורד שלי
          </button>
        </div>
      </div>
    </div>
  );
}
