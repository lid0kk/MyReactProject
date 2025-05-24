import { Link } from "react-router-dom";
import "../NotFound/NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">העמוד שחיפשת לא נמצא</p>
      <Link to="/home" className="notfound-button">חזרה לדף הבית</Link>
    </div>
  );
}
