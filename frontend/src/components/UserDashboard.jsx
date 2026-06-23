import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Star } from 'lucide-react';

export default function UserDashboard({ user, onLogout }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStores = () => {
    const token = localStorage.getItem('session_token');
    axios.get(`http://localhost:3000/stores?name=${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStores(res.data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const submitRating = async (storeId, score) => {
    const token = localStorage.getItem('session_token');
    try {
      await axios.post('http://localhost:3000/stores/rate', { storeId, score }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rating configuration data verified and applied!');
      fetchStores();
    } catch (err) {
      alert('Failed executing evaluation profile pipeline update.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-xl">
        <div>
          <h1 className="text-xl font-bold">Store Browser Hub</h1>
          <p className="text-gray-400 text-xs">Signed in as: {user.name}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 text-sm">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="w-full">
        <input 
          type="text" 
          placeholder="Filter down target store configurations via typing full names..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-xl shadow-sm focus:outline-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{store.name}</h3>
                <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2 py-1 rounded">
                  Avg: ★{store.rating || 'Unrated'}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{store.address}</p>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 font-medium mb-2">Adjust/Apply Your Evaluation Score:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(score => (
                  <button 
                    key={score} 
                    onClick={() => submitRating(store.id, score)}
                    className="p-1 hover:text-amber-500 text-gray-300 transition"
                  >
                    <Star size={20} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}