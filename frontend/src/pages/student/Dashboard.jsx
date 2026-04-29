import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, p] = await Promise.all([
          axios.get('/api/complaints/mine'),
          axios.get('/api/students/me')
        ]);
        setComplaints(c.data);
        setProfile(p.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const open = complaints.filter(c => c.status === 'Open').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <Layout title={`Welcome, ${user?.name}!`} subtitle="Here's an overview of your hostel activity">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="card">
              <h2 className="font-display font-bold text-white mb-4">My Profile</h2>
              {profile ? (
                <div className="space-y-3">
                  {[
                    { label: 'Name', value: profile.name },
                    { label: 'Room', value: profile.roomNumber },
                    { label: 'Contact', value: profile.contact },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Profile not found</p>
              )}
              <Link to="/student/complaints/new" className="btn-primary w-full mt-5 block text-center">
                + Submit Complaint
              </Link>
            </div>

            {/* Recent complaints */}
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white">Recent Complaints</h2>
                <Link to="/student/complaints" className="text-brand-400 hover:text-brand-300 text-sm font-medium">View all →</Link>
              </div>
              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No complaints submitted yet.</p>
                  <Link to="/student/complaints/new" className="text-brand-400 hover:text-brand-300 text-sm mt-2 block">Submit your first complaint →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.slice(0, 4).map(c => (
                    <div key={c._id} className="flex items-start justify-between p-3 rounded-lg bg-surface/60 border border-border/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{c.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Room {c.roomNumber} · {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
