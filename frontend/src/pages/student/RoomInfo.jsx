import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';

export default function RoomInfo() {
  const [profile, setProfile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('/api/students/me'), axios.get('/api/rooms')])
      .then(([p, r]) => { setProfile(p.data); setRooms(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const myRoom = rooms.find(r => r.roomNumber === profile?.roomNumber);

  return (
    <Layout title="Room Information" subtitle="Details about your assigned room">
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
          {/* My Profile */}
          <div className="card">
            <h2 className="font-display font-bold text-white mb-4">My Details</h2>
            {profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-2xl font-bold text-brand-400">
                    {profile.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{profile.name}</p>
                    <p className="text-gray-400 text-sm">Student</p>
                  </div>
                </div>
                {[
                  { label: 'Room Number', value: profile.roomNumber, icon: '🏠' },
                  { label: 'Contact', value: profile.contact, icon: '📞' },
                  { label: 'Joined', value: new Date(profile.createdAt).toLocaleDateString('en-IN'), icon: '📅' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{item.icon} {item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Profile not found.</p>
            )}
          </div>

          {/* Room Details */}
          <div className="card">
            <h2 className="font-display font-bold text-white mb-4">Room Details</h2>
            {myRoom ? (
              <div className="space-y-4">
                <div className="text-center py-6 bg-surface/60 rounded-xl border border-border/50">
                  <p className="text-5xl font-display font-bold text-brand-400">{myRoom.roomNumber}</p>
                  <p className="text-gray-400 text-sm mt-1">Room Number</p>
                </div>
                {[
                  { label: 'Capacity', value: `${myRoom.capacity} person(s)`, icon: '👥' },
                  { label: 'Status', value: <StatusBadge status={myRoom.status} />, icon: '📊' },
                  { label: 'Added On', value: new Date(myRoom.createdAt).toLocaleDateString('en-IN'), icon: '📅' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{item.icon} {item.label}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🏗️</p>
                <p className="text-gray-400 text-sm">Room {profile?.roomNumber} not found in system.</p>
                <p className="text-gray-500 text-xs mt-1">Contact admin to register your room.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
