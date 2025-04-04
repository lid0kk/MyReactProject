import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function SeedScholarships() {
  const handleSeedScholarships = async () => {
    const scholarships = [
      {
        name: "מלגת נגב למצטיינים",
        amount: 8000,
        deadline: Timestamp.fromDate(new Date("2025-07-31")),
        summary: "מלגה לסטודנטים בנגב בעלי מצוינות אקדמית",
        requirements: "ממוצע מעל 90, תושבי הדרום",
      },
      {
        name: "מלגת מדעי המחשב",
        amount: 10000,
        deadline: Timestamp.fromDate(new Date("2025-06-15")),
        summary: "לסטודנטים בשנה ג' במדעי המחשב",
        requirements: "ממוצע 85+, המלצות מרצים",
      },
      {
        name: "מלגת חד הוריים",
        amount: 6000,
        deadline: Timestamp.fromDate(new Date("2025-05-01")),
        summary: "מלגה לסטודנטים חד הוריים בכל תחום לימוד",
        requirements: "אישור חד הוריות, מצב סוציו־אקונומי",
      },
    ];

    try {
      for (const s of scholarships) {
        await addDoc(collection(db, "scholarships"), s);
      }
      alert("✅ המלגות נוספו בהצלחה!");
    } catch (error) {
      console.error("שגיאה בהוספת מלגות:", error);
      alert("שגיאה בהוספת מלגות");
    }
  };

  const handleSeedUsers = async () => {
    const users = [
      {
        fullName: "אבי כהן",
        gender: "male",
        institution: "האוניברסיטה העברית",
        field: "משפטים",
        age: 26,
        familyStatus: "single",
        economicBackground: "medium",
      },
      {
        fullName: "דנה לוי",
        gender: "female",
        institution: "קריית אונו",
        field: "מנהל עסקים",
        age: 24,
        familyStatus: "married",
        economicBackground: "low",
      },
      {
        fullName: "רועי מזרחי",
        gender: "male",
        institution: "מכללת הדסה",
        field: "הנדסה רפואית",
        age: 27,
        familyStatus: "single",
        economicBackground: "high",
      },
      {
        fullName: "נטע בר",
        gender: "female",
        institution: "אוניברסיטת תל אביב",
        field: "מדעי המחשב",
        age: 25,
        familyStatus: "single",
        economicBackground: "medium",
      },
      {
        fullName: "יואב שלום",
        gender: "male",
        institution: "האוניברסיטה העברית",
        field: "פוליטיקה",
        age: 28,
        familyStatus: "married",
        economicBackground: "low",
      },
      {
        fullName: "אורית דביר",
        gender: "female",
        institution: "קריית אונו",
        field: "קרימינולוגיה",
        age: 23,
        familyStatus: "single",
        economicBackground: "high",
      },
    ];

    try {
      for (const user of users) {
        await addDoc(collection(db, "users"), {
          ...user,
          createdAt: Timestamp.now(),
        });
      }
      alert("✅ המשתמשים נוספו בהצלחה!");
    } catch (error) {
      console.error("שגיאה בהוספת משתמשים:", error);
      alert("שגיאה בהוספת משתמשים");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🎓 הוספת נתוני דוגמה</h2>
      <p>הוספת מלגות ומשתמשים עם כל שדות הטופס לפי המערכת שלך.</p>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={handleSeedScholarships}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          📥 הוסף מלגות לדוגמה
        </button>

        <button
          onClick={handleSeedUsers}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#198754",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          👥 הוסף משתמשים עם שדות מלאים
        </button>
      </div>
    </div>
  );
}
