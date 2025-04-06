import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  getAppointmentsStatus,
  selectAllAppointments,
} from "@/redux/slices/appointmentSlice";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";

const AppointmentsVet = () => {
  const dispatch = useDispatch();

  const appointmentStatus = useSelector(getAppointmentsStatus);
  const allAppointments = useSelector(selectAllAppointments);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (appointmentStatus === "idle") {
      dispatch(fetchAppointments());
    }
  }, [appointmentStatus, dispatch]);

  const appointmentColumns = [
    {
      id: "serialNo",
      header: "S.N.",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "petName",
      header: "Pet Name",
      cell: ({ row }) => row.original.petProfile?.petName || "Unknown",
    },
    {
      id: "ownerUsername",
      header: "Owner",
      cell: ({ row }) => row.original.petProfile?.user?.username || "Unknown",
    },
    {
      accessorKey: "reasonToVist",
      header: "Reason to Visit",
    },
    {
      accessorKey: "appointmentDate",
      header: "Appointment Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("appointmentDate"));
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${year}/${month}/${day} ${formattedHours}:${minutes} ${ampm}`;
      },
    },
    {
      accessorKey: "durationMinutes",
      header: "Duration (min)",
    },
    {
      accessorKey: "recurring",
      header: "Recurring?",
      cell: ({ row }) => (row.getValue("recurring") ? "Yes" : "No"),
    },
    {
      accessorKey: "recurrenceRule",
      header: "Recurrence Rule",
    },
    {
      accessorKey: "nextOccurrence",
      header: "Next Occurrence",
      cell: ({ row }) =>
        row.getValue("nextOccurrence")
          ? new Date(row.getValue("nextOccurrence")).toLocaleString()
          : "—",
    },
    {
      accessorKey: "recurringUntil",
      header: "Recurring Until",
      cell: ({ row }) =>
        row.getValue("recurringUntil")
          ? new Date(row.getValue("recurringUntil")).toLocaleString()
          : "—",
    },
    {
      accessorKey: "isApproved",
      header: "Approved",
      cell: ({ row }) => (row.getValue("isApproved") ? "Yes" : "No"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const currentStatus = row.getValue("status");
        return (
          <select
            defaultValue={currentStatus}
            className="border rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        );
      },
    },
    {
      accessorKey: "vetNotes",
      header: "Vet Notes",
      cell: ({ row }) => row.getValue("vetNotes") || "—",
    },
   
  ];

  const table = useReactTable({
    data: allAppointments,
    columns: appointmentColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <h1 className="text-5xl font-bold mb-6">Appointments</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.cell(cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AppointmentsVet;
