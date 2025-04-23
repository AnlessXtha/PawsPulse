import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  BarChart3,
  Calendar,
  Syringe,
  Bell,
  MessageSquare,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/shadcn-components/ui/button";
import { SidebarContext } from "@/context/SidebarContext";
import { AuthContext } from "@/context/AuthContext";
import { handleLogout } from "@/lib/auth";

const VetSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/vet/dashboard" },
    { name: "Analytic Board", icon: BarChart3, path: "/vet/analytics" },
    { name: "Appointments", icon: Calendar, path: "/vet/appointments" },
    { name: "Reports", icon: FileText, path: "/vet/reports" },
    { name: "Vaccinations", icon: Syringe, path: "/vet/vaccinations" },
    { name: "Notifications", icon: Bell, path: "/vet/notifications" },
    { name: "Messages", icon: MessageSquare, path: "/vet/messages" },
    
  ];

  const logoutHandler = handleLogout(updateUser, navigate);

  return (
    <aside
      className={`min-h-screen bg-[#A63E4B] text-white flex flex-col justify-between transition-all duration-300 ${
        isSidebarOpen ? "w-64 p-4" : "w-16 py-4 px-2"
      } fixed top-0 left-0 z-10 `}
    >
      <div className={`${!isSidebarOpen && "flex flex-col items-center "} `}>
        <Button
          variant="ghost"
          className="mb-6 flex items-center hover:bg-[#8C323F] hover:text-white"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6 text-white" />
          {isSidebarOpen && (
            <span className="ml-3 text-2xl font-bold tracking-wide ">
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
                } ${isActive ? "bg-[#8C323F]" : "hover:bg-[#8C323F]"}`
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
          to="/vet/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full text-left ${
              isSidebarOpen ? "py-4 px-3" : "my-1 py-4 px-3.5"
            } rounded-lg ${isActive ? "bg-[#8C323F]" : "hover:bg-[#8C323F]"}`
          }
        >
          <User className="w-5 h-5" />
          {isSidebarOpen && "Profile"}
        </NavLink>
        <button
          onClick={logoutHandler}
          className={`flex items-center gap-3 w-full text-left ${
            isSidebarOpen ? "py-4 px-3" : "my-1 py-4 px-3.5"
          } rounded-lg hover:bg-[#8C323F] mt-2`}
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default VetSidebar;
