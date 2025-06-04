import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../Styles/MiniStats.css";

const COLORS = [
  "#0d6efd",
  "#198754",
  "#ff6b6b",
  "#ffc107",
  "#6f42c1",
  "#20c997",
  "#6c757d"
];

function MiniStats() {
  const [fieldStats, setFieldStats] = useState({});
  const [popularScholarships, setPopularScholarships] = useState([]);
  const [activeTab, setActiveTab] = useState("fields");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const applicationsSnap = await getDocs(collection(db, "applications"));
      const scholarshipsSnap = await getDocs(collection(db, "scholarships"));

      const fieldMap = {};
      usersSnap.docs.forEach((doc) => {
        const data = doc.data();
        const field = data.field || "לא מוגדר";
        fieldMap[field] = (fieldMap[field] || 0) + 1;
      });

      setFieldStats(fieldMap);

      const countByScholarship = {};
      applicationsSnap.docs.forEach(doc => {
        const scholarshipId = doc.data().scholarshipId;
        if (scholarshipId) {
          countByScholarship[scholarshipId] = (countByScholarship[scholarshipId] || 0) + 1;
        }
      });

      const scholarshipNames = {};
      scholarshipsSnap.docs.forEach(doc => {
        scholarshipNames[doc.id] = doc.data().name || "מלגה ללא שם";
      });

      const barData = Object.entries(countByScholarship).map(([id, count]) => ({
        name: scholarshipNames[id] || `מלגה ${id.substring(0, 5)}...`,
        value: count
      }));

      setPopularScholarships(barData);
    };

    fetchData();
  }, []);

  const fieldData = Object.entries(fieldStats).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  return (
    <div className="mini-stats-container">
      <h2 className="mini-stats-title"> סטטיסטיקות מעניינות</h2>

      <div className="tabs">
        <button className={activeTab === "fields" ? "tab active" : "tab"} onClick={() => setActiveTab("fields")}>תחומי לימוד</button>
        <button className={activeTab === "popular" ? "tab active" : "tab"} onClick={() => setActiveTab("popular")}>מלגות פופולריות</button>
      </div>

      <div className="chart-section">
        {activeTab === "fields" && (
          <div className="chart-box">
            <h3>פילוח לפי תחום לימודים</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={fieldData}
                layout="horizontal"
                barCategoryGap="20%"
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={isMobile ? -45 : -30}
                  textAnchor="end"
                  height={isMobile ? 120 : 100}
                  tick={{ dy: 60, dx: isMobile ? -30 : -30 }}
                />
                <YAxis
                  interval={0}
                  tick={{
                    dx: isMobile ? -20 : -15,
                    textAnchor: isMobile ? "end" : "middle"
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="מספר משתמשים" fill="#198754" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "popular" && (
          <div className="chart-box">
            <h3> המלגות הכי פופולריות</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={popularScholarships}
                layout="horizontal"
                barCategoryGap="15%"
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={isMobile ? -45 : -30}
                  textAnchor="end"
                  height={isMobile ? 120 : 100}
                  tick={{ dy: 64, dx: isMobile ? -40 : -30 }}
                />
                <YAxis
                  interval={0}
                  tick={{
                    dx: isMobile ? -30 : -20,
                    textAnchor: isMobile ? "end" : "middle"
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="מספר הגשות" fill="#ff6b6b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export { MiniStats };
