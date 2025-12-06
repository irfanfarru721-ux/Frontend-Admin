import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchVendors, updateVendorStatus } from "../api/api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchVendors();
      const data = res?.data ?? res;
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateVendorStatus(id, status);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Vendors</h1>
        {loading && <div className="mb-3 text-sm text-gray-500">Loading...</div>}
        <div className="space-y-3">
          {vendors.map(v => (
            <div key={v._id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between">
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-sm text-gray-500">{v.email}</div>
                <div className="text-sm">Status: <span className="font-semibold">{v.status}</span></div>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2">
                {v.status !== "approved" && <button onClick={()=>changeStatus(v._id, "approved")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>}
                {v.status !== "rejected" && <button onClick={()=>changeStatus(v._id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
