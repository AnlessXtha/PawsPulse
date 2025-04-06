import {
  fetchAppointments,
  fetchSingleAppointment,
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileEdit, Trash } from "lucide-react";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";

const AppointmentControl = () => {
  const dispatch = useDispatch();

  const appointmentStatus = useSelector(getAppointmentsStatus);
  const allAppointments = useSelector(selectAllAppointments);

  const [selectedPet, setSelectedPet] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (appointmentStatus === "idle") {
      dispatch(fetchAppointments());
    }
  }, [appointmentStatus, dispatch]);

  console.log(allAppointments, "allAppointments");

  const appointmentColumns = [
    {
      id: "serialNo",
      header: "S.N.",
      cell: ({ row }) => row.index + 1,
    },
    // { accessorKey: "appointmentId", header: "Appointment ID" },
    {
      accessorKey: "vetId",
      header: "Vet ID",
    },
    {
      accessorKey: "petProfileId",
      header: "Pet Profile ID",
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

    { accessorKey: "durationMinutes", header: "Duration (min)" },
    {
      accessorKey: "recurring",
      header: "Recurring?",
      cell: ({ row }) => (row.getValue("recurring") ? "Yes" : "No"),
    },
    { accessorKey: "recurrenceRule", header: "Recurrence Rule" },
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
    { accessorKey: "status", header: "Status" },
    // {
    //   accessorKey: "cancellationReason",
    //   header: "Cancellation Reason",
    //   cell: ({ row }) => row.getValue("cancellationReason") || "—",
    // },
    // {
    //   accessorKey: "rejectionReason",
    //   header: "Rejection Reason",
    //   cell: ({ row }) => row.getValue("rejectionReason") || "—",
    // },

    // {
    //   accessorKey: "vetNotes",
    //   header: "Vet Notes",
    //   cell: ({ row }) => row.getValue("vetNotes") || "—",
    // },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;

        return `${year}/${month}/${day} ${formattedHours}:${minutes} ${ampm}`;
      },
    },
    {
      accessorKey: "modifiedAt",
      header: "Modified At",
      cell: ({ row }) =>
        row.getValue("modifiedAt")
          ? new Date(row.getValue("modifiedAt")).toLocaleString()
          : "—",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleActionClick(row.original, "edit")}
          >
            <FileEdit size={18} className="text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleActionClick(row.original, "delete")}
          >
            <Trash size={18} className="text-red-500" />
          </Button>
        </div>
      ),
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

  const handleActionClick = (user, type) => {
    setSelectedPet(user);
    setActionType(type);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Appointment Management</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.column.columnDef.header === "Actions" &&
                      "text-center"
                    }
                  >
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
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.columnDef.header === "Actions" && " "
                    }
                  >
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

export default AppointmentControl;
