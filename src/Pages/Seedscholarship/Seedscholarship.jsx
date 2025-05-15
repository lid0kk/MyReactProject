import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function SeedScholarships() {
  const handleSeedScholarships = async () => {
    const scholarships = [
      {
        name: "מלגת מצטייני אונו",
        amount: 9000,
        deadline: Timestamp.fromDate(new Date("2025-09-01")),
        summary: "מלגה למצטיינים בקריית אונו בתחומי מדעי החברה",
        requirements: "ממוצע מעל 88",
        gender: "female",
        field: "מנהל עסקים",
        economicBackground: "low",
        institution: "קריית אונו"
      },
      {
        name: "מלגת עולים חדשים",
        amount: 7000,
        deadline: Timestamp.fromDate(new Date("2025-08-15")),
        summary: "מלגה לעולים חדשים מכל תחום לימוד",
        requirements: "תעודת עולה",
        economicBackground: "medium"
      },
      {
        name: "מלגת הייטק לחרדים",
        amount: 8500,
        deadline: Timestamp.fromDate(new Date("2025-07-10")),
        summary: "מלגה לסטודנטים חרדים בתחום ההייטק",
        requirements: "שייכות למוסד חרדי והוכחת לימודים בתחום",
        field: "מדעי המחשב",
        gender: "male",
        economicBackground: "low"
      },
      {
        name: "מלגת רוטשילד",
        amount: 12000,
        deadline: Timestamp.fromDate(new Date("2025-06-30")),
        summary: "מלגת הצטיינות כללית לסטודנטים מצטיינים",
        requirements: "ממוצע מעל 92",
      },
      {
        name: "מלגת נשים במדע",
        amount: 10000,
        deadline: Timestamp.fromDate(new Date("2025-10-01")),
        summary: "מלגה לנשים הלומדות תחומי מדעים מדויקים או הנדסה",
        gender: "female",
        field: "הנדסה רפואית"
      },
      {
        name: "מלגת משפחות חד הוריות",
        amount: 6500,
        deadline: Timestamp.fromDate(new Date("2025-05-20")),
        summary: "תמיכה לסטודנטים חד הוריים במוסדות אקדמיים מוכרים",
        familyStatus: "single",
        economicBackground: "low"
      },
      {
        name: "מלגת אקדמיה לכולם",
        amount: 5000,
        deadline: Timestamp.fromDate(new Date("2025-08-01")),
        summary: "מלגה פתוחה לכל סטודנט עם רקע סוציו־אקונומי חלש",
        economicBackground: "low"
      },
      {
        name: "מלגת טכנולוגיה מתקדמת",
        amount: 9500,
        deadline: Timestamp.fromDate(new Date("2025-09-15")),
        summary: "תמיכה לסטודנטים מצטיינים במדעי המחשב",
        field: "מדעי המחשב"
      },
      {
        name: "מלגת מצוינות באוניברסיטה העברית",
        amount: 11000,
        deadline: Timestamp.fromDate(new Date("2025-06-05")),
        summary: "מלגה לסטודנטים עם הישגים באוניברסיטה העברית",
        institution: "האוניברסיטה העברית",
        economicBackground: "medium"
      },
      {
        name: "מלגת מנהיגות לנשים",
        amount: 8000,
        deadline: Timestamp.fromDate(new Date("2025-07-25")),
        summary: "מלגה לנשים עם פוטנציאל מנהיגות בתחום החברתי",
        gender: "female",
        field: "פוליטיקה"
      }
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
