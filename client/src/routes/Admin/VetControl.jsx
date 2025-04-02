import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  getUsersStatus,
  selectAllUsers,
} from "@/redux/slices/userSlice";
import { FileEdit, Trash } from "lucide-react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  fetchVets,
  getVetsStatus,
  selectAllVets,
} from "@/redux/slices/vetSlice";

const VetControl = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vetStatus = useSelector(getVetsStatus);
  const allVets = useSelector(selectAllVets);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (vetStatus === "idle") {
      dispatch(fetchVets());
    }
  }, [vetStatus, dispatch]);

  console.log(allVets, "allVets");

  const columns = [
    // { accessorKey: "id", header: "ID" },
    {
      id: "serialNo",
      header: "S.N.",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    {
      accessorKey: "userType",
      header: "User Type",
      cell: ({ row }) => {
        const userType = row.original.userType;

        return userType
          ? userType.charAt(0).toUpperCase() + userType.slice(1)
          : "-";
      },
    },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "contactNumber", header: "Contact" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
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
    data: allVets,
    columns,
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
    setSelectedUser(user);
    setActionType(type);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Users Management</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Input
          placeholder="Search by username..."
          value={table.getColumn("username")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="mb-4 max-w-sm"
        />
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogTitle>
            {actionType === "edit" ? "Edit User" : "Delete User"}
          </DialogTitle>
          <p>
            {actionType === "edit"
              ? `Editing user with ID: ${selectedUser?.id}`
              : `Are you sure you want to delete user with ID: ${selectedUser?.id}?`}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            {actionType === "delete" && (
              <Button variant="destructive">Confirm Delete</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VetControl;
