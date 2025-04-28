import prisma from "../lib/prisma.js";

export const createReport = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  if (tokenUserType !== "vet") {
    return res.status(403).json({ message: "Only vets can create reports." });
  }

  try {
    const {
      appointmentId,
      userId,
      petProfileId,
      temperature,
      heartRate,
      respiratoryRate,
      symptoms,
      recommendations,
      diseases,
      treatments,
      vetNotes,
    } = req.body;

    const appointment = await prisma.appointments.findUnique({
      where: { appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        message: "Report can only be created after appointment is completed.",
      });
    }

    const vetUser = await prisma.users.findUnique({
      where: { id: tokenUserId },
      include: { vet: true },
    });

    if (!vetUser || !vetUser.vet) {
      return res.status(404).json({ message: "Vet profile not found." });
    }

    if (appointment.vetId !== vetUser.vet.id) {
      return res.status(403).json({
        message:
          "You are not authorized to create a report for this appointment.",
      });
    }

    const existingReport = await prisma.reports.findUnique({
      where: { appointmentId },
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ message: "A report already exists for this appointment." });
    }

    const formattedDiseases = diseases.map((disease) => ({
      diseaseName: disease.diseaseName,
      cureTrial: disease.cureTrial || null,
      effectOfTrial: disease.effectOfTrial || null,
      effectiveness: disease.effectiveness || "UNKNOWN",
      diseaseRemarks: disease.diseaseRemarks || null,
      treatmentStartDate: disease.treatmentStartDate
        ? new Date(disease.treatmentStartDate)
        : new Date(),
      treatmentEndDate: disease.treatmentEndDate
        ? new Date(disease.treatmentEndDate)
        : null,
    }));

    const formattedTreatments = treatments.map((treatment) => ({
      medicationName: treatment.medicationName,
      dosage: treatment.dosage,
      frequency: treatment.frequency,
      durationDays: treatment.durationDays,
      purpose: treatment.purpose,
    }));

    const report = await prisma.reports.create({
      data: {
        appointmentId,
        userId,
        vetId: vetUser.vet.id,
        petProfileId,
        temperature,
        heartRate,
        respiratoryRate,
        symptoms: Array.isArray(symptoms)
          ? symptoms
          : symptoms.split(",").map((s) => s.trim()),
        recommendations: Array.isArray(recommendations)
          ? recommendations
          : [recommendations],
        vetNotes,
        diseases: {
          create: formattedDiseases,
        },
        treatments: {
          create: formattedTreatments,
        },
      },
      include: {
        diseases: true,
        treatments: true,
      },
    });

    res.status(201).json({ report, message: "Report created successfully." });
  } catch (err) {
    console.error("Failed to create report:", err);
    res.status(500).json({ message: "Failed to create report." });
  }
};

// Get All Reports
export const getReports = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;
  const analysis = req.query.analysis;

  try {
    let reports;

    const baseInclude = {
      diseases: true,
      treatments: true,
      petProfile: {
        select: {
          petName: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      vet: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    };

    if (tokenUserType === "admin" || analysis === "true") {
      reports = await prisma.reports.findMany({
        include: baseInclude,
      });
    } else if (tokenUserType === "vet") {
      const vetUser = await prisma.users.findUnique({
        where: { id: tokenUserId },
        include: { vet: true },
      });

      reports = await prisma.reports.findMany({
        where: { vetId: vetUser.vet.id },
        include: baseInclude,
      });
    } else if (tokenUserType === "owner") {
      reports = await prisma.reports.findMany({
        where: { userId: tokenUserId },
        include: baseInclude,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    res.status(200).json({ reports, message: "Fetched reports successfully." });
  } catch (err) {
    console.error("Failed to fetch reports:", err);
    res.status(500).json({ message: "Failed to fetch reports." });
  }
};

// Get Single Report
export const getReport = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;
  const { id } = req.params;

  try {
    const report = await prisma.reports.findUnique({
      where: { reportId: id },
      include: { diseases: true, treatments: true },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    const vetUser = await prisma.users.findUnique({
      where: { id: tokenUserId },
      include: { vet: true },
    });

    const isAuthorized =
      tokenUserType === "admin" ||
      (tokenUserType === "vet" && report.vetId === vetUser.vet.id) ||
      (tokenUserType === "owner" && report.userId === tokenUserId);

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to report." });
    }

    res.status(200).json({ report });
  } catch (err) {
    console.error("Failed to fetch report:", err);
    res.status(500).json({ message: "Failed to fetch report." });
  }
};

// Update Report
export const updateReport = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;
  const { id } = req.params;

  try {
    const existingReport = await prisma.reports.findUnique({ where: { id } });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found." });
    }

    if (tokenUserType !== "admin" && existingReport.vetId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this report." });
    }

    const updatedReport = await prisma.reports.update({
      where: { id },
      data: req.body,
    });

    res
      .status(200)
      .json({ updatedReport, message: "Report updated successfully." });
  } catch (err) {
    console.error("Failed to update report:", err);
    res.status(500).json({ message: "Failed to update report." });
  }
};

// Delete Report
export const deleteReport = async (req, res) => {
  const tokenUserType = req.userType;
  const { id } = req.params;

  if (tokenUserType !== "admin") {
    return res.status(403).json({ message: "Only admin can delete reports." });
  }

  try {
    await prisma.reports.delete({ where: { id } });
    res.status(200).json({ message: "Report deleted successfully." });
  } catch (err) {
    console.error("Failed to delete report:", err);
    res.status(500).json({ message: "Failed to delete report." });
  }
};
