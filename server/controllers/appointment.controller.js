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
      reasonToVist,
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
        reasonToVist,
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
    res
      .status(201)
      .json({ newAppointment, message: "Appointment created successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create appointment." });
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

    console.log("appointment", appointment);

    // if (!appointment) {
    //   return res.status(404).json({ message: "Appointment not found." });
    // }

    const ownerId = appointment.petProfile.userId;
    const vetId = appointment.vet.userId;

    if (ownerId !== tokenUserId || vetId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    if (tokenUserType === "owner" && appointment.status === "pending") {
      const { status, cancellationReason } = req.body;
      if (status === "cancelled") {
        const updatedAppointment = await prisma.appointments.update({
          where: { appointmentId },
          data: { status, cancellationReason, isApproved: false },
        });
        return res.status(200).json(updatedAppointment);
      }
    }

    if (tokenUserType === "vet") {
      const { status, rejectionReason, vetNotes } = req.body;
      if (status === "approved" || status === "completed") {
        const updatedAppointment = await prisma.appointments.update({
          where: { appointmentId },
          data: { status, vetNotes, isApproved: status === "approved" },
        });
        return res.status(200).json(updatedAppointment);
      }
      if (status === "rejected") {
        const updatedAppointment = await prisma.appointments.update({
          where: { appointmentId },
          data: { status, rejectionReason, isApproved: false },
        });
        return res.status(200).json(updatedAppointment);
      }
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
