import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';

const emptyForm = { roomNumber: '', capacity: '', status: 'Available' };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  useEffect(() => {
    axios.get('/api/rooms')
      .then(r => setRooms(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/rooms', { ...form, capacity: Number(form.capacity) });
      setRooms(prev => [...prev, data]);
      setForm(emptyForm);
      setShowForm(false);
      notify('✅ Room created successfully!');
    } catch (err) {
      notify(`❌ ${err.response?.data?.message || 'Failed to create room.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (room) => {
    setEditing(room._id);
    setEditForm({ roomNumber: room.roomNumber, capacity: room.capacity, status: room.status });
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await axios.put(`/api/rooms/${id}`, { ...editForm, capacity: Number(editForm.capacity) });
      setRooms(prev => prev.map(r => r._id === id ? data : r));
      setEditing(null);
      notify('✅ Room updated!');
    } catch {
      notify('❌ Failed to update room.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await axios.delete(`/api/rooms/${id}`);
      setRooms(prev => prev.filter(r => r._id !== id));
      notify('✅ Room deleted.');
    } catch {
      notify('❌ Failed to delete room.');
    }
  };

  return (
    <Layout title="Manage Rooms" subtitle="Add, edit, and manage hostel rooms">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${message.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400 text-sm">{rooms.length} room(s) total</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Room'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 max-w-lg">
          <h3 className="font-display font-bold text-white mb-4">New Room</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Room Number</label>
              <input value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} className="input" placeholder="e.g. A-101" required />
            </div>
            <div>
              <label className="label">Capacity</label>
              <input type="number" min="1" max="10" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="input" placeholder="e.g. 2" required />
            </div>
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                <option>Available</option>
                <option>Occupied</option>
                <option>Under Maintenance</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : rooms.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="text-gray-400">No rooms added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map(room => (
            <div key={room._id} className="card hover:border-border/80 transition-all">
              {editing === room._id ? (
                <div className="space-y-3">
                  <input value={editForm.roomNumber} onChange={e => setEditForm({ ...editForm, roomNumber: e.target.value })} className="input text-sm py-1.5" placeholder="Room No." />
                  <input type="number" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: e.target.value })} className="input text-sm py-1.5" placeholder="Capacity" />
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="input text-sm py-1.5">
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Under Maintenance</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(room._id)} className="flex-1 text-xs bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 py-1.5 rounded-lg font-medium transition-all">Save</button>
                    <button onClick={() => setEditing(null)} className="flex-1 text-xs bg-surface border border-border text-gray-400 py-1.5 rounded-lg font-medium transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600/15 border border-brand-600/25 flex items-center justify-center text-brand-400 font-display font-bold text-sm">
                      {room.roomNumber}
                    </div>
                    <StatusBadge status={room.status} />
                  </div>
                  <p className="text-white font-semibold text-lg font-display">{room.roomNumber}</p>
                  <p className="text-gray-400 text-sm mt-0.5">Capacity: {room.capacity} person(s)</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(room.createdAt).toLocaleDateString('en-IN')}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => startEdit(room)} className="flex-1 text-xs bg-brand-500/15 border border-brand-500/20 text-brand-400 hover:bg-brand-500/25 py-1.5 rounded-lg font-medium transition-all">Edit</button>
                    <button onClick={() => handleDelete(room._id)} className="flex-1 btn-danger text-xs py-1.5">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
