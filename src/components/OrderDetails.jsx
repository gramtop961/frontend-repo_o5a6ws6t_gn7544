import { Scan, Truck, XCircle, Plus, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function OrderDetails({ order, onBackToPending, onBackToPicked, onOpenScanner, onShip, onCancel, onAddItem }) {
  const [form, setForm] = useState({ name: '', sku: '', barcode: '', qty: 1 });

  const isFullyPacked = useMemo(
    () => order.items.every(it => it.scannedQty >= it.qty),
    [order.items]
  );

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Order {order.id}</h2>
            <p className="text-sm text-neutral-500">{order.customer} • {order.createdAt}</p>
          </div>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${badgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="divide-y">
          {order.items.map((it) => (
            <div key={it.sku} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-neutral-500">SKU: {it.sku} • Barcode: {it.barcode}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Qty: {it.scannedQty}/{it.qty}</div>
                <StatusPill matched={it.scannedQty >= it.qty} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t bg-neutral-50 px-4 py-3">
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-100"
          >
            <Scan size={16} /> Open Scanner
          </button>

          {order.status === 'Picker Packed' && (
            <button
              onClick={onShip}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm text-white hover:brightness-95"
            >
              <Truck size={16} /> Mark as Shipped
            </button>
          )}

          {(order.status === 'Pending' || order.status === 'Cancelled') && (
            <span className="text-sm text-neutral-500">Mark all items packed in the scanner to enable shipping.</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
          <div className="grid gap-2">
            <button onClick={onBackToPending} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Back to Pending</button>
            <button onClick={onBackToPicked} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Back to Picked</button>
            {order.status !== 'Cancelled' && (
              <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-rose-700 hover:bg-rose-50">
                <XCircle size={16} /> Cancel Order
              </button>
            )}
            {isFullyPacked && order.status === 'Pending' && (
              <div className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white">
                <CheckCircle2 size={16} /> All items packed — open scanner to set status
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Add Item</h3>
          <div className="grid gap-2">
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              />
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Barcode"
                value={form.barcode}
                onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
              />
            </div>
            <input
              type="number"
              min={1}
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Quantity"
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: Math.max(1, Number(e.target.value || 1)) }))}
            />
            <button
              onClick={() => {
                if (!form.name || !form.sku || !form.barcode || form.qty < 1) return;
                onAddItem({ ...form, scannedQty: 0 });
                setForm({ name: '', sku: '', barcode: '', qty: 1 });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <Plus size={16} /> Add to Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ matched }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
        matched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-700'
      }`}
    >
      {matched ? 'Matched' : 'Pending'}
    </span>
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
