import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Filter, Star, MapPin, Building, GraduationCap, HeartPulse } from 'lucide-react';

// FIXED: Added dynamic backend base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCityId = searchParams.get('cityId') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    cityId: initialCityId,
    minRating: '',
    sortBy: ''
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      // FIXED: Replaced hardcoded localhost string with dynamic API_BASE_URL endpoint
      const res = await axios.get(`${API_BASE_URL}/api/listings?${queryParams}`);
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'housing': return <Building className="h-5 w-5 text-blue-500" />;
      case 'school': return <GraduationCap className="h-5 w-5 text-green-500" />;
      case 'healthcare': return <HeartPulse className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-lg mb-6 text-gray-800">
              <Filter className="h-5 w-5 text-primary" /> Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                  type="text" 
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="input-field py-2"
                  placeholder="Keywords..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-field py-2"
                >
                  <option value="">All Categories</option>
                  <option value="housing">Housing</option>
                  <option value="school">Schools</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select 
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className="input-field py-2"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="input-field py-2"
                >
                  <option value="">Default</option>
                  <option value="popularity">Highest Popularity</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Listings</h1>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.map(listing => (
                <Link key={listing._id} to={`/listing/${listing._id}`} className="card flex flex-col sm:flex-row group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                    <img src={listing.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white p-1.5 rounded-full shadow-md">
                      {getCategoryIcon(listing.category)}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{listing.title}</h3>
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-accent fill-current" />
                          <span className="ml-1 text-sm font-medium">{listing.averageRating || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">{listing.category}</span>
                      {listing.price > 0 ? (
                        <span className="font-bold text-primary">${listing.price}/mo</span>
                      ) : (
                        <span className="font-bold text-green-600">Contact for info</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Listings;