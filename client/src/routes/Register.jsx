import { Button } from "@/components/shadcn-components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import StepBar from "@/components/shared/StepBar";
import { createApiClient } from "@/lib/createApiClient";
import { showToast } from "@/lib/toastUtils";
import { userSchema } from "@/schema/RegisterOwnerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const form = useForm({
    defaultValues: {
      userType: "owner",
    },
    mode: "onTouched",
    resolver: zodResolver(userSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  // console.log("errors", errors);

  const onNext = async (data) => {
    const api = createApiClient("http://localhost:8805/api/");
    try {
      const response = await api.post("/auth/validate-user", {
        username: data.username,
        email: data.email,
        contactNumber: data.contactNumber,
        licenseNumber: null, // if needed for vet validation later
      });

      console.log("Validation response: ", response.data);

      // Proceed only if validation is successful
      navigate("/register/pet", { state: { userData: data } });
    } catch (error) {
      const errMsg = error.response?.data?.message || "Validation failed.";
      showToast("Validation error ", errMsg, "error");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen bg-[#FFE4E1] ">
      <div className="w-[auto] h-[auto] bg-white  flex rounded-lg shadow-lg">
        <div className="w-[600px] flex justify-center items-center bg-[#A63E4B]">
          {/* <img
            src="/path-to-your-image.jpg"
            alt="Register"
            className="w-full h-full object-cover rounded-lg"
          /> */}
        </div>
        <div className="w-[auto] flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-[#A63E4B] mb-6 flex justify-center">
            PawsPulse
          </h1>
          <p className="font-bold text-[18px]">Create an Account!</p>
          <p className="text-[#6C757D] text-[13px] mb-4">
            Don't have an account? Create your own account!
          </p>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onNext)}
              className="grid grid-cols-2 gap-x-6 gap-y-2"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={"w-[290px]"}
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Contact Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={"col-span-2 "}>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className={"min-h-0"}>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="h-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className={"min-h-0"}>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-Type Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link to="/login">
                <p className="mb-[15px]">
                  Already have an account?{" "}
                  <span className="font-bold">Sign In</span>
                </p>
              </Link>

              <div className="flex col-span-2">
                <div className="w-[265px] mx-auto">
                  <StepBar
                    steps={["Your Details", "Pet Profile"]}
                    current="Your Details"
                  />
                </div>
                <div className="">
                  <Button
                    type="submit"
                    className="bg-[#A63E4B] text-white py-2 px-3 rounded-[3.2px]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
