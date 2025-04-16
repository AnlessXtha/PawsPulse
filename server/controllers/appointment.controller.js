import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getAppointments = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  console.log("tokenUserType", tokenUserType);

  try {
    let appointments;
    if (tokenUserType === "admin") {
      appointments = await prisma.appointments.findMany({
        include: {
          petProfile: {
            select: {
              petName: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          vet: {
            // select: {},
            include: {
              user: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      appointments.map((appointment) => ({
        ...appointment,
        vet: appointment.vet || undefined,
      }));

      return res.status(200).json({
        appointments,
        message: "Appointments retrieved successfully.",
      });
    } else if (tokenUserType === "vet") {
      const vet = await prisma.users.findUnique({
        where: { id: tokenUserId },
        include: {
          vet: true,
        },
      });

      let vetDetails = vet.vet;
      console.log(vetDetails, "vet");

      if (vet) {
        appointments = await prisma.appointments.findMany({
          where: { vetId: vetDetails.id },
          include: {
            petProfile: {
              select: {
                petName: true,
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });
      } else {
        // handle vet not found
        throw new Error("Vet not found for the given user ID.");
      }
    } else {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    res
      .status(200)
      .json({ appointments, message: "Appointments retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get appointments." });
  }
};

export const getAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  const tokenUserId = req.userId;
  const tokenUserType = req.userType;

  // console.log("appointmentId", appointmentId);
  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointmentId },
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (
      tokenUserType !== "admin" &&
      appointment.userId !== tokenUserId &&
      appointment.vetId !== tokenUserId
    ) {
      return res.status(403).json({ message: "Access denied." });
    }
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get appointment." });
  }
};

export const addAppointment = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;
  if (tokenUserType !== "owner") {
    return res
      .status(403)
      .json({ message: "Only owners can create appointments." });
  }

  try {
    const {
      vetId,
      petProfileId,
      reasonToVisit,
      appointmentDate,
      durationMinutes,
      recurring,
      recurrenceRule,
      recurringUntil,
    } = req.body;

    if (recurring) {
      if (!recurrenceRule || !recurringUntil) {
        return res.status(400).json({
          message:
            "For recurring appointments, recurrenceRule and recurringUntil are required.",
        });
      }
    }

    const nextOccurrence = recurring
      ? calculateNextOccurrence(appointmentDate, recurrenceRule)
      : null;

    const newAppointment = await prisma.appointments.create({
      data: {
        vetId,
        petProfileId,
        reasonToVisit,
        appointmentDate: new Date(appointmentDate),
        durationMinutes,
        status: "pending",
        rejectionReason: null,
        cancellationReason: null,
        vetNotes: null,
        isApproved: false,
        recurring,
        recurrenceRule: recurrenceRule ? recurrenceRule : null,
        recurringUntil: recurringUntil ? new Date(recurringUntil) : null,
        nextOccurrence,
      },
    });
    res.status(201).json({
      newAppointment,
      message: "Appointment Booked",
      description: "Your appoinment has been successfully booked.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create appointment." });
  }
};

export const addRecurringAppointments = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  if (tokenUserType !== "owner") {
    return res
      .status(403)
      .json({ message: "Only owners can create appointments." });
  }

  try {
    const {
      vetId,
      petProfileId,
      reasonToVisit,
      appointmentDate,
      durationMinutes,
      recurrenceRule,
      recurringUntil,
    } = req.body;

    const appointments = [];
    let currentDate = new Date(appointmentDate);

    while (currentDate <= new Date(recurringUntil)) {
      const nextOccurrence = calculateNextOccurrence(
        currentDate,
        recurrenceRule
      );

      appointments.push({
        vetId,
        petProfileId,
        reasonToVisit,
        appointmentDate: new Date(currentDate),
        durationMinutes,
        status: "pending",
        rejectionReason: null,
        cancellationReason: null,
        vetNotes: null,
        isApproved: false,
        recurring: true,
        recurrenceRule,
        recurringUntil: new Date(recurringUntil),
        nextOccurrence:
          nextOccurrence <= new Date(recurringUntil) ? nextOccurrence : null,
      });

      // Move to the next occurrence
      currentDate = nextOccurrence;
    }

    // Insert all appointments into the database
    await prisma.appointments.createMany({
      data: appointments,
    });

    // Fetch the created appointments
    const createdAppointments = await prisma.appointments.findMany({
      where: {
        vetId,
        petProfileId,
        appointmentDate: {
          gte: new Date(appointmentDate),
          lte: new Date(recurringUntil),
        },
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    res.status(201).json({
      appointments: createdAppointments,
      message: "Recurring appointments booked successfully.",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to create recurring appointments." });
  }
};
export const calculateNextOccurrence = (appointmentDate, recurrenceRule) => {
  let nextOccurrence = new Date(appointmentDate);

  switch (recurrenceRule) {
    case "daily":
      nextOccurrence.setDate(nextOccurrence.getDate() + 1);
      break;
    case "weekly":
      nextOccurrence.setDate(nextOccurrence.getDate() + 7); // Every 7 days
      break;
    case "bi-weekly":
      nextOccurrence.setDate(nextOccurrence.getDate() + 14); // Every 2 weeks
      break;
    case "monthly":
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 1); // Every month
      break;
    case "bi-monthly":
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 2); // Every 2 months
      break;
    case "quarterly":
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 3); // Every 3 months
      break;
    case "semi-annual":
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 6); // Every 6 months
      break;
    case "annual":
      nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1); // Every 12 months
      break;
    default:
      throw new Error("Invalid recurrence rule");
  }

  return nextOccurrence;
};

export const updateAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointmentId },
      include: { vet: true, petProfile: true },
    });

    // console.log("appointment", appointment);

    // if (!appointment) {
    //   return res.status(404).json({ message: "Appointment not found." });
    // }

    const ownerId = appointment.petProfile.userId;
    const vetId = appointment.vet.userId;

    if (ownerId !== tokenUserId && vetId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    const { status, vetNotes, rejectionReason, cancellationReason } = req.body;

    // Owner cancel logic
    if (tokenUserType === "owner") {
      if (appointment.status === "pending" && status === "cancelled") {
        const updatedAppointment = await prisma.appointments.update({
          where: { appointmentId },
          data: {
            status,
            cancellationReason,
            isApproved: false,
          },
        });
        return res.status(200).json(updatedAppointment);
      }
      return res.status(400).json({ message: "Invalid owner action." });
    }

    // Vet logic
    if (tokenUserType === "vet") {
      const vetUpdateData = { status };

      if (status === "approved" || status === "completed") {
        vetUpdateData.vetNotes = vetNotes;
        vetUpdateData.isApproved = status === "approved";
      } else if (status === "pending") {
        vetUpdateData.vetNotes = vetNotes;
      } else if (status === "rejected") {
        vetUpdateData.rejectionReason = rejectionReason;
        vetUpdateData.isApproved = false;
      } else {
        return res.status(400).json({ message: "Invalid status for vet." });
      }

      const updatedAppointment = await prisma.appointments.update({
        where: { appointmentId },
        data: vetUpdateData,
      });

      return res.status(200).json(updatedAppointment);
    }

    res.status(403).json({ message: "Unauthorized action." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update appointment." });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  try {
    await prisma.appointments.delete({ where: { appointmentId } });
    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};

export const getVetSchedule = async (req, res) => {
  const { id } = req.params;

  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    const appointments = await prisma.appointments.findMany({
      where: { vetId: id },
      select: {
        appointmentId: true,
        appointmentDate: true,
      },
    });

    const formattedAppointments = appointments.map((appointment) => {
      const rawDate = appointment.appointmentDate; // This is a Date object
      const isoString = rawDate.toISOString(); // Example: "2025-05-01T09:00:00.000Z"

      const [datePart, timePart] = isoString.split("T");
      const [hour, minute] = timePart.split(":");

      return {
        appointmentId: appointment.appointmentId,
        appointmentDate: datePart, // e.g., "2025-05-01"
        appointmentTime: `${parseInt(hour)
          .toString()
          .padStart(2, "0")}:${minute}`, // e.g., "09:00"
      };
    });

    res.status(200).json({
      appointments: formattedAppointments,
      message: "Vet appointments retrieved successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get vet appointments." });
  }
};
