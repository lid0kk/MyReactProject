import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth"; 
import "../SavedScholarships/SavedScholarships.css";
import "../../Styles/global.css";

export default function SavedScholarships() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, userLoading] = useAuthState(auth); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      if (userLoading) return; 
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const savedRef = collection(db, `users/${user.uid}/savedScholarships`);
        const savedSnap = await getDocs(savedRef);

        const filtered = [];

        for (const docSnap of savedSnap.docs) {
          const data = docSnap.data();
          const scholarshipId = data.scholarshipId;

          const scholarshipRef = doc(db, "scholarships", scholarshipId);
          const scholarshipSnap = await getDoc(scholarshipRef);

          if (scholarshipSnap.exists()) {
            filtered.push({
              id: docSnap.id,
              scholarshipId,
              ...scholarshipSnap.data(),
            });
          }
        }

        setSaved(filtered);
      } catch (err) {
        console.error("שגיאה בטעינת מלגות שמורות:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user, userLoading]);

  const handleDelete = async (id) => {
    try {
      if (!user) return;

      await deleteDoc(doc(db, `users/${user.uid}/savedScholarships`, id));
      setSaved((prev) => prev.filter((s) => s.id !== id));
      toast.success("המלגה הוסרה מהרשימה שלך");
    } catch (err) {
      console.error("שגיאה במחיקה:", err);
      toast.error("שגיאה במחיקת המלגה");
    }
  };

  if (userLoading || loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message">...טוען מלגות שמורות</p>
      </div>
    );
  }

  if (saved.length === 0)
    return <p className="no-saved-message">לא שמרת עדיין מלגות.</p>;

  return (
    <div className="saved-container">
      <h2 className="saved-title"> המלגות ששמרת 💾</h2>

      <div className="saved-grid">
        {saved.map((s) => (
          <div key={s.id} className="saved-card">
            <div className="saved-card-content">
              <h5>{s.name}</h5>
              <p>סכום: ₪{s.amount}</p>
              <p>
                מועד אחרון:{" "}
                {s.deadline?.seconds
                  ? new Date(s.deadline.seconds * 1000).toLocaleDateString("he-IL")
                  : ""}
              </p>
            </div>

            <div className="saved-card-actions">
              <Link
                to={`/scholarship/${s.scholarshipId}`}
                className="saved-card-button"
              >
                מעבר לפרטי המלגה
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(s.id)}
                title="מחק מלגה"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
