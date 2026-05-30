import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Map, ArrowRight } from 'lucide-react';

const Home = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cities');
        setCities(res.data);
      } catch (err) {
        console.error('Failed to fetch cities', err);
      }
    };
    fetchCities();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/listings?search=${search}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-secondary text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070" alt="Cityscape" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Relocate with <span className="text-accent">Confidence</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Your one-stop solution to find housing, schools, and healthcare in your new city. We make moving seamless.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex bg-white rounded-full p-2 shadow-2xl">
            <div className="flex-grow flex items-center pl-4">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for housing, schools, doctors..."
                className="w-full py-3 px-4 text-gray-900 bg-transparent border-none outline-none focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-blue-600 text-white rounded-full px-8 py-3 font-semibold transition-colors flex items-center gap-2">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Popular Cities Section - Fixed Width Constraints */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h2>
            <p className="text-gray-600 text-lg">Find comprehensive guides for top relocation cities.</p>
          </div>
          <Link to="/listings" className="text-primary font-semibold hover:text-secondary flex items-center gap-1 group">
            View all services <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Refined responsive grid layout with larger gaps to maximize landscape coverage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
          {cities.map(city => (
            <Link
              key={city._id}
              to={`/city/${city._id}`}
              className="group card relative aspect-[4/5] w-full rounded-2xl overflow-hidden block shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <img
                src={city.imageUrl || 'https://via.placeholder.com/400'}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="h-4 w-4 text-accent" />
                  <span className="text-accent font-semibold tracking-wider text-xs uppercase">City Guide</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{city.overview}</p>
              </div>
            </Link>
          ))}

          {cities.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm">
              Loading cities or no cities found. Please run the seed script.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;