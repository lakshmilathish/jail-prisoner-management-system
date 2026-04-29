import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/complaints')
      .then(r => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const open = complaints.filter(c => c.status === 'Open').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <Layout title="Warden Dashboard" subtitle="Overview of all hostel complaints">
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Complaints" value={complaints.length} icon="📋" color="brand" />
            <StatCard label="Open" value={open} icon="🔴" color="yellow" />
            <StatCard label="In Progress" value={inProgress} icon="🔄" color="blue" />
            <StatCard label="Resolved" value={resolved} icon="✅" color="green" />
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white">Recent Complaints</h2>
              <Link to="/warden/complaints" className="text-brand-400 hover:text-brand-300 text-sm font-medium">Manage all →</Link>
            </div>
            {complaints.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No complaints yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-gray-400 text-left">
                      <th className="pb-3 font-medium">Student</th>
                      <th className="pb-3 font-medium">Room</th>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {complaints.slice(0, 8).map(c => (
                      <tr key={c._id} className="text-gray-300">
                        <td className="py-3 font-medium text-white">{c.studentId?.name || 'N/A'}</td>
                        <td className="py-3">{c.roomNumber}</td>
                        <td className="py-3 max-w-[220px] truncate">{c.description}</td>
                        <td className="py-3"><StatusBadge status={c.status} /></td>
                        <td className="py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
