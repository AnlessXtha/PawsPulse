"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/shadcn-components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  appointments = [],
  ...props
}) {
  // Utility to count appointments for a given day
  const getAppointmentsCount = (day) => {
    const dateStr = day.toLocaleDateString("en-CA"); // "YYYY-MM-DD" in local time

    const count = appointments.filter((a) => {
      const apptDate = new Date(a.appointmentDate).toLocaleDateString("en-CA");
      return apptDate === dateStr;
    }).length;

    return count;
  };

  console.log("appointments", appointments);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-[16px] font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border space-y-1",
        head_row: "flex w-full border-b py-2",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
        row: "flex w-full ",
        cell: "h-[120px] w-full text-sm p-0 relative border",
        day: "h-full w-full font-semibold text-lg flex flex-col gap-1 py-1 ",
        day_selected:
          "bg-[#A63E4B] text-primary-foreground hover:bg-[#A63E4B] hover:text-primary-foreground focus:bg-[#A63E4B] focus:text-primary-foreground ",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        DayContent: ({ date }) => {
          const count = getAppointmentsCount(date);

          return (
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2">{date.getDate()}</span>
              {count > 0 && (
                <div className="text-xs p-2 bg-green-100 text-green-800  rounded">
                  {count} appointment{count > 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
