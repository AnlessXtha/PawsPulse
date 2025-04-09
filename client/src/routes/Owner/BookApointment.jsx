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
import { Checkbox } from "@/components/shadcn-components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchVets, selectAllVets } from "@/redux/slices/vetSlice";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/schema/AppointmentSchema";
import { addAppointment } from "@/redux/slices/appointmentSlice";
import { AuthContext } from "@/context/AuthContext";
import {
  fetchSinglePetByUserId,
  getSinglePetByUserId,
} from "@/redux/slices/petSlice";

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vets = useSelector(selectAllVets);

  const pet = useSelector(getSinglePetByUserId);

  console.log(pet, "Pet Data");

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser, "Current User");

  const [isRecurring, setIsRecurring] = useState(false);
  const form = useForm({
    defaultValues: {
      reason: "",
      appointmentDate: null,
      appointmentTime: "09:00",
      recurring: false,
      recurringRule: "",
      recurringUntil: "",
      vet: "",
    },
    mode: "onTouched",
    resolver: zodResolver(appointmentSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  // console.log("errors", errors);

  useEffect(() => {
    dispatch(fetchVets());
  }, []);

  const onAppointmentSubmit = (data) => {
    dispatch(fetchSinglePetByUserId(currentUser.id));

    const combinedDateTime = new Date(
      `${data.appointmentDate.toISOString().split("T")[0]}T${
        data.appointmentTime
      }:00.000Z`
    );

    let recurringUntil;
    if (data.recurring) {
      switch (data.recurringUntil) {
        case "month":
          recurringUntil = new Date(combinedDateTime);
          recurringUntil.setMonth(recurringUntil.getMonth() + 1);
          break;
        case "year":
          recurringUntil = new Date(combinedDateTime);
          recurringUntil.setFullYear(recurringUntil.getFullYear() + 1);
          break;
        default:
          recurringUntil = null;
          break;
      }
    }

    const bookingData = {
      reasonToVisit: data.reason,
      vetId: data.vet,
      appointmentDate: combinedDateTime,
      petProfileId: pet.id,
      durationMinutes: 60,
      recurring: data.recurring,
      recurrenceRule: data.recurringRule,
      recurringUntil,
    };

    console.log(bookingData, "Booking Data");

    dispatch(addAppointment(bookingData));

    // navigate("/appointments");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[1000px] bg-white p-8 rounded-lg shadow-md ">
        <h2 className="text-[28px] font-bold mb-6">Book an Appointment</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onAppointmentSubmit)}>
            <div className="flex gap-6 mb-6">
              <div className="flex-1 space-y-6">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Reason to Visit
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe the reason..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Select a Vet
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {vets.map((vet) => (
                              <SelectItem key={vet.id} value={vet.id}>
                                Dr. {vet.firstName} {vet.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 flex flex-col justify-start space-y-4">
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Appointment Date
                      </FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const utcDate = new Date(
                                Date.UTC(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate()
                                )
                              );
                              field.onChange(utcDate);
                            }
                          }}
                          disabled={(date) =>
                            date <
                            new Date(new Date().setDate(new Date().getDate()))
                          }
                          className="w-full border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Appointment Time
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const hour = i + 9; // Start at 9 AM
                              return (
                                <SelectItem
                                  key={hour}
                                  value={`${hour
                                    .toString()
                                    .padStart(2, "0")}:00`}
                                >
                                  {`${hour}:00`}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="bg-red-100" />

            <div className="grid gap-4 mt-6">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="recurring"
                  render={({ field }) => (
                    <FormItem className={"flex items-center justify-between"}>
                      <FormLabel className="text-[18px]">
                        Make it Recurring?
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={isRecurring}
                          onCheckedChange={(checked) => {
                            setIsRecurring(checked);
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Recurring Rule
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annually">Annually</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="bimonthly">
                              Bi-Monthly
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Recurring Until
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">For a Month</SelectItem>
                            <SelectItem value="year">For a Year</SelectItem>
                            <SelectItem value="date">Pick a Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white">
                Book
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookAppointment;
