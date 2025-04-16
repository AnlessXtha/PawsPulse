import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";
import { Checkbox } from "@/components/shadcn-components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-components/ui/select";
import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { appointmentSchema } from "@/schema/AppointmentSchema";
import { fetchVets, selectAllVets } from "@/redux/slices/vetSlice";
import {
  addAppointment,
  addRecurringAppointments,
  fetchVetAppointmentsSchedule,
  getVetAppointmentsSchedule,
} from "@/redux/slices/appointmentSlice";
import {
  fetchSinglePetByUserId,
  getSinglePetByUserId,
} from "@/redux/slices/petSlice";
import { AuthContext } from "@/context/AuthContext";
import { isSameDay, parseISO } from "date-fns";
import { Textarea } from "@/components/shadcn-components/ui/textarea";

const BookAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const vets = useSelector(selectAllVets);
  const vetsSchedule = useSelector(getVetAppointmentsSchedule);
  const pet = useSelector(getSinglePetByUserId);

  const [isRecurring, setIsRecurring] = useState(false);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

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
    resolver: zodResolver(appointmentSchema),
    mode: "onTouched",
  });

  const { handleSubmit, setValue, watch } = form;
  const watchRule = watch("recurringRule");
  const watchDate = watch("appointmentDate");
  const watchVet = watch("vet");

  useEffect(() => {
    dispatch(fetchVets());
    dispatch(fetchSinglePetByUserId(currentUser.id));
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (watchRule === "weekly" || watchRule === "biweekly") {
      setValue("recurringUntil", "month");
    } else if (watchRule === "monthly" || watchRule === "bimonthly") {
      // setValue("recurringUntil", "year");
    } else if (watchRule === "annually") {
      setValue("recurringUntil", "year");
    }
  }, [watchRule, setValue]);

  const onSubmit = (data) => {
    const date = data.appointmentDate;
    const [year, month, day] = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ];

    const combinedDateTime = new Date(
      `${year}-${month}-${day}T${data.appointmentTime}:00.000Z`
    );

    console.log(data.appointmentDate, "appointmentDate");
    console.log(combinedDateTime, "combinedDateTime");

    let recurringUntil = null;
    if (data.recurring) {
      recurringUntil = new Date(combinedDateTime);

      switch (data.recurringUntil) {
        case "month-three":
          recurringUntil.setMonth(recurringUntil.getMonth() + 2);
          break;
        case "month-six":
          recurringUntil.setMonth(recurringUntil.getMonth() + 5);
          break;
        case "year":
          recurringUntil.setFullYear(recurringUntil.getFullYear() + 1);
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

    if (data.recurring) {
      dispatch(addRecurringAppointments(bookingData));
    } else {
      dispatch(addAppointment(bookingData));
    }

    // Clear all fields after booking
    form.reset({
      reason: "",
      appointmentDate: null,
      appointmentTime: null,
      recurring: false,
      recurringRule: "",
      recurringUntil: "",
      vet: "",
    });

    navigate("/bookAppointment");
  };

  const disableBookedDates = (date) => {
    // Filter appointments for the given date
    const appointmentsForDate = vetsSchedule.filter((appointment) =>
      isSameDay(parseISO(appointment.appointmentDate), date)
    );

    // Check if all time slots are booked
    const bookedTimes = appointmentsForDate.map(
      (appointment) => appointment.appointmentTime
    );
    return times.every((time) => bookedTimes.includes(time));
  };

  const disableBookedTimes = (date) => {
    if (!date) return [];
    return vetsSchedule
      .filter((appointment) =>
        isSameDay(parseISO(appointment.appointmentDate), date)
      )
      .map((appointment) => appointment.appointmentTime);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[1000px] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-[28px] font-bold mb-6">Book an Appointment</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Recurring Logic */}
            <div className="mb-6">
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem
                    className={`flex items-center justify-between min-h-0 mt-6 ${
                      isRecurring && "mb-6"
                    }`}
                  >
                    <FormLabel>Make it a Routine?</FormLabel>
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
                <div className="flex justify-between mb-6">
                  <FormField
                    control={form.control}
                    name="recurringRule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurring Rule</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="flex-1 min-w-full w-[456px]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Biweekly</SelectItem> */}
                              <SelectItem value="monthly">Monthly</SelectItem>
                              {/* <SelectItem value="bimonthly">
                                Bi-Monthly
                              </SelectItem> */}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurringUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurring Until</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setShowUntilDatePicker(value === "date");
                            }}
                          >
                            <SelectTrigger className=" flex-1 min-w-full w-[456px]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month-three">
                                For 3 Month
                              </SelectItem>
                              <SelectItem value="month-six">
                                For 6 Month
                              </SelectItem>
                              <SelectItem value="year">For a Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <hr className="mb-6" />

            {/* Reason & Vet Selection */}
            <div className="flex gap-6 mb-6">
              <div className="flex-1 space-y-6">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason to Visit</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-auto h-[367px]"
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
                      <FormLabel>Select a Vet</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            dispatch(
                              fetchVetAppointmentsSchedule({ id: value })
                            );
                          }}
                        >
                          <SelectTrigger className="min-w-full w-[456px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {vets.map((vet) => (
                              <SelectItem key={vet.vet.id} value={vet.vet.id}>
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

              {/* Date and Time */}
              <div className="flex-1 space-y-6">
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          // onSelect={(date) => {date && field.onChange(date) console.log(date, "date") }};
                          // }}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              console.log(date, "date");
                            }
                          }}
                          disabled={[
                            { before: new Date(Date.now() + 86400000) },
                            !watchVet && {
                              from: new Date(2000, 0, 1),
                              to: new Date(2100, 11, 31),
                            },
                            disableBookedDates,
                          ].filter(Boolean)}
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
                      <FormLabel>Appointment Time</FormLabel>
                      <FormControl disabled={!watchVet || !watchDate}>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {times.map((t) => (
                              <SelectItem
                                key={t}
                                value={t}
                                disabled={disableBookedTimes(
                                  watchDate
                                ).includes(t)}
                              >
                                {t}
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
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                type="button"
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
