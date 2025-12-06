import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchVendors, fetchModules, fetchCategories, fetchProducts } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ vendors: 0, modules: 0, categories: 0, products: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, mRes, cRes, pRes] = await Promise.all([fetchVendors(), fetchModules(), fetchCategories(), fetchProducts()]);
        const v = vRes?.data ?? vRes;
        const m = mRes?.data ?? mRes;
        const c = cRes?.data ?? cRes;
        const p = pRes?.data ?? pRes;
        setStats({ vendors: Array.isArray(v)?v.length:0, modules: Array.isArray(m)?m.length:0, categories: Array.isArray(c)?c.length:0, products: Array.isArray(p)?p.length:0 });
      } catch (err) {
        // ignore for dashboard
      }
    };
    load();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Vendors</div>
            <div className="text-2xl font-bold">{stats.vendors}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Modules</div>
            <div className="text-2xl font-bold">{stats.modules}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Products</div>
            <div className="text-2xl font-bold">{stats.products}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
