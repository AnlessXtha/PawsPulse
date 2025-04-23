import React, { useState } from "react";
import UploadWidget from "@/components/components/UploadWidget.jsx/UploadWidget";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import apiRequest from "@/lib/apiRequest";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const RegisterVet = () => {
  const navigate = useNavigate();

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      avatar: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onRegister = async (data) => {
    const finalRegisterData = {
      ...data,
      userType: "vet",
      vetDetails: {
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
      },
    };

    try {
      const res = await apiRequest.post("/auth/register", finalRegisterData);
      console.log("Vet registered successfully", res.data);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to register vet");
    }
  };

  const [avatar, setAvatar] = useState([]);
  React.useEffect(() => {
    if (avatar) {
      if (avatar.length > 1) {
        const updatedAvatars = avatar.slice(1);
        setAvatar(updatedAvatars);
        form.setValue("avatar", updatedAvatars[0] || "", {
          shouldValidate: true,
        });
      } else {
        form.setValue("avatar", avatar[0], { shouldValidate: true });
      }
    }
  }, [avatar, form.setValue, setAvatar]);

  return (
    <>
      <div className="w-fit h-[auto] mx-auto bg-white  rounded-lg shadow-lg">
        <div className="w-fit flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-[#121827] mb-6 flex justify-center">
            PawsPulse
          </h1>
          <p className="font-bold text-[18px]">Register a Vet</p>
          <p className="text-[#6C757D] text-[13px] mb-4">
            Add the details of the vet below.
          </p>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onRegister)}
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
                      <Input
                        className={"w-[290px]"}
                        placeholder="Last Name"
                        {...field}
                      />
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
                      <Input
                        className={"w-[290px]"}
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={"w-[290px]"}
                        placeholder="Email"
                        type="email"
                        {...field}
                      />
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
                      <Input
                        className={"w-[290px]"}
                        placeholder="Contact Number"
                        type="tel"
                        {...field}
                      />
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
                        className={"w-[290px]"}
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="row-span-3 flex flex-col items-center">
                {avatar[0] ? (
                  <>
                    <img
                      src={avatar[0] || "/noavatar.jpg"}
                      alt=""
                      className="avatar w-[158px] h-[162px]"
                    />
                    <UploadWidget
                      uwConfig={{
                        cloudName: "anless",
                        uploadPreset: "estate",
                        multiple: false,
                        maxImageFileSize: 2000000,
                        folder: "avatars",
                      }}
                      setState={setAvatar}
                      customCss="border border-gray-300 rounded-md px-4 py-2 cursor-pointer mt-2"
                      displayText="Change Picture"
                    />
                  </>
                ) : (
                  <>
                    <UploadWidget
                      uwConfig={{
                        cloudName: "anless",
                        uploadPreset: "estate",
                        multiple: false,
                        maxImageFileSize: 2000000,
                        folder: "avatars",
                      }}
                      setState={setAvatar}
                      customCss="border border-gray-300 rounded-md px-4 py-2 w-[158px] h-[162px] cursor-pointer"
                      displayText="Click here to upload a photo"
                    />
                  </>
                )}

                {errors.avatar && form.formState.isSubmitted && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={"w-[290px]"}
                        placeholder="Specialization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={"w-[290px]"}
                        placeholder="License Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex col-span-2 justify-end">
                <Button
                  type="submit"
                  className="bg-[#121827] text-white py-2 px-3 rounded-[3.2px]"
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegisterVet;
