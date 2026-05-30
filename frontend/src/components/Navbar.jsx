import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, LogOut, User, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
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
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Sign In</Link>
                <Link to="/login" className="btn-primary whitespace-nowrap">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 z-40">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/listings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Explore
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-accent font-medium transition-colors"
                  >
                    <ShieldCheck className="h-5 w-5" /> Admin
                  </Link>
                )}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-primary font-medium transition-colors text-center w-full block py-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-center w-full py-2 block"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
