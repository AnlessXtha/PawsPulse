import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import {
  fetchPets,
  getPetsStatus,
  selectAllPets,
} from "@/redux/slices/petSlice";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FileEdit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PetControl = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const petStatus = useSelector(getPetsStatus);
  const allPets = useSelector(selectAllPets);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (petStatus === "idle") {
      dispatch(fetchPets());
    }
  }, [petStatus, dispatch]);

  const columns = [
    // { accessorKey: "id", header: "ID" },
    {
      id: "serialNo",
      header: "S.N.",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "petName", header: "Pet Name" },
    { accessorKey: "petType", header: "Pet Type" },
    { accessorKey: "petBreed", header: "Breed" },
    { accessorKey: "petAge", header: "Pet Age" },
    {
      id: "username", // Unique ID for the column
      header: "User Name",
      cell: ({ row }) => row.original.user?.username || "Unknown", // Access nested user.username
    },
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
    data: allPets,
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
      <h1 className="text-4xl font-bold mb-6">Pets Management</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Input
          placeholder="Search by name"
          value={table.getColumn("petName")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("petName")?.setFilterValue(event.target.value)
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
    </>
  );
};

export default PetControl;
