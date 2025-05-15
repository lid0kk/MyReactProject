import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../MatchResults/MatchResults.css";
import "../../Styles/global.css";

export default function MatchResults() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("יש להתחבר כדי לראות מלגות מותאמות.");
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          toast.error("לא נמצאו פרטי משתמש.");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();

        const snapshot = await getDocs(collection(db, "scholarships"));
        const allScholarships = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allScholarships.filter((scholarship) => {
          return (
            (!scholarship.gender || scholarship.gender === userData.gender) &&
            (!scholarship.field || scholarship.field === userData.field) &&
            (!scholarship.economicBackground || scholarship.economicBackground === userData.economicBackground) &&
            (!scholarship.familyStatus || scholarship.familyStatus === userData.familyStatus) &&
            (!scholarship.institution || scholarship.institution === userData.institution)
         
          );
        });

        setScholarships(filtered);
      } catch (error) {
        console.error("שגיאה בטעינת מלגות:", error);
        toast.error("אירעה שגיאה בעת טעינת המלגות.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message">...טוען מלגות</p>
      </div>
    );
  }

  return (
    <div className="match-results-container">
      <h2 className="match-results-title">
        נמצאו {scholarships.length} מלגות שמתאימות לך
      </h2>

      {scholarships.length === 0 ? (
        <p className="no-results-message">לא נמצאו מלגות שתואמות את הפרופיל שלך.</p>
      ) : (
        <div className="match-grid">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="scholarship-card">
              <div className="card-content">
                <h5>{scholarship.name}</h5>
                <p>סכום: ₪{scholarship.amount}</p>
                <p>
                  מועד אחרון:{" "}
                  {scholarship.deadline?.seconds
                    ? new Date(scholarship.deadline.seconds * 1000).toLocaleDateString("he-IL")
                    : ""}
                </p>
                <p>{scholarship.summary}</p>
              </div>

              <div className="card-actions">
                <Link to={`/scholarship/${scholarship.id}`} className="btn-details">
                  לפרטים
                </Link>
                <button className="btn-apply">הגש מועמדות</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
