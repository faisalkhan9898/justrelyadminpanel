import { NavLink } from "react-router-dom";
import React from "react";

const Sidebar = ({ isOpen, onClose }) => {

  const linkStyle =
    "block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition";

  const activeStyle = "bg-gray-800 text-white";

  return (
    <>
      {/* Overlay — covers the page behind the sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed left-0 top-0 h-screen bg-gray-900 text-white p-5 z-50
          w-64 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
          aria-label="Close sidebar"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-8">
          RealEstate Admin
        </h1>

        <nav className="space-y-2">

          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/add-property"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            Add Property
          </NavLink>

          <NavLink
            to="/properties"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            Properties
          </NavLink>

          <NavLink
            to="/users"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            Users
          </NavLink>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;
