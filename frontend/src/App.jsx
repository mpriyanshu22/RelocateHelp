import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CityGuide from './pages/CityGuide';
import Listings from './pages/Listings';
import DetailPage from './pages/DetailPage';
import AdminPanel from './pages/AdminPanel';
import dotenv from 'dotenv';
dotenv.config();
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/city/:id" element={<CityGuide />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<DetailPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
