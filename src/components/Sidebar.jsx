import { NavLink } from "react-router-dom";
import React from "react";

const Sidebar = () => {

  const linkStyle =
    "block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition";

  const activeStyle = "bg-gray-800 text-white";

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5">

      <h1 className="text-2xl font-bold mb-8">
        RealEstate Admin
      </h1>

      <nav className="space-y-2">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/add-property"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Add Property
        </NavLink>

        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Properties
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Users
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
