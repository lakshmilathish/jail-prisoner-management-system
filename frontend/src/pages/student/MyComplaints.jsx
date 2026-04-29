import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/complaints/mine')
      .then(r => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <Layout title="My Complaints" subtitle="Track all your submitted complaints">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-panel border border-border text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Link to="/student/complaints/new" className="btn-primary text-sm">+ New Complaint</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">No complaints found.</p>
          <Link to="/student/complaints/new" className="btn-primary inline-block mt-4">Submit a Complaint</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} className="card hover:border-border/80 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{c.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>🏠 Room {c.roomNumber}</span>
                    <span>📅 {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
