import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpDown, LogOut, Store, Users, BarChart } from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [stores, setStores] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get('http://localhost:3000/stores/admin-metrics', { headers })
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:3000/stores?sortField=${sortField}&sortOrder=${sortOrder}`, { headers })
      .then(res => setStores(res.data))
      .catch(err => console.error(err));
  }, [sortField, sortOrder]);

  const toggleSort = (field) => {
    setSortOrder(prev => (sortField === field && prev === 'ASC' ? 'DESC' : 'ASC'));
    setSortField(field);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(filterText.toLowerCase()) || 
    store.address.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-xl">
        <div>
          <h1 className="text-2xl font-bold">System Administration Console</h1>
          <p className="text-gray-500 text-sm">Operator: {user.name} ({user.email})</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-blue-500">
          <div><p className="text-gray-400 text-sm">System Members</p><h3 className="text-3xl font-bold">{metrics.totalUsers}</h3></div>
          <Users className="text-blue-500" size={32} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-green-500">
          <div><p className="text-gray-400 text-sm">Managed Stores</p><h3 className="text-3xl font-bold">{metrics.totalStores}</h3></div>
          <Store className="text-green-500" size={32} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-purple-500">
          <div><p className="text-gray-400 text-sm">Aggregated Customer Ratings</p><h3 className="text-3xl font-bold">{metrics.totalRatings}</h3></div>
          <BarChart className="text-purple-500" size={32} />
        </div>
      </div>

    
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">Managed Stores Directory</h2>
          <input 
            type="text" 
            placeholder="Search matching criteria (Name / Address)..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border rounded-lg w-full sm:max-w-xs focus:outline-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                  Store Entity Name <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="p-3">Email Contact Point</th>
                <th className="p-3">Physical Address</th>
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort('rating')}>
                  Overall Score Metric <ArrowUpDown size={14} className="inline ml-1" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map(store => (
                <tr key={store.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-3 font-medium">{store.name}</td>
                  <td className="p-3 text-gray-500">{store.email}</td>
                  <td className="p-3 max-w-xs truncate">{store.address}</td>
                  <td className="p-3">
                    <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-semibold">
                      ★ {store.rating || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}