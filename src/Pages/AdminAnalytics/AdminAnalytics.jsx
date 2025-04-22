import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import "../AdminAnalytics/AdminAnalytics.css";
import { db } from "../../Firebase/Firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
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

  const COLORS = ["#0d6efd", "#198754", "#ff6b6b", "#ffc107", "#6610f2"];

  return (
    <div className="admin-stats-container">
      <h2 className="admin-stats-title">📊 לוח בקרה – סטטיסטיקות מערכת</h2>

      <div className="stat-cards enhanced">
        <div className="stat-card glass">
          <div className="icon-box">👥</div>
          <div className="text-box">
            <h5>משתמשים</h5>
            <p className="stat-value primary">{users.length}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="icon-box">🎓</div>
          <div className="text-box">
            <h5>מלגות</h5>
            <p className="stat-value success">{scholarships.length}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="icon-box">🏛️</div>
          <div className="text-box">
            <h5>מוסדות</h5>
            <p className="stat-value secondary">{Object.keys(institutions).length}</p>
          </div>
        </div>
      </div>

      {Object.keys(institutions).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title">📚 מוסדות לימוד – גרף עמודות</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={toChartData(institutions)} barGap={4} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 , dy: 4 , dx: -35}} angle={0} interval={0} textAnchor="end" height={30} />
              <YAxis tick={{ fontSize: 12 , dy: -5 , dx: -20 }} />
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
          <h4 className="chart-title">📈 תחומי לימוד – גרף קווים</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={toChartData(fields)}barGap={4} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 , dy: 4 , dx: -20 }} interval={0}  textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 , dy: -5 , dx: -20 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#198754" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {Object.keys(genders).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title">🎂 פילוח מגדרי – גרף עוגה</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toChartData(translateGenders(genders))}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {toChartData(translateGenders(genders)).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
