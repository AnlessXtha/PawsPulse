import React from "react";
import { Outlet } from "react-router-dom"; // Renders child routes
import { useContext } from "react";
import { SidebarContext } from "@/context/SidebarContext"; // Import the Sidebar Context
import Sidebar from "@/components/components/Sidebar";

const AdminLayout = () => {
  const { isSidebarOpen } = useContext(SidebarContext); // Access the sidebar state

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main
        className={`flex-1 p-6 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
