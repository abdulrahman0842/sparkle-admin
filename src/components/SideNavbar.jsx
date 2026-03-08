import { NavLink } from "react-router-dom";
import { logout } from '../services/AuthService';

export default function SideNavbar() {

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
  };

  return (
    <div
      className="d-flex flex-column bg-white border-end shadow-sm"
      style={{ width: "260px", height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo Section */}
      <div className="py-4 text-center border-bottom mb-2">
        <img 
          className="rounded shadow-sm"
          src="https://ik.imagekit.io/jamesdev0842/products/logo.png?updatedAt=1770042724215"
          alt="Brand Logo"
          style={{
            maxWidth: "120px",
            height: "auto",
          }}
        />
      </div>

      {/* Navigation - flex-grow-1 pushes everything below it to the bottom */}
      <div className="flex-grow-1 px-3">
        <ul className="nav nav-pills flex-column gap-2 mt-3">
          <li className="nav-item">
            <NavLink 
              to="/products" 
              className={({ isActive }) => `nav-link py-2 px-3 ${isActive ? 'active bg-primary' : 'text-dark'}`}
            >
              <span className="me-2">📦</span> Products
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/categories" 
              className={({ isActive }) => `nav-link py-2 px-3 ${isActive ? 'active bg-primary' : 'text-dark'}`}
            >
              <span className="me-2">🗂️</span> Categories
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/collections" 
              className={({ isActive }) => `nav-link py-2 px-3 ${isActive ? 'active bg-primary' : 'text-dark'}`}
            >
              <span className="me-2">💎</span> Collections
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Bottom Section (Logout) */}
      <div className="p-3 border-top mt-auto">
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <small>🚪</small>
        </button>
      </div>
    </div>
  );
}