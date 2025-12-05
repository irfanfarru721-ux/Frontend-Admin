import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Vendors from "./pages/Vendors";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Products from "./pages/Products";

// simple auth check for admin token
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/admin/login" />;
};

// temporary global error alert (helps mobile debugging)
window.onerror = function (msg, url, line, col, error) {
  try { alert("ERROR: " + msg + "\nAt line: " + line); } catch(e){}
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="modules" element={<Modules />} />
          <Route path="vendors" element={<Vendors />} />
       <Route path="subcategories" element={<Subcategories />} />
         <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
        </Route>

        <Route path="*" element={<Navigate to='/admin/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
