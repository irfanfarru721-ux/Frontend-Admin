import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchProducts, fetchSubcategories, createProduct } from "../api/api";

export default function Products() {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", subcategoryId: "", stock: 0 });

  const load = async () => {
    try {
      const [sRes, pRes] = await Promise.all([fetchSubcategories(), fetchProducts()]);
      const s = sRes?.data ?? sRes;
      const p = pRes?.data ?? pRes;
      setSubcategories(Array.isArray(s) ? s : []);
      setProducts(Array.isArray(p) ? p : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.subcategoryId) return alert("Name and subcategory required");
    try {
      await createProduct(form);
      setForm({ name: "", price: "", description: "", subcategoryId: "", stock: 0 });
      load();
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select value={form.subcategoryId} onChange={e=>setForm({...form, subcategoryId: e.target.value})} className="px-3 py-2 border rounded">
            <option value="">Select subcategory</option>
            {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>

          <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Product name" className="px-3 py-2 border rounded" />
          <input value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="Price" className="px-3 py-2 border rounded" />
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} placeholder="Stock" className="px-3 py-2 border rounded" />
          <input value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Short description" className="px-3 py-2 border rounded" />
        </div>

        <div className="mb-6">
          <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded">Add Product</button>
        </div>

        <div className="grid gap-3">
          {products.map(p => (
            <div key={p._id} className="bg-white p-3 rounded shadow">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">Price: ₹{p.price} • Stock: {p.stock}</div>
              <div className="text-sm text-gray-500">Subcategory: {p.subcategoryId?.name || "—"}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
