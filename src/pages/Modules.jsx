import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchModules, createModule } from "../api/api";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchModules();
      const data = res?.data ?? res;
      setModules(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    try {
      await createModule({ name });
      setName("");
      load();
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Modules</h1>

        <div className="mb-4 flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Module name" className="px-3 py-2 border rounded flex-1" />
          <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
        </div>

        <div className="grid gap-3">
          {modules.map(m => <div key={m._id} className="bg-white p-3 rounded shadow">{m.name}</div>)}
        </div>
      </main>
    </div>
  );
}
