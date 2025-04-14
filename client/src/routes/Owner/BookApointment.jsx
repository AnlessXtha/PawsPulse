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
import {
  addAppointment,
  fetchVetAppointmentsSchedule,
  getVetAppointmentsSchedule,
} from "@/redux/slices/appointmentSlice";
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

  const vetsSchedule = useSelector(getVetAppointmentsSchedule);

  console.log(vetsSchedule, "vetsSchedule  ");

  const { currentUser } = useContext(AuthContext);

  const times = [
    { value: "09:00", text: "09:00 am" },
    { value: "10:00", text: "10:00 am" },
    { value: "11:00", text: "11:00 am" },
    { value: "12:00", text: "12:00 pm" },
    { value: "13:00", text: "01:00 pm" },
    { value: "14:00", text: "02:00 pm" },
    { value: "15:00", text: "03:00 pm" },
    { value: "16:00", text: "04:00 pm" },
    { value: "17:00", text: "05:00 pm" },
  ];

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
    dispatch(fetchSinglePetByUserId(currentUser.id));
  }, [currentUser, dispatch]);

  const onAppointmentSubmit = (data) => {
    // console.log(data, "Form Data");

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
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            dispatch(
                              fetchVetAppointmentsSchedule({ id: value })
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {vets.map((vet) => (
                              <SelectItem
                                key={vet?.vet?.id}
                                value={vet?.vet?.id}
                              >
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
                  render={({ field }) => {
                    const selectedVetId = form.watch("vet");

                    // Dates that have at least one booked time
                    const bookedDates = vetsSchedule.map(
                      (appt) => appt.appointmentDate
                    );

                    return (
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
                            disabled={[
                              {
                                before: new Date(
                                  new Date().setDate(new Date().getDate() + 1)
                                ),
                              },
                              !selectedVetId && {
                                from: new Date(2000, 0, 1),
                                to: new Date(2100, 11, 31),
                              },
                              // Disable dates that have all 9 slots booked
                              (date) => {
                                const formatted = date
                                  .toISOString()
                                  .split("T")[0];
                                const bookedTimes = vetsSchedule.filter(
                                  (appt) => appt.appointmentDate === formatted
                                );
                                return bookedTimes.length >= 9; // all time slots taken
                              },
                            ].filter(Boolean)}
                            className="w-full border border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => {
                    const selectedDate = form.watch("appointmentDate");
                    const selectedDateFormatted = selectedDate
                      ? selectedDate.toISOString().split("T")[0]
                      : null;

                    const bookedTimesForDate = vetsSchedule
                      .filter(
                        (appt) => appt.appointmentDate === selectedDateFormatted
                      )
                      .map((appt) => {
                        const [hour, minute] = appt.appointmentTime.split(":");
                        return `${hour.padStart(2, "0")}:${minute}`;
                      });

                    return (
                      <FormItem>
                        <FormLabel className="text-[18px]">
                          Appointment Time
                        </FormLabel>
                        <FormControl
                          disabled={!form.watch("vet") || !selectedDate}
                        >
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {times.map((time) => (
                                <SelectItem
                                  key={time.value}
                                  value={time.value}
                                  disabled={bookedTimesForDate.includes(
                                    time.value
                                  )}
                                >
                                  {time.text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
