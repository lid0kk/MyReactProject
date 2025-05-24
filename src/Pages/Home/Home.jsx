import "../Home/Home.css";
import { Link } from "react-router-dom";
import logo from '../../assets/Pictures/logo.png';
import { MiniStats } from "../../Components/MiniStats";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="home-container">
      <motion.img
        src={logo}
        alt="Scholarship Match Logo"
        className="home-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        className="home-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        מצא את המלגה שמתאימה בדיוק לך
      </motion.h1>

      <motion.p
        className="home-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        הדרך המהירה והפשוטה למצוא את המלגה שתפורה במיוחד עבורך — בהתאמה אישית לתחום הלימודים, המוסד האקדמי והרקע האישי שלך.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Link to="/profile" className="home-start-btn">
          התחל התאמה עכשיו
        </Link>

      </motion.div>
       <MiniStats></MiniStats>
      
    </div>
  );
}
