import "../Help/Help.css";

export default function Help() {
  return (
    <div className="help-container">
      <h2 className="help-title">שאלות נפוצות ועזרה</h2>

      <div className="faq-item">
        <h4>איך מתבצעת התאמת המלגות?</h4>
        <p>
          לאחר מילוי טופס ההתאמה, המערכת מחפשת מלגות שתואמות לפרמטרים שלך, כגון גיל, מגדר, תחום לימוד ועוד.
        </p>
      </div>

      <div className="faq-item">
        <h4>איך אני שומר מלגה שאהבתי?</h4>
        <p>
          בדף פרטי המלגה לחץ על "שמור לדשבורד שלי". המלגה תופיע בדף "מלגות שמורות".
        </p>
      </div>

      <div className="faq-item">
        <h4>איך יוצרים קשר עם התמיכה?</h4>
        <p>
          ניתן לשלוח לנו מייל לכתובת <a href="mailto:support@scholarshipmatch.co.il">support@scholarshipmatch.co.il</a>.
        </p>
      </div>
    </div>
  );
}
