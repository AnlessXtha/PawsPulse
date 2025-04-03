import prisma from "../lib/prisma.js";

export const getPets = async (req, res) => {
  try {
    const pets = await prisma.petProfile.findMany({
      include: {
        user: {
          select: {
            username: true, // Include only the username from the User model
          },
        },
      },
    });

    res.status(200).json({ pets, message: "Pets retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get pets." });
  }
};

export const getPet = async (req, res) => {
  const petId = req.params.id;

  try {
    const pet = await prisma.petProfile.findUnique({
      where: {
        id: petId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).json({ message: "Pet retrieved successfully.", pet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get pets." });
  }
};

export const getPetByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const pets = await prisma.petProfile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    // if (!pets.length) {
    //   return res.status(404).json({ message: "No pets found for this user." });
    // }

    res.status(200).json({ message: "Pet retrieved successfully.", pet: pets });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get pets." });
  }
};

export const updatePet = async (req, res) => {
  try {
    res.status(200).json({ message: "Pets retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get pets." });
  }
};

export const deletePet = async (req, res) => {
  try {
    res.status(200).json({ message: "Pets retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get pets." });
  }
};
