import React, { useEffect, useState } from "react";
import { fetchSubcategories, createSubcategoryAPI, updateSubcategoryAPI, deleteSubcategoryAPI, fetchCategories, fetchModules } from "../api";

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [form, setForm] = useState({ name: "", categoryId: "", moduleId: "", status: "active" });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const subs = await fetchSubcategories();
        const cats = await fetchCategories();
        const mods = await fetchModules();
        setSubcategories(subs);
        setCategories(cats);
        setModules(mods);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Open modal for add or edit
  const openModal = (sub = null) => {
    if (sub) {
      setEditingSub(sub);
      setForm({
        name: sub.name,
        categoryId: sub.categoryId?._id || "",
        moduleId: sub.moduleId?._id || "",
        status: sub.status,
      });
    } else {
      setEditingSub(null);
      setForm({ name: "", categoryId: "", moduleId: "", status: "active" });
    }
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingSub) {
        await updateSubcategoryAPI(editingSub._id, form);
      } else {
        await createSubcategoryAPI(form, localStorage.getItem("admin_token"));
      }
      const subs = await fetchSubcategories();
      setSubcategories(subs);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await deleteSubcategoryAPI(id, localStorage.getItem("admin_token"));
      setSubcategories(subcategories.filter((sub) => sub._id !== id));
    }
  };

  if (loading) return <p>Loading subcategories...</p>;

  return (
    <div>
      <h1>Subcategories</h1>
      <button onClick={() => openModal()}>Add Subcategory</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Module</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>{sub.categoryId?.name}</td>
              <td>{sub.moduleId?.name}</td>
              <td>{sub.status}</td>
              <td>
                <button onClick={() => openModal(sub)}>Edit</button>
                <button onClick={() => handleDelete(sub._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <h2>{editingSub ? "Edit" : "Add"} Subcategory</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <select name="moduleId" value={form.moduleId} onChange={handleChange}>
            <option value="">Select Module</option>
            {modules.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={handleSubmit}>{editingSub ? "Update" : "Create"}</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
