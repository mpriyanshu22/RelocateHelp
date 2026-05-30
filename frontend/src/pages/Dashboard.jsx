import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { User, Mail, ShieldCheck, MapPin, Star, Building, GraduationCap, HeartPulse } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'housing': return <Building className="h-4 w-4 text-blue-500" />;
      case 'school': return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'healthcare': return <HeartPulse className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold mx-auto mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
            <div className="flex items-center justify-center text-gray-500 mb-4 gap-2">
              <Mail className="h-4 w-4" /> {user.email}
            </div>
            
            <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 capitalize">
              {user.role === 'admin' ? <ShieldCheck className="h-4 w-4 text-accent" /> : <User className="h-4 w-4 text-primary" />}
              {user.role}
            </div>
          </div>
        </div>

        {/* Saved Items or Actions */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Relocation Tools
            </h3>
            <p className="text-gray-600 mb-6">Access quick links to manage your relocation process.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/listings" className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors">
                <h4 className="font-bold text-gray-900">Explore Services</h4>
                <p className="text-sm text-gray-500">Find housing, schools, and healthcare in your target city.</p>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-amber-50 transition-colors">
                  <h4 className="font-bold text-gray-900">Admin Panel</h4>
                  <p className="text-sm text-gray-500">Manage listings, cities, and user activity.</p>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-primary mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm">
              If you have any issues during your relocation process, our support team is here to help. 
              Contact us at support@relocatehub.com
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent fill-current" /> Saved Listings
            </h3>
            
            {user.savedListings && user.savedListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedListings.map(listing => (
                  <Link key={listing._id} to={`/listing/${listing._id}`} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                    <img src={listing.imageUrl || 'https://via.placeholder.com/100'} alt={listing.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                        <MapPin className="h-3 w-3 mr-1" /> {listing.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase flex items-center gap-1">
                          {getCategoryIcon(listing.category)} {listing.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <p className="text-gray-500 mb-3">No saved listings yet. Explore services to bookmark essentials!</p>
                <Link to="/listings" className="btn-primary inline-block text-sm py-2 px-4">Explore Listings</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
