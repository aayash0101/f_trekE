import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './index.css';

// Import Navbar
import Navbar from './components/Navbar';

// Auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

// Common
import Home from "./pages/Home";
import TrekList from "./pages/Treks/trekList";
import AddTrek from "./pages/Treks/AddTrek";
import UserList from "./pages/admin/Users/UserList";
import TreksPage from "./pages/TreksPage";
import HomePage from "./pages/HomePage";
import UserProfile from "./components/UserProfile";
import Footer from "./components/footer";
import Layout from "./layouts/layout";
import TrekDetailPage from "./pages/TrekDetailPage";
import TrekJournalPage from "./pages/Journal/TrekJournalPage";
import AllJournalsPage from "./pages/AllJournalsPage";
import EditTrek from "./pages/Treks/EditTrek";
import AboutUs from "./components/AboutUs";
import TrekReviewsPage from "./pages/TrekReviewsPage";


function AppContent() {
  const location = useLocation();
  // Routes where Navbar should not appear
  const noNavbarRoutes = ['/', '/home', '/login', '/signup', '/admindashboard', '/users', '/add', '/edit/:id', '/trek'];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Public & Auth routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Trekking related routes */}
        <Route path="/trek" element={<TrekList />} />
        <Route path="/add" element={<AddTrek />} />
        <Route path="/edit/:id" element={<EditTrek />} />
        <Route path="/treks/:trekId" element={<TrekDetailPage />} />
        <Route path="/trek/:trekId/journal" element={<TrekJournalPage />} />
        <Route path="/journals" element={<AllJournalsPage />} />
        <Route path="/trekker" element={<TreksPage />} />
        <Route path="/treks/:trekId/reviews" element={<TrekReviewsPage/>} />


        {/* User & Admin routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserList />} />

        {/* Other components */}
        <Route path="/footer" element={<Footer />} />
        <Route path="/layout" element={<Layout />} />

         <Route path="/us" element={<AboutUs />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
