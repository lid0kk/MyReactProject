import { Link } from "react-router-dom";

export default function ScholarshipCard({ scholarship }) {
  return (
    <div className="card shadow h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title text-primary">{scholarship.name}</h5>
          <p className="card-text text-muted">סכום: ₪{scholarship.amount}</p>
          <p className="card-text">
            מועד אחרון: {new Date(scholarship.deadline.seconds * 1000).toLocaleDateString("he-IL")}
          </p>
          <p className="card-text">{scholarship.summary}</p>
        </div>
        <Link to={`/scholarship/${scholarship.id}`} className="btn btn-outline-primary mt-3">
          לפרטים
        </Link>
      </div>
    </div>
  );
}
