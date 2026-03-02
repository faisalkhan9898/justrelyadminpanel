import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen">

        {/* Mobile header bar with hamburger */}
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center bg-gray-900 text-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl mr-3 cursor-pointer"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="text-lg font-semibold">RealEstate Admin</span>
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Right Side Content */}
        <div className="w-full min-h-screen bg-gray-100 p-4 pt-16 sm:p-6 sm:pt-16 lg:ml-64 lg:pt-6">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AdminLayout
