import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "../AdminDashboard/AdminDashboard.css";
import "../../Styles/global.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("נדרש להתחבר כדי לגשת לעמוד זה");
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData || userData.role !== "admin") {
        toast.error("אין לך הרשאות גישה לעמוד זה");
        navigate("/");
        return;
      }

      fetchScholarships();
    };

    checkAdmin();
  }, []);

  const fetchScholarships = async () => {
    const snapshot = await getDocs(collection(db, "scholarships"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setScholarships(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("האם אתה בטוח שברצונך למחוק את המלגה?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "scholarships", id));

      const usersSnap = await getDocs(collection(db, "users"));
      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;
        const savedRef = collection(db, `users/${userId}/savedScholarships`);
        const savedSnap = await getDocs(savedRef);

        savedSnap.forEach(async (savedDoc) => {
          const savedData = savedDoc.data();
          if (savedData.scholarshipId === id) {
            await deleteDoc(
              doc(db, `users/${userId}/savedScholarships`, savedDoc.id)
            );
          }
        });
      }

      toast.success("המלגה נמחקה בהצלחה (כולל מהשמורים)");
      fetchScholarships();
    } catch (error) {
      console.error("שגיאה במחיקה:", error);
      toast.error("אירעה שגיאה במחיקת המלגה.");
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message">...טוען דף ניהול</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎓 לוח ניהול המלגות</h1>
        <Link to="/admin/add" className="btn-add">
          הוספת מלגה ➕
        </Link>
      </div>

      {scholarships.length === 0 ? (
        <p className="no-scholarships">לא נמצאו מלגות להצגה.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="scholarship-table">
              <thead>
                <tr>
                  <th>שם המלגה</th>
                  <th>סכום</th>
                  <th>תאריך אחרון</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>₪{s.amount}</td>
                    <td>
                      {s.deadline?.seconds
                        ? new Date(s.deadline.seconds * 1000).toLocaleDateString("he-IL")
                        : ""}
                    </td>
                    <td className="action-buttons">
                      <Link to={`/scholarship/${s.id}`} className="btn-link">צפייה</Link>
                      <Link to={`/admin/edit/${s.id}`} className="btn-link">עריכה</Link>
                      <button onClick={() => handleDelete(s.id)} className="btn-delete">מחיקה</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-table">
            {scholarships.map((s) => (
              <div key={s.id} className="mobile-card">
                <h4>{s.name}</h4>
                <p>סכום: ₪{s.amount}</p>
                <p>
                  מועד אחרון: {s.deadline?.seconds
                    ? new Date(s.deadline.seconds * 1000).toLocaleDateString("he-IL")
                    : ""}
                </p>
                <div className="action-buttons">
                  <Link to={`/scholarship/${s.id}`} className="btn-link">צפייה</Link>
                  <Link to={`/admin/edit/${s.id}`} className="btn-link">עריכה</Link>
                  <button onClick={() => handleDelete(s.id)} className="btn-delete">מחיקה</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
