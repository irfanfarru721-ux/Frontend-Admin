import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div style={{display:'flex'}}>
      <div className="sidebar">
        <h2 style={{marginTop:0}}>Admin</h2>
        <nav>
          <Link className='nav-link' to="/admin/dashboard">Dashboard</Link>
          <Link className='nav-link' to="/admin/modules">Modules</Link>
          <Link className='nav-link' to="/admin/vendors">Vendors</Link>
          <Link className='nav-link' to="/admin/categories">Categories</Link>
          <Link className='nav-link' to="/admin/products">Products</Link>
          <div style={{marginTop:16}}>
            <button className='btn' onClick={logout}>Logout</button>
          </div>
        </nav>
      </div>

      <div className="main">
        <div className="header">Admin Panel</div>
        <Outlet />
      </div>
    </div>
  );
}
