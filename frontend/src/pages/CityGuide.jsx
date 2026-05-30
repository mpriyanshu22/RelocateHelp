import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

const CityGuide = () => {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cities/${id}`);
        setCity(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!city) return <div className="text-center py-20">City not found</div>;

  return (
    <div>
      {/* City Hero */}
      <div className="relative h-96 w-full">
        <img src={city.imageUrl || 'https://via.placeholder.com/1200'} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="flex items-center gap-2 mb-4 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <MapPin className="h-5 w-5" />
            <span className="font-medium tracking-wide uppercase">City Guide</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">{city.name}</h1>
          <p className="text-xl max-w-2xl text-center text-gray-200">{city.overview}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" /> Cost of Living
              </h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  The overall cost of living in {city.name} is generally considered <span className="font-bold text-primary">{city.costOfLiving}</span>. 
                  When planning your budget, take into account housing variations between neighborhoods, local taxes, and typical utility costs.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Neighborhoods</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {city.keyNeighborhoods && city.keyNeighborhoods.map((neighborhood, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-primary transition-colors">
                    <div className="bg-blue-50 text-primary p-3 rounded-lg font-bold text-xl">{index + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{neighborhood}</h3>
                      <p className="text-gray-500 text-sm">Popular residential area with great amenities.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Local Essentials</h2>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <ul className="space-y-4">
                  {city.essentials && city.essentials.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700 text-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Relocate?</h3>
              <p className="text-gray-600 mb-6">Find the best housing, schools, and healthcare in {city.name} to make your move seamless.</p>
              
              <div className="space-y-3">
                <Link to={`/listings?cityId=${city._id}&category=housing`} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group">
                  <span className="font-medium text-gray-800">Housing Listings</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
                <Link to={`/listings?cityId=${city._id}&category=school`} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group">
                  <span className="font-medium text-gray-800">Local Schools</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
                <Link to={`/listings?cityId=${city._id}&category=healthcare`} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group">
                  <span className="font-medium text-gray-800">Healthcare Providers</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CityGuide;
