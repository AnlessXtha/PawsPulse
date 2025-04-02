import prisma from "../lib/prisma.js";

export const checkExistingUser = async (
  id, // ID of the current user (to exclude them from checks)
  username,
  email,
  contactNumber,
  licenseNumber
) => {
  const existingUser = await prisma.users.findFirst({
    where: {
      AND: [
        { id: { not: id } }, // Exclude the current user
        {
          OR: [
            username ? { username } : undefined,
            email ? { email } : undefined,
            contactNumber ? { contactNumber } : undefined,
          ].filter(Boolean), // Filter out undefined values
        },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      return { message: "Username is already taken.", field: "username" };
    }
    if (existingUser.email === email) {
      return { message: "Email is already registered.", field: "email" };
    }
    if (existingUser.contactNumber === contactNumber) {
      return {
        message: "Contact number is already in use.",
        field: "contactNumber",
      };
    }
  }

  if (licenseNumber) {
    const existingVet = await prisma.vets.findFirst({
      where: {
        licenseNumber,
      },
    });

    if (existingVet) {
      return {
        message: "License number is already registered.",
        field: "licenseNumber",
      };
    }
  }

  return null;
};
