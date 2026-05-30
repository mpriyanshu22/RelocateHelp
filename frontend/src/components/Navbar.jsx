import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">RelocateHub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/listings" className="text-gray-600 hover:text-primary font-medium transition-colors">Explore</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1 text-gray-600 hover:text-accent font-medium transition-colors">
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Sign In</Link>
                <Link to="/login" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
