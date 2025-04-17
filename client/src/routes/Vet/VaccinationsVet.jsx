import React, { useState } from "react";
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
import { format } from "date-fns";

const dummyVaccinations = [
  {
    id: "VAC001",
    petProfileId: "PET123",
    vaccineName: "Rabies",
    dateAdministered: "2025-04-10T10:30:00.000Z",
    nextDueDate: "2026-04-10T10:30:00.000Z",
    manufacturer: "BioVet",
    batchLotNo: "LOT123456",
    route: "Injection",
    vetId: "VET001",
  },
];

const VaccinationsVet = () => {
  const [vaccinations, setVaccinations] = useState(dummyVaccinations);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    petProfileId: "",
    vaccineName: "",
    dateAdministered: "",
    nextDueDate: "",
    manufacturer: "",
    batchLotNo: "",
    route: "",
    vetId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setVaccinations([
      ...vaccinations,
      { id: Date.now().toString(), ...formData },
    ]);
    setFormData({
      petProfileId: "",
      vaccineName: "",
      dateAdministered: "",
      nextDueDate: "",
      manufacturer: "",
      batchLotNo: "",
      route: "",
      vetId: "",
    });
  };

  const handleEdit = (id) => {
    const vac = vaccinations.find((v) => v.id === id);
    setFormData(vac);
    setEditingId(id);
  };

  const handleUpdate = (id) => {
    setVaccinations(
      vaccinations.map((v) => (v.id === id ? { ...v, ...formData } : v))
    );
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Vaccinations</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.keys(formData).map((field) => (
          <Input
            key={field}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            type={field.toLowerCase().includes("date") ? "date" : "text"}
          />
        ))}
        <Button
          onClick={handleAdd}
          className="col-span-4 bg-primary text-white"
        >
          Add Vaccination
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.N.</TableHead>
              <TableHead>Vaccine</TableHead>
              <TableHead>Pet ID</TableHead>
              <TableHead>Administered</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Batch No</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinations.map((v, index) => (
              <TableRow key={v.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {editingId === v.id ? (
                    <Input
                      name="vaccineName"
                      value={formData.vaccineName}
                      onChange={handleChange}
                    />
                  ) : (
                    v.vaccineName
                  )}
                </TableCell>
                <TableCell>{v.petProfileId}</TableCell>
                <TableCell>
                  {format(new Date(v.dateAdministered), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  {format(new Date(v.nextDueDate), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>{v.manufacturer}</TableCell>
                <TableCell>{v.batchLotNo}</TableCell>
                <TableCell>{v.route}</TableCell>
                <TableCell>
                  {editingId === v.id ? (
                    <Button onClick={() => handleUpdate(v.id)}>Save</Button>
                  ) : (
                    <Button variant="outline" onClick={() => handleEdit(v.id)}>
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {vaccinations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  No vaccination records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VaccinationsVet;
