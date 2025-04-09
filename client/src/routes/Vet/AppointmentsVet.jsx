import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  getAppointmentsStatus,
  selectAllAppointments,
  updateAppointment,
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
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";
import { Textarea } from "@/components/shadcn-components/ui/textarea";
import { formatDateTime } from "@/lib/formatDateTime";
import { useNavigate } from "react-router-dom";

const AppointmentsVet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appointmentStatus = useSelector(getAppointmentsStatus);
  const allAppointments = useSelector(selectAllAppointments);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [currentAppointmentStatus, setCurrentAppointmentStatus] = useState("");
  const [vetNotes, setVetNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const form = useForm({
    mode: "onTouched",
    // resolver: zodResolver(appointmentSchema),
  });

  const {
    control,
    formState: { errors },
  } = form;

  const { handleSubmit } = form;

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

      const matched = allAppointments.find(
        (a) => a.appointmentDate === combinedDate.toISOString()
      );
      setAppointmentDetails(matched || "none");
    }

    if (appointmentDetails !== "none") {
      setCurrentAppointmentStatus(appointmentDetails?.status || "");
      setVetNotes(appointmentDetails?.vetNotes || "");
      setRejectionReason(appointmentDetails?.rejectionReason || "");
    }
  }, [selectedDate, selectedTime, allAppointments, appointmentDetails]);

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

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedTime("");
  };

  const handleSave = async () => {
    if (!appointmentDetails || appointmentDetails === "none") return;

    const updatedAppointmentData = {
      ...appointmentDetails,
      status: appointmentStatus,
      vetNotes: vetNotes,
      rejectionReason: rejectionReason,
    };

    if (
      appointmentDetails.status === currentAppointmentStatus &&
      appointmentDetails.vetNotes === vetNotes &&
      appointmentDetails.rejectionReason === rejectionReason
    ) {
      return;
    }

    const payload = {
      status: currentAppointmentStatus,
    };

    if (
      ["pending", "approved", "completed"].includes(currentAppointmentStatus)
    ) {
      payload.vetNotes = vetNotes;
    }

    if (currentAppointmentStatus === "rejected") {
      payload.rejectionReason = rejectionReason;
    }

    await dispatch(
      updateAppointment({ id: appointmentDetails.appointmentId, data: payload })
    );

    await dispatch(fetchAppointments());

    console.log("Saved Appointment Details:", payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSave)} className="w-full h-full">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <div className="flex gap-6 ">
          {/* Left Side */}
          <div className="w-1/3 bg-white p-4 border rounded-lg shadow-sm flex flex-col justify-between">
            <div className="h-full">
              {!selectedDate || !selectedTime ? (
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-muted-foreground font-bold text-2xl px-20 text-center">
                    Select an appointment to display details
                  </h1>
                </div>
              ) : appointmentDetails === "none" ? (
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-red-400 font-bold text-2xl px-20 text-center">
                    No appointment present for the selected date and time
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4">
                    <FormItem className="w-1/2 gap-2">
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl disabled>
                        <Input
                          value={appointmentDetails?.petProfile?.petName}
                          className="input w-full"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="w-1/2 gap-2">
                      <FormLabel>Owner</FormLabel>
                      <FormControl disabled>
                        <Input
                          value={appointmentDetails?.petProfile?.user?.username}
                          className="input w-full"
                        />
                      </FormControl>
                    </FormItem>
                  </div>

                  <FormItem className="gap-2">
                    <FormLabel>Reason to Visit</FormLabel>
                    <FormControl disabled>
                      <Input
                        value={appointmentDetails?.reasonToVisit}
                        className="input w-full"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="gap-2">
                    <FormLabel>Appointment Date</FormLabel>
                    <FormControl disabled>
                      <Input
                        value={
                          appointmentDetails?.appointmentDate
                            ? formatDateTime(appointmentDetails.appointmentDate)
                            : ""
                        }
                        className="input w-full"
                      />
                    </FormControl>
                  </FormItem>

                  <div className="flex gap-4">
                    <FormItem className="w-1/2 gap-2">
                      <FormLabel>Duration (min)</FormLabel>
                      <FormControl disabled>
                        <Input
                          value={appointmentDetails?.durationMinutes}
                          className="input w-full"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="w-1/2 gap-2">
                      <FormLabel>Recurring Routine</FormLabel>
                      <FormControl disabled>
                        <Input
                          value={appointmentDetails?.recurring ? "Yes" : "No"}
                          className="input w-full"
                        />
                      </FormControl>
                    </FormItem>
                  </div>

                  {/* <FormItem className="gap-2">
                    <FormLabel>Approved</FormLabel>
                    <FormControl disabled>
                      <Input
                        value={appointmentDetails?.approved ? "Yes" : "No"}
                        className="input w-full"
                      />
                    </FormControl>
                  </FormItem> */}
                  <hr className="my-2 border-gray-300" />

                  <FormItem className="gap-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={currentAppointmentStatus}
                        onValueChange={(value) =>
                          setCurrentAppointmentStatus(value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                  {["pending", "approved", "completed"].includes(
                    currentAppointmentStatus
                  ) && (
                    <FormItem className="gap-2">
                      <FormLabel>Vet Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="input w-full h-[120px]"
                          value={vetNotes}
                          onChange={(e) => setVetNotes(e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  {["rejected", "cancelled"].includes(
                    currentAppointmentStatus
                  ) && (
                    <FormItem className="gap-2">
                      <FormLabel>Rejection Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          className="input w-full h-[120px]"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {appointmentDetails !== "none" && selectedTime && selectedDate && (
              <div className="flex justify-between gap-4 mt-4">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-white">
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="w-2/3 flex flex-col gap-6 justify-center">
            <FormField
              control={control}
              name="appointmentTime"
              render={() => (
                <FormItem>
                  <FormLabel className="text-[18px]">Select Time</FormLabel>
                  <div className="flex items-end gap-4 justify-between">
                    {/* Time Select */}
                    <FormControl className="w-full">
                      <Select
                        onValueChange={(value) => setSelectedTime(value)}
                        value={selectedTime}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    {/* Generate Report Button */}
                    <Button
                      type="button"
                      className="min-w-[160px]"
                      disabled={
                        (appointmentDetails?.status !== "approved" &&
                          appointmentDetails?.status !== "completed") ||
                        !selectedTime ||
                        !selectedDate
                      }
                      onClick={() => {
                        console.log("Generate Report clicked");
                        navigate("/vet/appointments/addReport");
                      }}
                    >
                      Generate a Report
                    </Button>
                  </div>
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
                      appointments={allAppointments}
                      className="w-full bg-white border rounded-2xl border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentsVet;
