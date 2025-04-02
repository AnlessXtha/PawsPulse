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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-components/ui/select";
import { DataTableDemo } from "@/routes/Admin/balnk";

const UserControl = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStatus = useSelector(getUsersStatus);
  const allUsers = useSelector(selectAllUsers);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  const columns = [
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
    data: allUsers,
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

  console.log(allUsers);

  const [searchField, setSearchField] = useState("username"); // Default search field
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    table.getColumn(searchField)?.setFilterValue(event.target.value);
  };

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      console.log("hererere", dateRange.start, dateRange.end);
      const createdAtColumn = table.getColumn("createdAt");
      console.log("CreatedAt Column:", createdAtColumn);

      table.getColumn("createdAt")?.setFilterValue({
        start: dateRange.start,
        end: dateRange.end,
      });
    } else {
      table.getColumn("createdAt")?.setFilterValue(undefined);
    }
  }, [dateRange.start, dateRange.end]);

  const handleActionClick = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
  };

  const handleBulkDelete = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    console.log("Deleting rows:", selectedRows);
    // Dispatch delete action here
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Users Management</h1>
      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {/* Search Filters */}
        <div className="flex gap-4">
          <Input
            placeholder={`Search by ${searchField}...`}
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full"
          />
          <Select
            value={searchField}
            onValueChange={(value) => {
              setSearchField(value);
              setSearchValue("");
              table.getColumn(searchField)?.setFilterValue(undefined);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Search by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="contactNumber">Contact Number</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-4">
          <Input
            type="date"
            value={dateRange.start || ""}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={dateRange.end || ""}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            placeholder="End Date"
          />
        </div>

        {/* Dropdown Filter for UserType */}
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("userType")?.setFilterValue(undefined); // Clear the filter
            } else {
              table.getColumn("userType")?.setFilterValue(value); // Set the filter value
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>{" "}
            {/* Use "all" instead of "" */}
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="vet">Vet</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={Object.keys(rowSelection).length === 0}
          >
            Bulk Delete
          </Button>
        </div>

        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => (
              <DropdownMenuItem key={column.id}>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={(e) => column.toggleVisibility(e.target.checked)}
                />
                {column.columnDef.header}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.column.columnDef.header}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] || null}
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
      {/* Pagination Controls */}
      
      {/* Dialog for Actions */}
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

export default UserControl;
