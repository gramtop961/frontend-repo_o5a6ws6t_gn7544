import { ArrowRight } from 'lucide-react';

export default function OrdersTable({ orders, statusFilter, onOpenDetails }) {
  return (
    <section className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-base font-semibold">{statusFilter} Orders</h2>
          <p className="text-sm text-neutral-500">Manage orders and view details</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
          {orders.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-neutral-600">
              <th className="w-32 px-4 py-2">Order #</th>
              <th className="px-4 py-2">Customer</th>
              <th className="w-40 px-4 py-2">Status</th>
              <th className="w-40 px-4 py-2">Created</th>
              <th className="w-24 px-4 py-2 text-right">Items</th>
              <th className="w-28 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No orders found for this status.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${badgeClass(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">{o.createdAt}</td>
                <td className="px-4 py-3 text-right">{o.items.reduce((a, b) => a + b.qty, 0)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onOpenDetails(o.id)}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    Details <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function badgeClass(status) {
  switch (status) {
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Picker Packed':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Shipped':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}
