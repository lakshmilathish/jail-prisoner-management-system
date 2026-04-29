import { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function SubmitComplaint() {
  const [form, setForm] = useState({ roomNumber: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/api/complaints', form);
      setSuccess('Complaint submitted successfully!');
      setTimeout(() => navigate('/student/complaints'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Submit Complaint" subtitle="Describe your issue and we'll get it resolved">
      <div className="max-w-xl">
        <div className="card">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Room Number</label>
              <input
                name="roomNumber"
                type="text"
                value={form.roomNumber}
                onChange={handleChange}
                className="input"
                placeholder="e.g. A-101"
                required
              />
            </div>
            <div>
              <label className="label">Complaint Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input min-h-[140px] resize-none"
                placeholder="Describe the issue in detail..."
                required
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" onClick={() => navigate('/student/dashboard')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 card bg-surface/50 text-sm text-gray-400">
          <p className="font-semibold text-gray-300 mb-2">📌 What happens next?</p>
          <ol className="space-y-1 list-decimal list-inside text-xs text-gray-500">
            <li>Your complaint will be reviewed by the warden</li>
            <li>It will be assigned to maintenance staff</li>
            <li>You can track the status in "My Complaints"</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}
