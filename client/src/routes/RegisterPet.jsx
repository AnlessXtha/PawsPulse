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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import StepBar from "@/components/shared/StepBar";
import apiRequest from "@/lib/apiRequest";
import { petSchema } from "@/schema/RegisterOwnerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

const RegisterPet = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const userData = location.state?.userData || {};

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(petSchema),
    defaultValues: { petAvatar: undefined },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onRegister = async (data) => {
    // console.log(userData, "userData");
    // console.log("data", data);

    const finalRegisterData = {
      ...userData,
      petDetails: { ...data },
    };
    console.log("finalData", finalRegisterData);

    try {
      const res = await apiRequest.post("/auth/register", finalRegisterData);

      console.log("herrrrrrr", res.data);

      navigate("/login");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  console.log("errors", errors);

  const [avatar, setAvatar] = useState([]);
  useEffect(() => {
    if (avatar) {
      if (avatar.length > 1) {
        console.log("Removing first avatar:", avatar[0]);
        const updatedAvatars = avatar.slice(1);
        setAvatar(updatedAvatars);
        form.setValue("petAvatar", updatedAvatars[0] || "", {
          shouldValidate: true,
        });
      } else {
        form.setValue("petAvatar", avatar[0], { shouldValidate: true });
      }
    }
  }, [avatar, form.setValue, setAvatar]);

  console.log("avatar", avatar[0]);

  const dogBreeds = [
    { value: "labrador", label: "Labrador Retriever" },
    { value: "german_shepherd", label: "German Shepherd" },
    { value: "golden_retriever", label: "Golden Retriever" },
    { value: "bulldog", label: "Bulldog" },
    { value: "poodle", label: "Poodle" },
    { value: "beagle", label: "Beagle" },
    { value: "rottweiler", label: "Rottweiler" },
    { value: "yorkshire_terrier", label: "Yorkshire Terrier" },
    { value: "boxer", label: "Boxer" },
    { value: "dachshund", label: "Dachshund" },
  ];

  const catBreeds = [
    { value: "persian", label: "Persian" },
    { value: "maine_coon", label: "Maine Coon" },
    { value: "siamese", label: "Siamese" },
    { value: "bengal", label: "Bengal" },
    { value: "sphynx", label: "Sphynx" },
    { value: "ragdoll", label: "Ragdoll" },
    { value: "british_shorthair", label: "British Shorthair" },
    { value: "scottish_fold", label: "Scottish Fold" },
    { value: "devon_rex", label: "Devon Rex" },
    { value: "siberian", label: "Siberian" },
  ];

  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    // Update breed options when petType changes
    if (form.watch("petType") === "dog") {
      setBreeds(dogBreeds);
    } else if (form.watch("petType") === "cat") {
      setBreeds(catBreeds);
    } else {
      setBreeds([]); // Reset if no valid selection
    }
  }, [form.watch("petType")]);

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFE4E1] ">
      <div className="w-[auto] h-[auto] bg-white  flex rounded-lg shadow-lg">
        <div className="w-[600px] flex justify-center items-center bg-[#A63E4B]">
          {/* <img
              src="/path-to-your-image.jpg"
              alt="RegisterPet"
              className="w-full h-full object-cover rounded-lg"
            /> */}
        </div>
        <div className="w-[auto] flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-[#A63E4B] mb-6 flex justify-center">
            PawsPulse
          </h1>
          <p className="font-bold text-[18px]">Add your Pet's Profile</p>
          <p className="text-[#6C757D] text-[13px] mb-4">
            Now simply add the details of your lovely pet.
          </p>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onRegister)}
              className="grid grid-cols-2 gap-x-6 gap-y-2"
            >
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={"w-[290px]"}
                        placeholder="Pet Name"
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
                name="petType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[290px]">
                          <SelectValue placeholder="Species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="dog">Dog</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petBreed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={breeds.length === 0}
                      >
                        <SelectTrigger className="w-[290px]">
                          <SelectValue placeholder="Breed" />
                        </SelectTrigger>
                        <SelectContent>
                          {breeds.map((breed) => (
                            <SelectItem key={breed.value} value={breed.value}>
                              {breed.label}
                            </SelectItem>
                          ))}{" "}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petGender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[290px]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petAge"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="w-[290px]"
                        placeholder="Age"
                        type={"number"}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? "" : Number(val)); // Converts input to a number
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex col-span-2">
                <div className="w-[265px] mx-auto">
                  <StepBar
                    steps={["Your Details", "Pet Details"]}
                    current="Pet Details"
                  />
                </div>
                <div className="">
                  <Button
                    type="submit"
                    className="bg-[#A63E4B] text-white py-2 px-3 rounded-[3.2px]"
                  >
                    Save
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

export default RegisterPet;
