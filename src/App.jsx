import { useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar.jsx';
import OrdersTable from './components/OrdersTable.jsx';
import OrderDetails from './components/OrderDetails.jsx';
import ScannerPanel from './components/ScannerPanel.jsx';

// Simple in-app data model for demo purposes
const initialOrders = [
  {
    id: 'ORD-1001',
    customer: 'Acme Corp',
    status: 'Pending',
    createdAt: '2025-11-03',
    items: [
      { sku: 'SKU-001', name: 'Blue Widget', barcode: 'BW-12345', qty: 2, scannedQty: 0 },
      { sku: 'SKU-002', name: 'Green Widget', barcode: 'GW-67890', qty: 1, scannedQty: 0 }
    ]
  },
  {
    id: 'ORD-1002',
    customer: 'Umbrella LLC',
    status: 'Pending',
    createdAt: '2025-11-03',
    items: [
      { sku: 'SKU-010', name: 'Red Gadget', barcode: 'RG-11111', qty: 3, scannedQty: 0 }
    ]
  },
  {
    id: 'ORD-1003',
    customer: 'Wayne Enterprises',
    status: 'Picker Packed',
    createdAt: '2025-11-02',
    items: [
      { sku: 'SKU-050', name: 'Utility Belt', barcode: 'UB-55555', qty: 1, scannedQty: 1 }
    ]
  }
];

export default function App() {
  const [orders, setOrders] = useState(initialOrders);
  const [view, setView] = useState('list'); // list | details | scan
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder = useMemo(
    () => orders.find(o => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const goToList = (filterTo = 'Pending') => {
    setView('list');
    setSelectedOrderId(null);
    setStatusFilter(filterTo);
  };

  const [statusFilter, setStatusFilter] = useState('Pending'); // Pending | Picker Packed | Shipped | Cancelled

  const updateOrder = (orderId, updater) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? updater(o) : o)));
  };

  const handleOpenDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setView('details');
  };

  const handleOpenScanner = (orderId) => {
    setSelectedOrderId(orderId);
    setView('scan');
  };

  const handleMarkAllPacked = (orderId) => {
    updateOrder(orderId, (o) => ({ ...o, status: 'Picker Packed' }));
    setView('details');
  };

  const handleShip = (orderId) => {
    updateOrder(orderId, (o) => ({ ...o, status: 'Shipped' }));
    setView('details');
  };

  const handleCancel = (orderId) => {
    updateOrder(orderId, (o) => ({ ...o, status: 'Cancelled' }));
    setView('details');
  };

  const handleAddItem = (orderId, newItem) => {
    updateOrder(orderId, (o) => ({ ...o, items: [...o.items, newItem] }));
  };

  const handleScanBarcode = (orderId, barcode) => {
    updateOrder(orderId, (o) => {
      const items = o.items.map(it => {
        if (it.barcode === barcode && it.scannedQty < it.qty) {
          return { ...it, scannedQty: it.scannedQty + 1 };
        }
        return it;
      });
      return { ...o, items };
    });
  };

  const ordersByFilter = useMemo(() => orders.filter(o => o.status === statusFilter), [orders, statusFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <HeaderBar
        view={view}
        onBack={() => (view === 'list' ? null : setView('list'))}
        statusFilter={statusFilter}
        onChangeFilter={setStatusFilter}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {view === 'list' && (
          <OrdersTable
            orders={ordersByFilter}
            statusFilter={statusFilter}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {view === 'details' && selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onBackToPending={() => goToList('Pending')}
            onBackToPicked={() => goToList('Picker Packed')}
            onOpenScanner={() => handleOpenScanner(selectedOrder.id)}
            onShip={() => handleShip(selectedOrder.id)}
            onCancel={() => handleCancel(selectedOrder.id)}
            onAddItem={(item) => handleAddItem(selectedOrder.id, item)}
          />
        )}

        {view === 'scan' && selectedOrder && (
          <ScannerPanel
            order={selectedOrder}
            onClose={() => setView('details')}
            onScan={(code) => handleScanBarcode(selectedOrder.id, code)}
            onMarkAllPacked={() => handleMarkAllPacked(selectedOrder.id)}
          />
        )}
      </main>
    </div>
  );
}
