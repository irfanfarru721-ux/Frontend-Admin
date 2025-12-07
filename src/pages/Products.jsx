import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function VendorProducts() {
  const [modules, setModules] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [productsByCategory, setProductsByCategory] = useState([]);

  // Load modules
  useEffect(() => {
    API.get("/modules").then(res => setModules(res.data));
  }, []);

  // Load vendors when module changes
  useEffect(() => {
    if (!selectedModule) return setVendors([]);
    API.get("/vendors").then(res => {
      setVendors(res.data.filter(v => v.moduleId?._id === selectedModule));
    });
  }, [selectedModule]);

  // Load products when vendor changes
  useEffect(() => {
    if (!selectedVendor) return setProductsByCategory([]);
    API.get(`/products/by-vendor/${selectedVendor}`).then(res => {
      setProductsByCategory(res.data);
    });
  }, [selectedVendor]);

  return (
    <div style={{ padding: 12 }}>
      <h2>Products by Vendor & Category</h2>

      <div style={{ marginBottom: 12 }}>
        <select
          value={selectedModule}
          onChange={e => setSelectedModule(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="">Select Module</option>
          {modules.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <select
          value={selectedVendor}
          onChange={e => setSelectedVendor(e.target.value)}
        >
          <option value="">Select Vendor</option>
          {vendors.map(v => (
            <option key={v._id} value={v._id}>{v.name}</option>
          ))}
        </select>
      </div>

      {productsByCategory.map(({ category, products }) => (
        <div key={category._id} style={{ marginBottom: 20 }}>
          <h3>{category.name}</h3>
          {products.length === 0 && <p>No products in this category.</p>}
          <ul>
            {products.map(p => (
              <li key={p._id}>
                <strong>{p.name}</strong> - ${p.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
