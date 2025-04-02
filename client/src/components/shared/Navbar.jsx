// import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/shadcn-components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import apiRequest from "@/lib/apiRequest";
import { handleLogout } from "@/lib/auth";
import { Mail, Phone } from "lucide-react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  //   const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  // const handleLogout = async () => {
  //   try {
  //     await apiRequest.post("/auth/logout");
  //     updateUser(null);
  //     navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const logoutHandler = handleLogout(updateUser, navigate);

  return (
    <>
      {!currentUser && (
        <div className="flex justify-left items-center align-middle py-4 px-24 bg-[#F3F4F6] text-[#A63E4B] ">
          <div className="flex gap-4 items-center">
            <Phone size={32} />
            <p className="font-medium text-[18px] border-r-4 border-red-200 pr-10">
              123-456-7890
            </p>
          </div>
          <div className="flex gap-4 items-center pl-10">
            <Mail size={32} />
            <p className="font-medium text-[18px]">paws.pulse@office.com</p>
          </div>
          {/* </div> */}
        </div>
      )}

      <nav className="flex justify-between items-center py-6 px-14 bg-[#A63E4B] text-primary-foreground">
        <h1 className="font-semibold text-[24px]">PawsPulse</h1>
        <div className="flex gap-15 items-center">
          <ul className="flex gap-15 list-none text-[18px]">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "font-bold" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "font-bold" : "")}
              >
                Our Services
              </NavLink>
            </li>

            {currentUser?.userType === "owner" && (
              <>
                <li>
                  <NavLink
                    to="/bookAppointment"
                    className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                    Book Appointment
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          {currentUser ? (
            <>
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
              <Button
                className="cursor-pointer text-[18px] rounded-4xl bg-[#F3F4F6] text-[#A63E4B] py-7 px-10 duration-400 hover:bg-[#E5E7EB] hover:text-[#8F2E3B]"
                onClick={logoutHandler}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="cursor-pointer text-[18px] rounded-4xl bg-[#F3F4F6] text-[#A63E4B] py-7 px-10 duration-400 hover:bg-[#E5E7EB] hover:text-[#8F2E3B]"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="cursor-pointer text-[18px] rounded-4xl bg-[#F3F4F6] text-[#A63E4B] py-7 px-10 duration-400 hover:bg-[#E5E7EB] hover:text-[#8F2E3B]"
                onClick={() => navigate("/register")}
              >
                Regsiter
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
