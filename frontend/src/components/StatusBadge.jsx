export default function StatusBadge({ status }) {
  const map = {
    'Open': 'badge-open',
    'In Progress': 'badge-progress',
    'Resolved': 'badge-resolved',
    'Available': 'badge-available',
    'Occupied': 'badge-occupied',
    'Under Maintenance': 'badge-maintenance',
  };
  return <span className={map[status] || 'badge-open'}>{status}</span>;
}
