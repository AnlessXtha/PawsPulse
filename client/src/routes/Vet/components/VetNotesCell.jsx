import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/shadcn-components/ui/popover";
import { Button } from "@/components/shadcn-components/ui/button";

const VetNoteCell = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(appointment.vetNotes || "");

  const handleSave = () => {
    // TODO: Replace this with actual API call
    console.log("Save vet note for", appointment.appointmentId, "Note:", note);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span>{note || "—"}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("showing popover");
              setOpen(true); // make sure to open it manually on click
            }}
          >
            {note ? "Update" : "Add"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-2">
          <textarea
            className="w-full p-2 border rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VetNoteCell;
