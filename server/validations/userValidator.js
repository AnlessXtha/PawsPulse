import prisma from "../lib/prisma.js";

export const checkExistingUser = async (
  username,
  email,
  contactNumber,
  licenseNumber
) => {
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }, { contactNumber }],
    },
  });

  // can add more relevant data along with the message

  if (existingUser) {
    if (existingUser.username === username) {
      return { message: "Username is already taken." };
    }
    if (existingUser.email === email) {
      return { message: "Email is already registered." };
    }
    if (existingUser.contactNumber === contactNumber) {
      return {
        message: "Contact number is already in use.",
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
      return { message: "License number is already registered." };
    }
  }

  return null;
};
