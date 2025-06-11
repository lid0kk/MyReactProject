import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import LoginRegister from "../Pages/LoginRegister/LoginRegister";
import MatchResults from "../Pages/MatchResults/MatchResults";
import ScholarshipDetail from "../Pages/ScholarshipDetail/ScholarshipDetail";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import AddScholarship from "../Pages/AddScholarship/AddScholarship";
import EditScholarship from "../Pages/EditScholarship/EditScholarship";
import UserProfile from "../Pages/UserProfile/UserProfile";
import AdminAnalytics from "../Pages/AdminAnalytics/AdminAnalytics";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";
import SavedScholarships from "../Pages/SavedScholarships/SavedScholarships";
import NotFound from "../Pages/NotFound/NotFound";
import SearchForm from "../Pages/SearchForm/SearchForm";



export default function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/login" element={<LoginRegister /> }/>
        <Route path="/search" element={<ProtectedRoute><SearchForm /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
        <Route path="/scholarship/:id" element={<ProtectedRoute><ScholarshipDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/my-scholarships" element={<SavedScholarships />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddScholarship /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditScholarship /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}
