import { Button } from "@/components/shadcn-components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import apiRequest from "@/lib/apiRequest";
import { loginSchema } from "@/schema/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cat, Dog } from "lucide-react";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const login = async (data) => {
    console.log(data);
    try {
      const res = await apiRequest.post("/auth/login", data);

      updateUser(res.data?.userInfo);

      // console.log(currentUser, "currentUser");

      // // Extract user role
      // const userType = currentUser?.userType;
      // console.log(userType, "userType");

      // // Navigate based on role
      // if (userType === "owner") {
      //   navigate("/");
      // } else if (userType === "vet") {
      //   navigate("/vetDashboard");
      // } else if (userType === "admin") {
      //   navigate("/adminDashboard");
      // } else {
      //   navigate("/"); // Default fallback route
      // }
    } catch (err) {
      console.log(err.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (!currentUser) return; // Prevent running on mount

    console.log(currentUser, "currentUser");

    const userType = currentUser?.userType;
    console.log(userType, "userType");

    if (userType === "owner") {
      navigate("/about");
    } else if (userType === "vet") {
      navigate("/vet/dashboard");
    } else if (userType === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }, [currentUser]);

  const { handleSubmit } = form;

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFE4E1] ">
      <div className="w-[500px] h-[auto] bg-white py-10 px-12 rounded-[4px]">
        <div className="flex justify-center items-center">
          <h1 className="mb-8 text-[#495057] text-[33px] font-bold">
            PawsPulse
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-bold text-[18px] ">Welcome Back!</p>
            <p className="text-[#6C757D] text-[13px] ">
              Enter your username and password to ensure your pet gets the best
              care possible!
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(login)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[#A63E4B] text-white p-2 rounded-[3.2px]"
              >
                Log in
              </Button>
            </form>
          </Form>

          <div className="flex flex-col items-center text-[13px] text-[#6C757D]">
            <Link to="/">Forget your password?</Link>
            <Link to="/register">
              <p className="mt-[10px] mb-[15px]">
                Don't have an account?{" "}
                <span className="font-bold">Sign Up</span>
              </p>
            </Link>
            <div className="pet-icons flex gap-4">
              <Cat size={32} />
              <Dog size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
