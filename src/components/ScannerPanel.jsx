import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Scan, X } from 'lucide-react';

export default function ScannerPanel({ order, onClose, onScan, onMarkAllPacked }) {
  const inputRef = useRef(null);
  const [lastScanned, setLastScanned] = useState('');
  const [feedback, setFeedback] = useState(null); // 'success' | 'error' | null

  const allMatched = useMemo(
    () => order.items.length > 0 && order.items.every(it => it.scannedQty >= it.qty),
    [order.items]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = inputRef.current?.value?.trim();
    if (!code) return;

    const match = order.items.find(it => it.barcode === code && it.scannedQty < it.qty);
    setLastScanned(code);

    if (match) {
      onScan(code);
      setFeedback('success');
    } else {
      setFeedback('error');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <section className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-base font-semibold">Scan Items for {order.id}</h2>
          <p className="text-sm text-neutral-500">Scan barcodes to verify and pack</p>
        </div>
        <button onClick={onClose} className="rounded-md border px-2 py-1.5 text-sm hover:bg-neutral-50">
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-6 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
            <div className={`flex grow items-center gap-2 rounded-md border px-3 py-2 ${
              feedback === 'success' ? 'border-emerald-600 ring-2 ring-emerald-100' : feedback === 'error' ? 'border-rose-600 ring-2 ring-rose-100' : ''
            }`}>
              <Scan size={18} className="text-neutral-500" />
              <input
                ref={inputRef}
                autoFocus
                placeholder="Scan or type barcode and press Enter"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <button type="submit" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Submit</button>
          </form>

          {lastScanned && (
            <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${
              feedback === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}>
              Last scanned: {lastScanned} {feedback === 'success' ? '✓ matched' : '✕ not found or already fulfilled'}
            </div>
          )}

          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-2 bg-neutral-50 p-3 text-xs font-medium text-neutral-600">
              <div className="col-span-4">Product</div>
              <div className="col-span-3">SKU</div>
              <div className="col-span-3">Barcode</div>
              <div className="col-span-2 text-right">Qty</div>
            </div>
            <div className="divide-y">
              {order.items.map((it) => (
                <div key={it.sku} className={`grid grid-cols-12 items-center gap-2 p-3 text-sm ${
                  it.scannedQty >= it.qty ? 'bg-emerald-50/60' : ''
                }`}>
                  <div className="col-span-4">
                    <div className="font-medium">{it.name}</div>
                  </div>
                  <div className="col-span-3 text-neutral-600">{it.sku}</div>
                  <div className="col-span-3 text-neutral-600">{it.barcode}</div>
                  <div className="col-span-2 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      it.scannedQty >= it.qty ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {it.scannedQty}/{it.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold">Progress</h3>
            <ProgressBar items={order.items} />
            <p className="mt-2 text-xs text-neutral-500">Items will turn green when fully matched.</p>
          </div>

          <button
            disabled={!allMatched}
            onClick={onMarkAllPacked}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ${
              allMatched ? 'border border-blue-600 bg-blue-600 text-white hover:brightness-95' : 'border text-neutral-500 opacity-60'
            }`}
          >
            <CheckCircle2 size={16} /> Mark All Packed
          </button>
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ items }) {
  const total = items.reduce((acc, it) => acc + it.qty, 0);
  const done = items.reduce((acc, it) => acc + Math.min(it.qty, it.scannedQty), 0);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-right text-xs text-neutral-600">{pct}%</div>
    </div>
  );
}
