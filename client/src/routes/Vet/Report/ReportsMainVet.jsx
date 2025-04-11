import { useState } from "react";
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

const dummyReports = [
  {
    reportId: "RPT123456",
    petName: "Buddy",
    ownerName: "John Doe",
    vetName: "Dr. Smith",
    createdAt: "2025-04-10T10:30:00.000Z",
  },
  {
    reportId: "RPT123457",
    petName: "Max",
    ownerName: "Sikum Limbu",
    vetName: "Dr. Watson",
    createdAt: "2025-04-09T14:00:00.000Z",
  },
];

const ReportsMainVet = () => {
  const [search, setSearch] = useState("");

  const filteredReports = dummyReports.filter(
    (report) =>
      report.reportId.toLowerCase().includes(search.toLowerCase()) ||
      report.petName.toLowerCase().includes(search.toLowerCase()) ||
      report.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      report.vetName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vet Reports Overview</h1>

      <Input
        placeholder="Search by Report ID, Pet, Owner, or Vet Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report, index) => (
              <TableRow key={report.reportId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{report.petName}</TableCell>
                <TableCell>{report.ownerName}</TableCell>
                <TableCell>{report.vetName}</TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No matching reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsMainVet;
