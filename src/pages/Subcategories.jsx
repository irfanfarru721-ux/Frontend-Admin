import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchCategories, fetchSubcategories, createSubcategory } from "../api/api";

export default function Subcategories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([fetchCategories(), fetchSubcategories()]);
      const c = cRes?.data ?? cRes;
      const s = sRes?.data ?? sRes;
      setCategories(Array.isArray(c) ? c : []);
      setSubcategories(Array.isArray(s) ? s : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !categoryId) return alert("Choose category and name");
    try {
      await createSubcategory({ name, categoryId });
      setName(""); setCategoryId("");
      load();
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Subcategories</h1>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="px-3 py-2 border rounded">
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Subcategory name" className="px-3 py-2 border rounded" />
          <button onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>

        <div className="grid gap-3">
          {subcategories.map(s => (
            <div key={s._id} className="bg-white p-3 rounded shadow">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-500">Category: {s.categoryId?.name || "—"}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
