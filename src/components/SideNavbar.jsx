import { NavLink } from "react-router-dom";


export default function SideNavbar() {
  return (
    <div
      className="d-flex flex-column  bg-white"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      {/* Logo Section */}
      <div className="py-4 text-center border-bottom">
        <img className=" rounded shadow"
          src="https://ik.imagekit.io/jamesdev0842/products/logo.png?updatedAt=1770042724215"
          alt="Brand Logo"
          style={{
            maxWidth: "140px",
            height: "auto",
          }}
        />
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column gap-1 p-3">
        <li className="nav-item">
          <NavLink to="/products" className="nav-link" >
            Products
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/categories" className="nav-link" >
            Categories
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/collections" className="nav-link">
            Collections
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
