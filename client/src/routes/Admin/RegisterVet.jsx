import React, { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { vetRegisterSchema } from "@/schema/RegisterVetSchema";
import { addVet, fetchVets } from "@/redux/slices/vetSlice";
import { useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";

const RegisterVet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      avatar: undefined,
    },
    resolver: zodResolver(vetRegisterSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  console.log(errors);

  const onRegister = async (data) => {
    const finalRegisterData = {
      ...data,
      userType: "vet",
      vetDetails: {
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
      },
    };

    console.log("Registering vet with data: ", finalRegisterData);

    try {
      const res = await dispatch(addVet(finalRegisterData));
      console.log("Vet registered successfully", res.data);

      if (!res.error) {
        form.setValue("firstName", "");
        form.setValue("lastName", "");
        form.setValue("username", "");
        form.setValue("email", "");
        form.setValue("contactNumber", "");
        form.setValue("password", "");
        form.setValue("specialization", "");
        form.setValue("licenseNumber", "");
        form.setValue("avatar", undefined);

        setAvatar([]);

        dispatch(fetchVets());
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to register vet");
    }
  };

  const [avatar, setAvatar] = useState([]);
  useEffect(() => {
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
    <div className="flex justify-center items-center h-full ">
      <div className="w-fit h-[auto] m-auto bg-white rounded-lg shadow-lg">
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

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="flex-1 min-w-full w-[290px]">
                          <SelectValue placeholder="Select Specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Practice Vet">
                            General Practice Vet
                          </SelectItem>
                          <SelectItem value="Dermatologist">
                            Dermatologist
                          </SelectItem>
                          <SelectItem value="Dentist (Veterinary Dentistry)">
                            Dentist (Veterinary Dentistry)
                          </SelectItem>
                          <SelectItem value="Orthopedic Surgeon">
                            Orthopedic Surgeon
                          </SelectItem>
                          <SelectItem value="Internal Medicine Specialist">
                            Internal Medicine Specialist
                          </SelectItem>
                          <SelectItem value="Neurologist">
                            Neurologist
                          </SelectItem>
                          <SelectItem value="Oncologist">Oncologist</SelectItem>
                          <SelectItem value="Cardiologist">
                            Cardiologist
                          </SelectItem>
                          <SelectItem value="Ophthalmologist">
                            Ophthalmologist
                          </SelectItem>
                          <SelectItem value="Emergency/Critical Care">
                            Emergency/Critical Care
                          </SelectItem>
                          <SelectItem value="Behaviorist">
                            Behaviorist
                          </SelectItem>
                          <SelectItem value="Nutritionist">
                            Nutritionist
                          </SelectItem>
                        </SelectContent>
                      </Select>
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

              <div className="col-span-2  flex flex-col items-center">
                {avatar[0] ? (
                  <>
                    <img
                      src={avatar[0] || "/noavatar.jpg"}
                      alt=""
                      className="avatar w-[600] h-[250px] "
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
                      customCss="border border-gray-300 rounded-md px-4 py-2  cursor-pointer mt-2"
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
                      customCss="border border-gray-300 rounded-md px-4 py-2 w-full h-[250px] cursor-pointer"
                      displayText="Click here to upload a certification"
                    />
                  </>
                )}

                {errors.avatar && form.formState.isSubmitted && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

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
    </div>
  );
};

export default RegisterVet;
