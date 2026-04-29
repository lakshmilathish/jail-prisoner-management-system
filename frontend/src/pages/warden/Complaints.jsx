import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [assigning, setAssigning] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([axios.get('/api/complaints'), axios.get('/api/users/maintenance-staff')])
      .then(([c, s]) => { setComplaints(c.data); setStaff(s.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  const handleAssign = async (complaintId) => {
    const staffId = selectedStaff[complaintId];
    if (!staffId) return setMessage('Please select a staff member.');
    setAssigning(complaintId);
    try {
      const { data } = await axios.put(`/api/complaints/${complaintId}/assign`, { staffId });
      setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: data.status } : c));
      setMessage('✅ Complaint assigned successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Failed to assign complaint.');
    } finally {
      setAssigning(null);
    }
  };

  return (
    <Layout title="All Complaints" subtitle="Review and assign complaints to maintenance staff">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${message.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === s ? 'bg-brand-600 text-white' : 'bg-panel border border-border text-gray-400 hover:text-white'
            }`}
          >
            {s}
            <span className="ml-1.5 text-xs opacity-70">
              ({s === 'All' ? complaints.length : complaints.filter(c => c.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">No complaints in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-semibold">{c.studentId?.name || 'Unknown'}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-gray-300 text-sm">{c.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>🏠 Room {c.roomNumber}</span>
                    <span>📧 {c.studentId?.email}</span>
                    <span>📅 {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {c.status === 'Open' && staff.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={selectedStaff[c._id] || ''}
                      onChange={e => setSelectedStaff(prev => ({ ...prev, [c._id]: e.target.value }))}
                      className="input text-sm py-2 w-44"
                    >
                      <option value="">Select staff...</option>
                      {staff.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <button
                      onClick={() => handleAssign(c._id)}
                      disabled={assigning === c._id}
                      className="btn-primary text-sm py-2 whitespace-nowrap"
                    >
                      {assigning === c._id ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                )}
                {c.status !== 'Open' && (
                  <span className="text-xs text-gray-500 shrink-0">
                    {c.status === 'Resolved' ? '✅ Done' : '⚙️ Being handled'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
