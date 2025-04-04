import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import "../Styles/AdminAnalytics.css";
import { db } from "../Firebase/Firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function AdminAnalytics() {
  const [users, setUsers] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [institutions, setInstitutions] = useState({});
  const [fields, setFields] = useState({});
  const [genders, setGenders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const scholarshipsSnap = await getDocs(collection(db, "scholarships"));

      const usersData = usersSnap.docs.map((doc) => doc.data());
      const scholarshipsData = scholarshipsSnap.docs.map((doc) => doc.data());

      const instCounts = {};
      const fieldCounts = {};
      const genderCounts = {};

      usersData.forEach((u) => {
        if (u.institution) instCounts[u.institution] = (instCounts[u.institution] || 0) + 1;
        if (u.field) fieldCounts[u.field] = (fieldCounts[u.field] || 0) + 1;
        if (u.gender) genderCounts[u.gender] = (genderCounts[u.gender] || 0) + 1;
      });

      console.log("institutions:", instCounts);
      console.log("fields:", fieldCounts);
      console.log("genders:", genderCounts);

      setUsers(usersData);
      setScholarships(scholarshipsData);
      setInstitutions(instCounts);
      setFields(fieldCounts);
      setGenders(genderCounts);
    };

    fetchData();
  }, []);

  const translateGenders = (obj) => {
    const map = {
      male: "זכר",
      female: "נקבה",
      other: "אחר",
    };
  
    const translated = {};
    for (const key in obj) {
      const translatedKey = map[key] || key;
      translated[translatedKey] = obj[key];
    }
    return translated;
  };

  const toChartData = (obj) =>
    Object.entries(obj).map(([name, count]) => ({ name, count }));

  return (
    <div className="admin-stats-container">
      <h2 className="admin-stats-title">📊 דשבורד ניהולי – סטטיסטיקות מערכת</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <h5>👤 משתמשים רשומים</h5>
          <p className="text-primary">{users.length}</p>
        </div>
        <div className="stat-card">
          <h5>🎓 מלגות פעילות</h5>
          <p className="text-success">{scholarships.length}</p>
        </div>
        <div className="stat-card">
          <h5>🏫 מוסדות שונים</h5>
          <p className="text-secondary">{Object.keys(institutions).length}</p>
        </div>
      </div>

      {Object.keys(institutions).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title">פילוח לפי מוסדות לימוד</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={toChartData(institutions)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14  , dx: -30}}  domain={[0, 'dataMax + 5']} />
              <Tooltip />
              <Bar dataKey="count" fill="#0d6efd">
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {Object.keys(fields).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title">פילוח לפי תחום לימוד</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={toChartData(fields)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 16, fill: "#333", dx: -30 }} domain={[0, 'dataMax + 5']} />

              <Tooltip />
              <Bar dataKey="count" fill="#198754">
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {Object.keys(genders).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title">פילוח לפי מגדר</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={toChartData(translateGenders(genders))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 , dx: -30 }} domain={[0, 'dataMax + 5']}  />
              <Tooltip />
              <Bar dataKey="count" fill="#ff6b6b">
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
