import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchModules, fetchCategories, createCategory } from "../api/api";

export default function Categories() {
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [mRes, cRes] = await Promise.all([fetchModules(), fetchCategories()]);
      const m = mRes?.data ?? mRes;
      const c = cRes?.data ?? cRes;
      setModules(Array.isArray(m) ? m : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !moduleId) return alert("Select module and name");
    try {
      await createCategory({ name, moduleId });
      setName("");
      setModuleId("");
      load();
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Categories</h1>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select value={moduleId} onChange={e=>setModuleId(e.target.value)} className="px-3 py-2 border rounded">
            <option value="">Select module</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" className="px-3 py-2 border rounded" />
          <button onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>

        <div className="grid gap-3">
          {categories.map(c => (
            <div key={c._id} className="bg-white p-3 rounded shadow">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">Module: {c.moduleId?.name || "—"}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
