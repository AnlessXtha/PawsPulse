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
import { useState, useEffect } from "react";
import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchVets, selectAllVets } from "@/redux/slices/vetSlice";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/schema/AppointmentSchema";
import { addAppointment } from "@/redux/slices/appointmentSlice";

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vets = useSelector(selectAllVets);

  const [isRecurring, setIsRecurring] = useState(false);
  const form = useForm({
    defaultValues: {
      reason: "",
      appointmentDate: null, // Initialize as null
      appointmentTime: "09:00", // Default time is 9 AM
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

  console.log("errors", errors);

  useEffect(() => {
    dispatch(fetchVets());
  }, []);

  const onAppointmentSubmit = (data) => {
    // Combine date and time into ISO string format
    const combinedDateTime = new Date(
      `${data.appointmentDate.toISOString().split("T")[0]}T${
        data.appointmentTime
      }:00.000Z`
    );

    console.log("Appointment Data:", data);
    console.log(
      "Combined Appointment Date and Time:",
      combinedDateTime.toISOString()
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
      reasonToVist: data.reason,
      vetId: data.vet,
      appointmentDate: combinedDateTime.toISOString(),
      petProfileId: "67bd8ba335413c8f09cf9243",
      durationMinutes: 60,
      recurring: data.recurring,
      recurrenceRule: data.recurringRule,
      recurringUntil,
    };

    dispatch(addAppointment(bookingData));

    // navigate("/appointments");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[1000px] bg-white p-8 rounded-lg shadow-md">
        {/* Updated Heading Size */}
        <h2 className="text-[28px] font-bold mb-6">Book an Appointment</h2>

        {/* Grid Layout for Form Fields and Calendar */}
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onAppointmentSubmit)}
            className="grid grid-cols-[2fr_1fr] gap-6"
          >
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">
                      Reason to Visit
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the reason..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name="vet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Select a Vet</FormLabel>
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

            {/* Right Column: Calendar and Time Picker */}
            <div className="flex flex-col justify-start space-y-4">
              {/* Calendar */}
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
                        onSelect={field.onChange}
                        minDate={new Date()}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Picker */}
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
                                value={`${hour.toString().padStart(2, "0")}:00`}
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
