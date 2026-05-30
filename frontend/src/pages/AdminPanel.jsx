import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const { user, loading } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState({ name: '', overview: '', costOfLiving: 'Medium', imageUrl: '', keyNeighborhoods: '', essentials: '' });
  const [success, setSuccess] = useState('');
  
  const [newListing, setNewListing] = useState({ title: '', category: 'housing', cityId: '', location: '', price: '', contactDetails: '', description: '', imageUrl: '' });
  const [listingSuccess, setListingSuccess] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cities`);
      setCities(res.data);
      if (res.data.length > 0) {
        setNewListing(prev => ({ ...prev, cityId: res.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/cities`, newCity, { withCredentials: true });
      setSuccess('City added successfully!');
      setNewCity({ name: '', overview: '', costOfLiving: 'Medium', imageUrl: '', keyNeighborhoods: '', essentials: '' });
      fetchCities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/listings`, newListing, { withCredentials: true });
      setListingSuccess('Listing added successfully!');
      setNewListing({ title: '', category: 'housing', cityId: cities[0]?._id || '', location: '', price: '', contactDetails: '', description: '', imageUrl: '' });
      setTimeout(() => setListingSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <ShieldAlert className="h-8 w-8 text-accent" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Control Panel</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Add City Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Add New City Guide
          </h2>
          
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>}
          
          <form onSubmit={handleAddCity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
              <input 
                type="text" 
                required 
                className="input-field" 
                value={newCity.name}
                onChange={e => setNewCity({...newCity, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
              <textarea 
                required 
                rows="3" 
                className="input-field resize-none"
                value={newCity.overview}
                onChange={e => setNewCity({...newCity, overview: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost of Living</label>
              <select 
                className="input-field"
                value={newCity.costOfLiving}
                onChange={e => setNewCity({...newCity, costOfLiving: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                type="text" 
                className="input-field" 
                value={newCity.imageUrl}
                onChange={e => setNewCity({...newCity, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Neighborhoods</label>
              <input 
                type="text" 
                className="input-field" 
                value={newCity.keyNeighborhoods}
                onChange={e => setNewCity({...newCity, keyNeighborhoods: e.target.value})}
                placeholder="Downtown, Uptown, Suburbs (comma separated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local Essentials</label>
              <input 
                type="text" 
                className="input-field" 
                value={newCity.essentials}
                onChange={e => setNewCity({...newCity, essentials: e.target.value})}
                placeholder="Public Transit, Parks, Schools (comma separated)"
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-4">Create City</button>
          </form>
        </div>

        {/* Existing Cities List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Managed Cities</h2>
          <div className="space-y-3">
            {cities.map(city => (
              <div key={city._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                <div>
                  <h3 className="font-bold text-gray-900">{city.name}</h3>
                  <span className="text-xs font-semibold text-primary bg-blue-100 px-2 py-0.5 rounded-full">
                    {city.costOfLiving} Cost
                  </span>
                </div>
              </div>
            ))}
            {cities.length === 0 && <p className="text-gray-500">No cities found.</p>}
          </div>
        </div>

      </div>

      {/* Add Service Listing Form */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" /> Add Service Listing
        </h2>
        
        {listingSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{listingSuccess}</div>}
        
        <form onSubmit={handleAddListing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required className="input-field" value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="input-field" value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})}>
              <option value="housing">Housing</option>
              <option value="school">School</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target City</label>
            <select required className="input-field" value={newListing.cityId} onChange={e => setNewListing({...newListing, cityId: e.target.value})}>
              <option value="">Select a city...</option>
              {cities.map(city => (
                <option key={city._id} value={city._id}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" required className="input-field" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" className="input-field" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
            <input type="text" className="input-field" value={newListing.contactDetails} onChange={e => setNewListing({...newListing, contactDetails: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="text" className="input-field" value={newListing.imageUrl} onChange={e => setNewListing({...newListing, imageUrl: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows="3" className="input-field resize-none" value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})}></textarea>
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="btn-primary w-full">Create Listing</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AdminPanel;