import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  Users,
  Shield,
  Clipboard,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/shadcn-components/ui/button";
import { SidebarContext } from "@/context/SidebarContext";
import { AuthContext } from "@/context/AuthContext";
import { handleLogout } from "@/lib/auth";

const AdminSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Users", icon: Users, path: "/admin/userControl" },
    { name: "Vets", icon: Shield, path: "/admin/vetControl" },
    { name: "Pets", icon: Clipboard, path: "/admin/petControl" },
    { name: "Appointments", icon: Calendar, path: "/admin/appointmentControl" },
  ];

  const logoutHandler = handleLogout(updateUser, navigate);

  return (
    <aside
      className={`min-h-screen bg-gray-900 text-white  flex flex-col justify-between transition-all duration-300 ${
        isSidebarOpen ? "w-64 p-4" : "w-16 py-4 px-2"
      } fixed top-0 left-0 z-10 `}
    >
      <div className={`${!isSidebarOpen && "flex flex-col items-center"}`}>
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6 text-white" />
          {isSidebarOpen && (
            <span className="ml-3 text-2xl font-bold tracking-wide">
              PawsPulse
            </span>
          )}
        </Button>
        <nav>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full text-left rounded-lg ${
                  isSidebarOpen ? "py-4 px-3" : "my-1 py-4 px-3.5"
                } ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
              }
            >
              <item.icon className="w-5 h-5" />

              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full text-left ${
              isSidebarOpen ? "py-4 px-3" : "my-1 py-4 px-3.5"
            } rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <User className="w-5 h-5" />
          {isSidebarOpen && "Profile"}
        </NavLink>
        <button
          onClick={logoutHandler}
          className={`flex items-center gap-3 w-full text-left ${
            isSidebarOpen ? "py-4 px-3" : "my-1 py-4 px-3.5"
          } rounded-lg hover:bg-gray-800 mt-2`}
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
