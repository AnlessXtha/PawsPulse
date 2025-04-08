import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn-components/ui/dialog";
import { Button } from "@/components/shadcn-components/ui/button";

const VetNoteCell = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(appointment.vetNotes || "");

  const handleSave = () => {
    console.log("Save vet note for", appointment.appointmentId, "Note:", note);
    setOpen(false); // close the dialog
  };

  return (
    <div className="flex items-center gap-2">
      <span>{note || "—"}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("opening dialog");
              setOpen(true);
            }}
          >
            {note ? "Update" : "Add"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {note ? "Update Vet Notes" : "Add Vet Notes"}
            </DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full mt-4 p-2 border rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            placeholder="Write your notes here..."
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VetNoteCell;
