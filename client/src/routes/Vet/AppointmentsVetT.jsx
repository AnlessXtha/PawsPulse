import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  getAppointmentsStatus,
  selectAllAppointments,
} from "@/redux/slices/appointmentSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import { Calendar } from "@/components/shadcn-components/ui/eventCalendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/schema/AppointmentSchema";

export function VetEventCalendar() {
  const dispatch = useDispatch();
  const appointmentStatus = useSelector(getAppointmentsStatus);
  const allAppointments = useSelector(selectAllAppointments);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);

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
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (appointmentStatus === "idle") {
      dispatch(fetchAppointments());
    }
  }, [appointmentStatus, dispatch]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);

      const combinedDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hours,
          minutes,
          0
        )
      );
      console.log(combinedDate.toISOString());

      const matched = allAppointments.find(
        (a) => a.appointmentDate === combinedDate.toISOString()
      );
      if (matched) {
        setAppointmentDetails(matched);
      } else {
        setAppointmentDetails("none");
      }
    }
  }, [selectedDate, selectedTime, allAppointments]);

  console.log("appointmentDetails", appointmentDetails);

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

  return (
    <Form {...form}>
      <div className="flex gap-6 px-6 py-4">
        {/* Left Side */}
        <div className="w-1/3 bg-white p-4 border rounded-lg shadow-sm">
          {!selectedDate || !selectedTime ? (
            <p className="text-muted-foreground">
              Select an appointment to display details
            </p>
          ) : appointmentDetails === "none" ? (
            <p className="text-red-500">No appointment present</p>
          ) : (
            <>
              <FormItem>
                <FormLabel>Pet Name</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.petName}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.owner}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Reason to Visit</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.reason}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.date}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Duration (min)</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.duration}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Recurring?</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.recurring ? "Yes" : "No"}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Approved</FormLabel>
                <FormControl disabled>
                  <input
                    value={appointmentDetails?.approved ? "Yes" : "No"}
                    className="input w-full"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl disabled>
                  <select
                    value={appointmentDetails?.status}
                    className="input w-full"
                  >
                    <option>pending</option>
                    <option>approved</option>
                    <option>completed</option>
                    <option>rejected</option>
                    <option>cancelled</option>
                  </select>
                </FormControl>
              </FormItem>
              {(appointmentDetails?.status === "pending" ||
                appointmentDetails?.status === "approved" ||
                appointmentDetails?.status === "completed") && (
                <FormItem>
                  <FormLabel>Vet Notes</FormLabel>
                  <FormControl>
                    <textarea
                      className="input w-full"
                      defaultValue={appointmentDetails?.vetNotes || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
              {(appointmentDetails?.status === "rejected" ||
                appointmentDetails?.status === "cancelled") && (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <textarea
                      className="input w-full"
                      defaultValue={appointmentDetails?.rejectionReason || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="w-2/3 flex flex-col gap-6">
          <FormField
            control={control}
            name="appointmentTime"
            render={() => (
              <FormItem>
                <FormLabel className="text-[18px]">Select Time</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => setSelectedTime(value)}
                    value={selectedTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="appointmentDate"
            render={() => (
              <FormItem>
                <FormLabel className="text-[18px]">Select Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        const utcDate = new Date(
                          Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          )
                        );
                        setSelectedDate(utcDate);
                      }
                    }}
                    // disabled={(date) =>
                    //   date < new Date(new Date().setDate(new Date().getDate()))
                    // }
                    appointments={allAppointments}
                    className="w-full border border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}
