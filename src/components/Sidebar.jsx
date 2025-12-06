import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">HoneyAdmin</h1>

      <nav className="flex flex-col gap-3">
        <Link to="/">Dashboard</Link>
        <Link to="/vendors">Vendors</Link>
        <Link to="/modules">Modules</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/subcategories">Subcategories</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
      </nav>
    </div>
  );
}
