import { Package, Truck, XCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function HeaderBar({ view, onBack, statusFilter, onChangeFilter }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          {view !== 'list' && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <h1 className="text-lg font-semibold">Picker Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <FilterButton
            active={statusFilter === 'Pending'}
            onClick={() => onChangeFilter('Pending')}
            icon={<Package size={16} />}
            label="Pending"
          />
          <FilterButton
            active={statusFilter === 'Picker Packed'}
            onClick={() => onChangeFilter('Picker Packed')}
            icon={<CheckCircle2 size={16} />}
            label="Picked"
          />
          <FilterButton
            active={statusFilter === 'Shipped'}
            onClick={() => onChangeFilter('Shipped')}
            icon={<Truck size={16} />}
            label="Shipped"
          />
          <FilterButton
            active={statusFilter === 'Cancelled'}
            onClick={() => onChangeFilter('Cancelled')}
            icon={<XCircle size={16} />}
            label="Cancelled"
          />
        </div>
      </div>
    </header>
  );
}

function FilterButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition ${
        active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-neutral-50'
      }`}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
