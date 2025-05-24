import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import "../AdminAnalytics/AdminAnalytics.css";
import { db } from "../../Firebase/Firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList
} from "recharts";

export default function AdminAnalytics() {
  const [users, setUsers] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [institutions, setInstitutions] = useState({});
  const [fields, setFields] = useState({});
  const [genders, setGenders] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0d6efd", "#198754", "#ff6b6b", "#ffc107", "#6610f2"];

  return (
    <div className="admin-stats-container">
      <div className="admin-stats-header centered">
        <h2 className="admin-stats-title"> לוח בקרה – סטטיסטיקות מערכת </h2>
      </div>

      <div className="stat-cards modern-layout">
        {[{ label: "משתמשים", icon: "👥", value: users.length, class: "primary" },
          { label: "מלגות", icon: "🎓", value: scholarships.length, class: "success" },
          { label: "מוסדות", icon: "🏛️", value: Object.keys(institutions).length, class: "secondary" },
        ].map(({ label, icon, value, class: c }, i) => (
          <div className={`stat-box shadow-card ${c}`} key={i}>
            <div className="stat-icon-circle">{icon}</div>
            <div className="stat-label-group">
              <span className="stat-label-text">{label}</span>
              <span className="stat-value-text">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {[institutions, fields].map((dataset, index) => {
        const chartData = toChartData(dataset);

        return (
          <div key={index} className="chart-section">
            <h4 className="chart-title">
              {index === 0 && ` מוסדות לימוד – גרף עמודות`}
              {index === 1 && ` תחומי לימוד – גרף עמודות`}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}  barCategoryGap={isMobile ? '12%' : "30%"}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12, angle: isMobile ? -30 : 0, dx: -5, dy: 15 }}
                  interval={0}
                  height={80}
                />
                <YAxis tick={{ fontSize: isMobile ? 12 : 15  , dx: -30}} />
                <Tooltip />
                <Bar dataKey="value"    fill={index === 0 ? "#0d6efd" : "#198754"}>
                  
                  <LabelList dataKey="value" position="top" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}

      {Object.keys(genders).length > 0 && (
        <div className="chart-section">
          <h4 className="chart-title"> פילוח מגדרי – גרף עוגה</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
          data={toChartData(translateGenders(genders))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? 100 : 120}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isMobile ? 10 : 12}
              >
                {`${name} ${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {toChartData(translateGenders(genders)).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
