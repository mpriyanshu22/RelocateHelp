import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Star, MapPin, Mail, Calendar, Heart, DollarSign } from 'lucide-react';

// FIXED: Dynamic environment URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DetailPage = () => {
  const { id } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && user.savedListings) {
      const saved = user.savedListings.some(item => item === id || item._id === id);
      setIsSaved(saved);
    }
  }, [user, id]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // FIXED: Switched endpoints from hardcoded localhost to API_BASE_URL variables
      const [listingRes, reviewRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/listings/${id}`),
        axios.get(`${API_BASE_URL}/api/reviews/${id}`)
      ]);
      setListing(listingRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!user) return setReviewError('You must be logged in to leave a review.');

    try {
      // FIXED: Switched endpoint to use dynamic variable
      await axios.post(`${API_BASE_URL}/api/reviews`, {
        listingId: id,
        rating: Number(rating),
        comment
      }, { withCredentials: true });
      
      setComment('');
      setRating(5);
      fetchData(); // Refresh data layout
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleSaveToggle = async () => {
    if (!user) return alert('Please log in to save listings.');
    try {
      // FIXED: Switched endpoint to use dynamic variable
      const res = await axios.post(`${API_BASE_URL}/api/auth/save-listing`, { listingId: id }, { withCredentials: true });
      setIsSaved(!isSaved);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!listing) return <div className="text-center py-20 text-gray-500 font-medium">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Listing Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-64 md:h-96 relative">
          <img src={listing.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'} alt={listing.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider text-gray-800 shadow-md">
            {listing.category}
          </div>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {listing.title}
                <button onClick={handleSaveToggle} className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none" title={isSaved ? "Remove from saved" : "Save this listing"}>
                  <Heart className={`h-6 w-6 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </h1>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-5 w-5 mr-1" />
                {listing.location}
                <span className="mx-2">•</span>
                {/* FIXED: Protected deep references using optional chaining */}
                <Link to={`/city/${listing.cityId?._id}`} className="text-primary hover:underline">{listing.cityId?.name || 'View City'}</Link>
              </div>
            </div>
            <div className="bg-blue-50 text-center p-4 rounded-xl min-w-[120px]">
              <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                <Star className="h-6 w-6 text-accent fill-current mr-1" />
                {listing.averageRating || 0}
              </div>
              <div className="text-xs text-gray-500 uppercase font-semibold">{listing.totalReviews || 0} Reviews</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this service</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><DollarSign className="h-5 w-5 mr-1 text-gray-400" /> Pricing</h3>
              <p className="text-lg">{listing.price > 0 ? <span className="font-bold text-gray-900">${listing.price}</span> : 'Contact for details'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><Mail className="h-5 w-5 mr-1 text-gray-400" /> Contact Info</h3>
              <p className="text-primary font-medium">{listing.contactDetails || 'No contact details specified'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews ({reviews.length})</h2>

        {/* Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
            {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`p-2 rounded-full transition-colors ${rating >= num ? 'text-accent' : 'text-gray-300'}`}
                  >
                    <Star className={`h-8 w-8 ${rating >= num ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                required
                rows="4"
                className="input-field resize-none"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        ) : (
          <div className="mb-10 bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-gray-700 mb-3">Please log in to share your experience.</p>
            <Link to="/login" className="btn-primary inline-block">Log In</Link>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* FIXED: Protected single-character avatar strings using optional chaining */}
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                </div>
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-3">{review.comment}</p>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailPage;