import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  selectAllAppointments,
  getAppointmentsStatus,
  updateAppointment,
} from "@/redux/slices/appointmentSlice";

import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn-components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-components/ui/select";
import { Textarea } from "@/components/shadcn-components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import { CalendarIcon, CalendarSync, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ViewAppointments = () => {
  const dispatch = useDispatch();
  const allAppointments = useSelector(selectAllAppointments);
  const appointmentStatus = useSelector(getAppointmentsStatus);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [filterRecurring, setFilterRecurring] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (appointmentStatus === "idle") {
      dispatch(fetchAppointments());
    }
  }, [dispatch, appointmentStatus]);

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

  const filteredAppointments = allAppointments.filter((appointment) => {
    const vetName = appointment.vet?.user
      ? `${appointment.vet.user.firstName} ${appointment.vet.user.lastName}`
      : "";

    const matchesStatus = filterStatus
      ? appointment.status?.toLowerCase() === filterStatus.toLowerCase()
      : true;

    const matchesRecurring = filterRecurring
      ? (filterRecurring === "Yes" && appointment.recurring) ||
        (filterRecurring === "No" && !appointment.recurring)
      : true;

    const matchesDate = selectedDate
      ? new Date(appointment.appointmentDate).toDateString() ===
        selectedDate.toDateString()
      : true;

    return matchesStatus && matchesRecurring && matchesDate;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openRescheduleDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogType("reschedule");
    setOpenDialog(true);
  };

  const openCancelDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogType("cancel");
    setOpenDialog(true);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) return;

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");

    const combinedDate = new Date(`${year}-${month}-${day}T${newTime}:00.000Z`);

    await dispatch(
      updateAppointment({
        id: selectedAppointment.appointmentId,
        updatedData: { appointmentDate: combinedDate },
      })
    );
    closeDialog();
  };

  const handleCancel = async () => {
    if (!cancelReason) return;

    await dispatch(
      updateAppointment({
        id: selectedAppointment.appointmentId,
        updatedData: { status: "cancelled", cancellationReason: cancelReason },
      })
    );
    closeDialog();
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setNewDate(null);
    setNewTime("");
    setCancelReason("");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterRecurring}
          onValueChange={(value) => {
            setFilterRecurring(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Routine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setOpenPopover(false); // Close popover after selecting date
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={() => {
            setFilterStatus("");
            setFilterRecurring("");
            setSelectedDate(null);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.N.</TableHead>
              <TableHead>Reason to Visit</TableHead>
              <TableHead>Vet Name</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Routine</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((appointment, index) => {
                const isoString = appointment.appointmentDate;
                const [datePart, timePart] = isoString.split("T");
                let [hour, minute] = timePart.split(":");
                hour = Number(hour);
                const ampm = hour >= 12 ? "pm" : "am";
                hour = hour % 12 || 12;
                const formattedDate = `${datePart} ${hour}:${minute} ${ampm}`;

                const vetName = appointment.vet?.user
                  ? `Dr. ${appointment.vet.user.firstName} ${appointment.vet.user.lastName}`
                  : "Unknown";

                return (
                  <TableRow key={appointment.appointmentId}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{appointment.reasonToVisit}</TableCell>
                    <TableCell>{vetName}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      {appointment.recurring ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRescheduleDialog(appointment)}
                        >
                          <CalendarSync size={18} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openCancelDialog(appointment)}
                        >
                          <X size={18} className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No matching appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>

        <div className="flex-1 flex justify-end mr-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "reschedule"
                ? "Reschedule Appointment"
                : "Cancel Appointment"}
            </DialogTitle>
          </DialogHeader>

          {dialogType === "reschedule" ? (
            <div className="flex flex-col gap-6">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                disabled={{ before: new Date(Date.now() + 86400000) }}
              />
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Textarea
              placeholder="Reason for Cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            {dialogType === "reschedule" ? (
              <Button
                onClick={handleReschedule}
                className="bg-blue-600 text-white"
              >
                Reschedule
              </Button>
            ) : (
              <Button onClick={handleCancel} className="bg-red-600 text-white">
                Confirm Cancellation
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewAppointments;
