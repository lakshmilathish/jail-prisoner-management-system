import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export default function MaintenanceDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/maintenance/mine')
      .then(r => setTasks(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      const { data } = await axios.put(`/api/maintenance/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: data.status } : t));
      setMessage('✅ Status updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const open = tasks.filter(t => t.status === 'Open').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const resolved = tasks.filter(t => t.status === 'Resolved').length;
  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  const nextStatus = { 'Open': 'In Progress', 'In Progress': 'Resolved' };

  return (
    <Layout title="My Assigned Tasks" subtitle="Manage and update your maintenance assignments">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${message.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Open Tasks" value={open} icon="🔴" color="yellow" />
        <StatCard label="In Progress" value={inProgress} icon="🔄" color="blue" />
        <StatCard label="Resolved" value={resolved} icon="✅" color="green" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === s ? 'bg-brand-600 text-white' : 'bg-panel border border-border text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-gray-400">No tasks in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(task => {
            const complaint = task.complaintId;
            const next = nextStatus[task.status];
            return (
              <div key={task._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-white">
                        Room {complaint?.roomNumber || 'N/A'}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-gray-300 text-sm">{complaint?.description || 'No description'}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span>👤 {complaint?.studentId?.name || 'Unknown student'}</span>
                      <span>📅 {new Date(task.updatedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {next && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, next)}
                      disabled={updating === task._id}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        next === 'In Progress'
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                          : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {updating === task._id ? 'Updating...' : `Mark ${next}`}
                    </button>
                  )}
                  {task.status === 'Resolved' && (
                    <span className="text-green-400 text-sm font-medium shrink-0">✅ Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
