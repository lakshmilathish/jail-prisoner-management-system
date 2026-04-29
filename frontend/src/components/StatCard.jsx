export default function StatCard({ label, value, icon, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-600/15 text-brand-400 border-brand-600/20',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/15 text-green-400 border-green-500/20',
    red: 'bg-red-500/15 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-display font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
