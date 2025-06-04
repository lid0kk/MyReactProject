import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { db, auth } from "../../Firebase/Firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../MatchResults/MatchResults.css";

export default function MatchResults() {
  const [scholarships, setScholarships] = useState([]);
  const [submittedScholarships, setSubmittedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

        const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
        const allScholarships = scholarshipsSnap.docs.map((doc) => {
          const data = doc.data();

          if (data.gender && data.gender !== userData.gender) return null;

          let score = 0;
          let total = 0;

          if (data.field) {
            total++;
            if (data.field === userData.field) score++;
          }

          if (data.economicBackground) {
            total++;
            if (data.economicBackground === userData.economicBackground) score++;
          }

          if (data.familyStatus) {
            total++;
            if (data.familyStatus === userData.familyStatus) score++;
          }

          if (data.institution) {
            total++;
            if (data.institution === userData.institution) score++;
          }

          const matchPercent = total > 0 ? Math.round((score / total) * 100) : 100;

          return {
            id: doc.id,
            ...data,
            matchPercent
          };
        });

        const filtered = allScholarships
          .filter((s) => s && s.matchPercent >= 60)
          .sort((a, b) => b.matchPercent - a.matchPercent);

        setScholarships(filtered);

        const applicationsSnap = await getDocs(collection(db, "applications"));
        const submitted = applicationsSnap.docs
          .map((doc) => doc.data())
          .filter((app) => app.userId === user.uid)
          .map((app) => app.scholarshipId);

        setSubmittedScholarships(submitted);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
        toast.error("אירעה שגיאה בעת טעינת הנתונים.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (scholarshipId) => {
    const user = auth.currentUser;
    if (!user) return;

    if (submittedScholarships.includes(scholarshipId)) {
      toast.info("כבר הגשת למלגה זו.");
      return;
    }

    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        scholarshipId: scholarshipId,
        appliedAt: new Date()
      });

      setSubmittedScholarships((prev) => [...prev, scholarshipId]);

      setShowConfetti(true);
      setShowMessage(true);
      setFadeOut(false);
      setTimeout(() => setShowConfetti(false), 5500);
      setTimeout(() => setFadeOut(true), 2500);
      setTimeout(() => setShowMessage(false), 3500);

      toast.success("המועמדות נשלחה בהצלחה!");
    } catch (err) {
      console.error("שגיאה בשליחה:", err);
      toast.error("שגיאה בשליחת המועמדות");
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message"> טוען מלגות ...</p>
      </div>
    );
  }

  return (
    <div className="match-results-container">
      {showConfetti && <Confetti />}
      {showMessage && (
        <div className={`thank-you-message ${fadeOut ? "fade-out" : ""}`}>
          🥳 תודה שהגשת למלגה!
        </div>
      )}

      <h2 className="match-results-title">
        נמצאו {scholarships.length} מלגות מותאמות עבורך
      </h2>

      {scholarships.length === 0 ? (
        <p className="no-results-message">לא נמצאו מלגות תואמות לפרופיל שלך.</p>
      ) : (
        <div className="match-grid">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="scholarship-card">
              <div className="card-content">
                <h5>{scholarship.name}</h5>
                <p>סכום: ₪{scholarship.amount}</p>
                <p>אחוז התאמה: {scholarship.matchPercent}%</p>
                <p>
                  מועד אחרון:{" "}
                  {scholarship.deadline?.seconds
                    ? new Date(scholarship.deadline.seconds * 1000).toLocaleDateString("he-IL")
                    : ""}
                </p>
              
              </div>

              <div className="card-actions">
                <Link to={`/scholarship/${scholarship.id}`} className="btn-details">
                  לפרטים
                </Link>
                <button
                  onClick={() => handleSubmit(scholarship.id)}
                  className="btn-apply"
                  disabled={submittedScholarships.includes(scholarship.id)}
                >
                  {submittedScholarships.includes(scholarship.id)
                    ? "כבר הוגש"
                    : "שלח מועמדות"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
