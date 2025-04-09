import prisma from "../lib/prisma.js";

export const createReport = async (req, res) => {
  try {
    const {
      userId,
      vetId,
      petProfileId,
      temperature,
      heartRate,
      respiratoryRate,
      symptoms,
      recommendations,
      diseases,
      treatments,
    } = req.body;

    const report = await prisma.reports.create({
      data: {
        userId,
        vetId,
        petProfileId,
        temperature,
        heartRate,
        respiratoryRate,
        symptoms,
        recommendations,
        diseases: {
          create: diseases,
        },
        treatments: {
          create: treatments,
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
  try {
    res.status(200).json({ message: "Fetched all reports." });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports." });
  }
};

// Get Single Report
export const getReport = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: `Fetched report with id ${req.params.id}.` });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report." });
  }
};

// Update Report
export const updateReport = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: `Updated report with id ${req.params.id}.` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update report." });
  }
};

// Delete Report
export const deleteReport = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: `Deleted report with id ${req.params.id}.` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report." });
  }
};
