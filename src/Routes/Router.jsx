import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import LoginRegister from "../Pages/LoginRegister";
import SearchForm from "../Pages/SearchForm";
import MatchResults from "../Pages/MatchResults";
import ScholarshipDetail from "../Pages/ScholarshipDetail";
import AdminDashboard from "../Pages/AdminDashboard";
import AddScholarship from "../Pages/AddScholarship";
import EditScholarship from "../Pages/EditScholarship";
import UserProfile from "../Pages/UserProfile";
import AdminAnalytics from "../Pages/AdminAnalytics";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";
import SeedScholarships from "../Pages/Seedscholarship";
import SavedScholarships from "../Pages/SavedScholarships";
import About from "../Pages/About";
import Help from "../Pages/Help";



export default function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
    
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/search" element={<ProtectedRoute><SearchForm /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
        <Route path="/scholarship/:id" element={<ProtectedRoute><ScholarshipDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/seed" element={<ProtectedRoute><SeedScholarships /></ProtectedRoute>} />
        <Route path="/my-scholarships" element={<SavedScholarships />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddScholarship /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditScholarship /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />

      </Routes>
    </Router>
  );
}
