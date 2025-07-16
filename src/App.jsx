import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'



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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trek" element={<TrekList />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/add" element={<AddTrek />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/trekker" element={<TreksPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/treks/:trekId" element={<TrekDetailPage />} />
        <Route path="/trek/:trekId/journal" element={<TrekJournalPage />} />
        <Route path="/journals" element={<AllJournalsPage />} />
        <Route path="/edit/:id" element={<EditTrek />} />


      </Routes>
    </Router>
  );
};

export default App;
