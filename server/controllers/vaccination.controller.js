import prisma from "../lib/prisma.js";

export const getVaccinations = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    let vaccinations;
    if (tokenUserType === "admin") {
      vaccinations = await prisma.vaccinations.findMany();
    } else if (tokenUserType === "vet") {
      vaccinations = await prisma.vaccinations.findMany({
        where: { vetId: tokenUserId },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    res.status(200).json({
      vaccinations,
      message: "Vaccinations retrieved successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get vaccinations." });
  }
};

export const getVaccination = async (req, res) => {
  const { id: vaccinationId } = req.params;
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    const vaccination = await prisma.vaccinations.findUnique({
      where: { id: vaccinationId },
    });

    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found." });
    }

    if (tokenUserType !== "admin" && vaccination.vetId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json(vaccination);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get vaccination." });
  }
};

export const addVaccination = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  if (tokenUserType !== "vet") {
    return res.status(403).json({ message: "Only vets can add vaccinations." });
  }

  try {
    const { petProfileId, vaccineName, vaccinationDate, notes } = req.body;

    const newVaccination = await prisma.vaccinations.create({
      data: {
        vetId: tokenUserId,
        petProfileId,
        vaccineName,
        vaccinationDate: new Date(vaccinationDate),
        notes,
      },
    });

    res.status(201).json({
      newVaccination,
      message: "Vaccination record added successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add vaccination." });
  }
};

export const updateVaccination = async (req, res) => {
  const { id: vaccinationId } = req.params;
  //   const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    const vaccination = await prisma.vaccinations.findUnique({
      where: { id: vaccinationId },
    });

    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found." });
    }

    if (vaccination.vetId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    const { vaccineName, vaccinationDate, notes } = req.body;

    const updatedVaccination = await prisma.vaccinations.update({
      where: { id: vaccinationId },
      data: {
        vaccineName,
        vaccinationDate: new Date(vaccinationDate),
        notes,
      },
    });

    res.status(200).json({
      updatedVaccination,
      message: "Vaccination record updated successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update vaccination." });
  }
};

export const deleteVaccination = async (req, res) => {
  const { id: vaccinationId } = req.params;
  //   const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    const vaccination = await prisma.vaccinations.findUnique({
      where: { id: vaccinationId },
    });

    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found." });
    }

    if (vaccination.vetId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    await prisma.vaccinations.delete({ where: { id: vaccinationId } });

    res
      .status(200)
      .json({ message: "Vaccination record deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete vaccination." });
  }
};
