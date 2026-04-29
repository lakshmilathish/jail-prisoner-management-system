import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, rooms: 0, complaints: 0, maintenance: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/users'),
      axios.get('/api/rooms'),
      axios.get('/api/complaints'),
      axios.get('/api/maintenance'),
    ]).then(([u, r, c, m]) => {
      setUsers(u.data);
      setStats({
        users: u.data.length,
        rooms: r.data.length,
        complaints: c.data.length,
        maintenance: m.data.length,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const roleColors = { student: 'text-blue-400', warden: 'text-purple-400', maintenance: 'text-orange-400', admin: 'text-brand-400' };
  const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

  return (
    <Layout title="Admin Dashboard" subtitle="Full system overview and management">
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats.users} icon="👥" color="brand" />
            <StatCard label="Total Rooms" value={stats.rooms} icon="🏠" color="purple" />
            <StatCard label="Complaints" value={stats.complaints} icon="📋" color="yellow" />
            <StatCard label="Maintenance Jobs" value={stats.maintenance} icon="🔧" color="orange" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="font-display font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: '/admin/users', label: 'Manage Users', icon: '👥', desc: 'Add, edit, remove users' },
                  { to: '/admin/rooms', label: 'Manage Rooms', icon: '🏠', desc: 'Add, edit hostel rooms' },
                ].map(item => (
                  <Link key={item.to} to={item.to} className="flex items-center gap-3 p-3 rounded-lg bg-surface/60 border border-border/50 hover:border-brand-600/40 hover:bg-brand-600/5 transition-all group">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-brand-300 transition-colors">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* User breakdown */}
            <div className="card">
              <h2 className="font-display font-bold text-white mb-4">Users by Role</h2>
              <div className="space-y-3">
                {['student', 'warden', 'maintenance', 'admin'].map(role => (
                  <div key={role} className="flex justify-between items-center">
                    <span className={`text-sm capitalize font-medium ${roleColors[role]}`}>{role}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${stats.users ? ((roleCounts[role] || 0) / stats.users) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-bold w-4 text-right">{roleCounts[role] || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white">Recent Users</h2>
                <Link to="/admin/users" className="text-brand-400 hover:text-brand-300 text-sm">View all →</Link>
              </div>
              <div className="space-y-2.5">
                {users.slice(0, 5).map(u => (
                  <div key={u._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-400">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium leading-tight">{u.name}</p>
                        <p className="text-gray-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs capitalize font-medium ${roleColors[u.role]}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
