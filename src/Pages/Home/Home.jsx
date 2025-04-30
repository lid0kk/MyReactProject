import "../Home/Home.css";
import { Link } from "react-router-dom";
import logo from '../../assets/Pictures/logo.png';

export default function Home() {

   
  return (
    <div className="home-container">
      <img src={logo} alt="Scholarship Match Logo" className="home-logo" />

      <h1 className="home-title">
        מצא את המלגה שמתאימה בדיוק לך 
      </h1>

      <p className="home-description">
      הדרך המהירה והפשוטה למצוא את המלגה שתפורה במיוחד עבורך — בהתאמה אישית לתחום הלימודים, המוסד האקדמי והרקע האישי שלך.   
      </p>

      <Link to="/search" className="home-start-btn">
         התחל התאמה 
      </Link>

      <div className="home-links">
        <Link to="/help" className="home-link-btn"> עזרה </Link>
        <Link to="/about" className="home-link-btn"> מידע כללי </Link>
      </div>
    </div>
  );
}
