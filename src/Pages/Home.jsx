import "../Styles/Home.css";
import { Link } from "react-router-dom";
import logo from '../Pictures/logo.png';

export default function Home() {
  return (
    <div className="home-container">
      <img src={logo}  className="home-logo" />
      <h1 className="home-title">!מצא את המלגה שמתאימה בדיוק לך </h1>
      <p className="home-description">
           השירות שיעזור לך למצוא את המלגה הכי מתאימה עבורך לפי הפרופיל האישי שלך
      </p>

      <Link to="/search" className="home-start-btn">התחל התאמה</Link>

      <div className="home-links">
        <Link to="/help" className="home-link-btn">עזרה</Link>
        <Link to="/about" className="home-link-btn">מידע כללי</Link>
      </div>
      
    </div>
  );
}
