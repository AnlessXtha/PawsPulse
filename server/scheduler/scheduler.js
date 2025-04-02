import { calculateNextOccurrence } from "../controllers/appointment.controller.js";
import prisma from "../lib/prisma.js";
import schedule from "node-schedule";

// Function to handle recurring appointments
// export const handleRecurringAppointments = async () => {
//   try {
//     // Fetch all recurring appointments that are not yet completed
//     const recurringAppointments = await prisma.appointments.findMany({
//       where: {
//         recurring: true,
//         status: { not: "completed" }, // Exclude completed appointments
//         OR: [
//           { recurringUntil: { gte: new Date() } }, // Recurring until date is in the future
//           { recurringUntil: null }, // No end date specified
//         ],
//       },
//     });

//     for (const appointment of recurringAppointments) {
//       const { appointmentId, appointmentDate, recurrenceRule, recurringUntil } =
//         appointment;

//       // Calculate the next occurrence based on the recurrence rule
//       let nextOccurrence = new Date(appointmentDate);
//       switch (recurrenceRule) {
//         case "daily":
//           nextOccurrence.setDate(nextOccurrence.getDate() + 1);
//           break;
//         case "weekly":
//           nextOccurrence.setDate(nextOccurrence.getDate() + 7);
//           break;
//         case "monthly":
//           nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
//           break;
//         default:
//           console.error(`Invalid recurrence rule: ${recurrenceRule}`);
//           continue;
//       }

//       // Check if the next occurrence is within the recurringUntil date
//       if (recurringUntil && nextOccurrence > recurringUntil) {
//         continue; // Stop creating new appointments for this series
//       }

//       // Update the current appointment's nextOccurrence field
//       await prisma.appointments.update({
//         where: { appointmentId },
//         data: { nextOccurrence },
//       });

//       // Create a new appointment instance for the next occurrence
//       await prisma.appointments.create({
//         data: {
//           vetId: appointment.vetId,
//           petProfileId: appointment.petProfileId,
//           appointment: nextOccurrence,
//           durationMinutes: appointment.durationMinutes,
//           status: "pending",
//           recurring: true,
//           recurrenceRule: appointment.recurrenceRule,
//           recurringUntil: appointment.recurringUntil,
//         },
//       });
//     }
//   } catch (err) {
//     console.error("Error handling recurring appointments:", err);
//   }
// };

export const handleRecurringAppointments = async () => {
  try {
    const recurringAppointments = await prisma.appointments.findMany({
      where: {
        recurring: true,
        status: { not: "completed" },
        OR: [
          { recurringUntil: { gte: new Date() } }, // Recurring until date is in the future
          { recurringUntil: null }, // No end date specified
        ],
      },
    });

    for (const appointment of recurringAppointments) {
      const { appointmentId, appointmentDate, recurrenceRule, recurringUntil } =
        appointment;

      const nextOccurrence = calculateNextOccurrence(
        appointmentDate,
        recurrenceRule
      );

      if (recurringUntil && nextOccurrence > recurringUntil) {
        continue; // Stop creating new appointments for this series
      }

      // Update the current appointment's nextOccurrence field
      await prisma.appointments.update({
        where: { appointmentId },
        data: { nextOccurrence },
      });

      // Create the new appointment instance
      await prisma.appointments.create({
        data: {
          vetId: appointment.vetId,
          petProfileId: appointment.petProfileId,
          appointmentDate: nextOccurrence,
          durationMinutes: appointment.durationMinutes,
          status: "pending",
          recurring: true,
          recurrenceRule: appointment.recurrenceRule,
          recurringUntil: appointment.recurringUntil,
        },
      });
    }
  } catch (err) {
    console.error("Error handling recurring appointments:", err);
  }
};

// Schedule the recurring appointment handler to run every day at midnight
schedule.scheduleJob("0 0 * * *", handleRecurringAppointments);
