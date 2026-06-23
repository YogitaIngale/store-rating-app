import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Store, Star, BarChart3 } from 'lucide-react';

export default function OwnerDashboard({ user, onLogout }) {
  const [metrics, setMetrics] = useState({ 
    managedStores: 0, 
    averageStoreRating: 0, 
    totalRatingsReceived: 0 
  });

  useEffect(() => {
    // Fetch the session token from local storage
    const token = localStorage.getItem('session_token');
    
    // Call your NestJS owner metrics endpoint with the Bearer authorization header
    axios.get('http://localhost:3000/stores/owner-metrics', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMetrics(res.data);
    })
    .catch(err => {
      console.error('Error fetching business owner intelligence matrix:', err);
    });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Profile Header Panel */}
      <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Business Management Workspace</h1>
          <p className="text-gray-400 text-xs">Merchant Account: {user.name} ({user.email})</p>
        </div>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 text-sm transition"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Metrics Cards Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Stores Managed */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-b-4 border-blue-500">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">My Store Entities</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{metrics.managedStores || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
            <Store size={24} />
          </div>
        </div>

        {/* Card 2: Average Rating Across Portfolio */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-b-4 border-amber-500">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Portfolio Rating Index</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              ★ {metrics.averageStoreRating ? Number(metrics.averageStoreRating).toFixed(1) : '0.0'}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
            <Star size={24} fill="currentColor" />
          </div>
        </div>

        {/* Card 3: Total Feedback Counter */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-b-4 border-purple-500">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Client Feedback</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalRatingsReceived || 0}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">
            <BarChart3 size={24} />
          </div>
        </div>

      </div>
    </div>
  );
}