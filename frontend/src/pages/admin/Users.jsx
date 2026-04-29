import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(null);

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  useEffect(() => {
    axios.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (user) => {
    setEditing(user._id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`/api/users/${editing}`, form);
      setUsers(prev => prev.map(u => u._id === editing ? data : u));
      setEditing(null);
      notify('✅ User updated successfully!');
    } catch {
      notify('❌ Failed to update user.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      notify('✅ User deleted.');
    } catch {
      notify('❌ Failed to delete user.');
    } finally {
      setDeleting(null);
    }
  };

  const roleColors = { student: 'badge-progress', warden: 'bg-purple-500/15 text-purple-400 border border-purple-500/20 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', maintenance: 'badge-maintenance', admin: 'badge-open' };

  return (
    <Layout title="Manage Users" subtitle="View, edit, and remove system users">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${message.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/40">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      {editing === user._id ? (
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input text-sm py-1.5 w-36" />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-400">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editing === user._id ? (
                        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input text-sm py-1.5 w-44" />
                      ) : (
                        <span className="text-gray-400">{user.email}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editing === user._id ? (
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input text-sm py-1.5 w-36">
                          <option value="student">Student</option>
                          <option value="warden">Warden</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                          ${user.role === 'student' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : ''}
                          ${user.role === 'warden' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : ''}
                          ${user.role === 'maintenance' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : ''}
                          ${user.role === 'admin' ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : ''}
                        `}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {editing === user._id ? (
                          <>
                            <button onClick={handleUpdate} className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg font-medium transition-all">Save</button>
                            <button onClick={() => setEditing(null)} className="text-xs bg-surface border border-border text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-medium transition-all">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(user)} className="text-xs bg-brand-500/15 border border-brand-500/20 text-brand-400 hover:bg-brand-500/25 px-3 py-1.5 rounded-lg font-medium transition-all">Edit</button>
                            <button onClick={() => handleDelete(user._id)} disabled={deleting === user._id} className="btn-danger text-xs py-1.5 px-3">
                              {deleting === user._id ? '...' : 'Delete'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
