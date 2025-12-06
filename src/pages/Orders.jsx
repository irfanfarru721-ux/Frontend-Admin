import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchOrders } from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchOrders();
        const data = res?.data ?? res;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        <div className="space-y-3">
          {orders.length === 0 && <div className="text-gray-500">No orders yet.</div>}
          {orders.map(o => (
            <div key={o._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Order #{o._id}</div>
                  <div className="text-sm text-gray-500">Status: {o.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{o.total}</div>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-3">
                {o.items?.map(it => (
                  <div key={it._id || it.productId} className="text-sm text-gray-700">
                    {it.product?.name || it.productId} × {it.quantity} — ₹{it.price}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
