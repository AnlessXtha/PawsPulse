import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchReports,
  selectAllReports,
  getReportsStatus,
} from "@/redux/slices/reportSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";

const ReportsMainVet = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allReports = useSelector(selectAllReports);
  const status = useSelector(getReportsStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReports());
    }
  }, [dispatch, status]);

  const filteredReports = allReports.filter((report) => {
    const petName = report.petProfile?.petName || "";
    const ownerFullName = report.user
      ? `${report.user.firstName} ${report.user.lastName}`
      : "";
    const vetFullName = report.vet?.user
      ? `${report.vet.user.firstName} ${report.vet.user.lastName}`
      : "";
    return (
      report.reportId.toLowerCase().includes(search.toLowerCase()) ||
      petName.toLowerCase().includes(search.toLowerCase()) ||
      ownerFullName.toLowerCase().includes(search.toLowerCase()) ||
      vetFullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Reports</h1>

      <Input
        placeholder="Search by Report ID, Pet, Owner, or Vet Name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to page 1 on new search
        }}
        className="max-w-md mb-6"
      />

      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.N.</TableHead>
              <TableHead>Report ID</TableHead>
              <TableHead>Pet Name</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Vet Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.map((report, index) => (
              <TableRow key={report.reportId}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{report.petProfile?.petName || "N/A"}</TableCell>
                <TableCell>
                  {report.user
                    ? `${report.user.firstName} ${report.user.lastName}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {report.vet?.user
                    ? `Dr. ${report.vet.user.firstName} ${report.vet.user.lastName}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/vet/update-report/${report.reportId}`)
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedReports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No matching reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default ReportsMainVet;
