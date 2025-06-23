"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, [session]);

  const handleConfirm = async (orderId) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: "confirmed" }),
    });
    if (res.ok) {
      Swal.fire("Sukses", "Pesanan dikonfirmasi!", "success");
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: "confirmed" } : o));
    }
  };

  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center">Akses admin saja</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl mt-6 border border-blue-100">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        Daftar Pesanan
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState message="Belum ada pesanan." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-blue-100">
            <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-blue-700">User</th>
                <th className="py-3 px-4 text-left font-bold text-blue-700">Produk</th>
                <th className="py-3 px-4 text-left font-bold text-blue-700">Metode</th>
                <th className="py-3 px-4 text-left font-bold text-blue-700">Status</th>
                <th className="py-3 px-4 text-left font-bold text-blue-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                  <td className="py-2 px-4">{order.user?.email}</td>
                  <td className="py-2 px-4">
                    {order.items.map((item, idx) => (
                      <div key={idx}>{item.product?.name} x{item.quantity}</div>
                    ))}
                  </td>
                  <td className="py-2 px-4">{order.paymentMethod}</td>
                  <td className="py-2 px-4">
                    {order.status === 'pending' && <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>}
                    {order.status === 'confirmed' && <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Confirmed</span>}
                    {order.status === 'paid' && <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Paid</span>}
                    {order.status === 'cancelled' && <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Cancelled</span>}
                  </td>
                  <td className="py-2 px-4">
                    {order.status === "pending" && (
                      <button
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow hover:from-blue-500 hover:to-green-400 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-green-300 animate-bounce-slow"
                        onClick={() => handleConfirm(order._id)}
                      >
                        Konfirmasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
