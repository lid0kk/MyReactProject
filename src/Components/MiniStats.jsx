import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ff6b6b"];

function MiniStats() {
  const [stats, setStats] = useState({ users: 0, scholarships: 0, genders: {} });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const scholarshipsSnap = await getDocs(collection(db, "scholarships"));

      const genderCounts = {};
      usersSnap.docs.forEach((doc) => {
        const g = doc.data().gender;
        if (g) genderCounts[g] = (genderCounts[g] || 0) + 1;
      });

      setStats({
        users: usersSnap.size,
        scholarships: scholarshipsSnap.size,
        genders: genderCounts,
      });
    };

    fetchStats();
  }, []);

  const genderData = Object.entries(stats.genders).map(([key, val]) => ({
    name: key === "male" ? "זכר" : key === "female" ? "נקבה" : "אחר",
    value: val,
  }));

  return (
    <div className="mini-stats-container">
      <h3>📊 סטטיסטיקות מהמערכת</h3>
      <div className="mini-stats-boxes">
        <div className="mini-stat-box">👥 משתמשים: {stats.users}</div>
        <div className="mini-stat-box">🎓 מלגות זמינות: {stats.scholarships}</div>
      </div>
      {genderData.length > 0 && (
        <div className="mini-pie-chart">
          <ResponsiveContainer width={250} height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name }) => name}
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

export { MiniStats };
