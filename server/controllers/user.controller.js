import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { baseUserSchema } from "../schema.js";
import { checkExistingUser } from "../utils/userValidator.js";
import { z } from "zod";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json({ users, message: "Users retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users." });
  }
};

export const getVets = async (req, res) => {
  try {
    const vets = await prisma.users.findMany({
      where: {
        userType: "vet",
      },
      include: {
        vet: true,
      },
    });

    res.status(200).json({ vets, message: "Vets retrieved successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get vets." });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        petProfile: true,
        vet: true,
      },
    });

    const filteredUser = {
      ...user,
      petProfile: user.petProfile || undefined, // Include petProfile only if it exists
      vet: user.vet || undefined, // Include vet only if it exists
    };

    res.status(200).json(filteredUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user." });
  }
};

// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserType = req.userType;
//   const tokenUserId = req.userId;

//   try {
//     const validatedData = baseUserSchema.partial().safeParse(req.body); // Use `.partial()` to make fields optional for updates
//     console.log(req.body, "req.body");
//     console.log(validatedData, "validatedData");
//     if (!validatedData.success) {
//       return res
//         .status(400)
//         .json({ message: validatedData.error.errors[0].message });
//     }

//     const existingUser = await prisma.users.findUnique({
//       where: { id },
//       select: { userType: true },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (existingUser.userType === "vet" && tokenUserType !== "admin") {
//       return res.status(403).json({
//         message: "Permission denied. Only an admin can update a vet.",
//       });
//     }

//     if (tokenUserType === "admin" && tokenUserId !== id) {
//       return res
//         .status(403)
//         .json({ message: "Admins can only update their own profile." });
//     }

//     const { password, avatar, ...inputs } = req.body;

//     let updatedPassword = null;
//     if (password) {
//       updatedPassword = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await prisma.users.update({
//       where: { id },
//       data: {
//         ...inputs,
//         ...(updatedPassword && { password: updatedPassword }),
//         ...(avatar && { avatar }),
//       },
//     });

//     const { password: userPassword, ...rest } = updatedUser;

//     res.status(200).json(rest);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update user." });
//   }
// };

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    // Validate request body using Zod (make all fields optional for updates)
    const validatedData = baseUserSchema.partial().safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: validatedData.error.errors[0].message });
    }

    // Fetch the existing user from the database
    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Permission checks
    if (existingUser.userType === "vet" && tokenUserType !== "admin") {
      return res.status(403).json({
        message: "Permission denied. Only an admin can update a vet.",
      });
    }
    if (tokenUserType === "admin" && tokenUserId !== id) {
      return res.status(403).json({
        message: "Admins can only update their own profile.",
      });
    }

    if (tokenUserType === "owner" && tokenUserId !== id) {
      return res.status(403).json({
        message: "You are not authorized to update this user.",
      });
    }

    // Extract fields from the validated data
    const { email, username, contactNumber, password, avatar, ...inputs } =
      validatedData.data;

    // Check for uniqueness of email, username, and contactNumber if they are being updated
    const duplicateCheck = await checkExistingUser(
      id,
      username || existingUser.username, // Use the new value if provided, otherwise use the existing value
      email || existingUser.email,
      contactNumber || existingUser.contactNumber,
      null // License number is not relevant for updates
    );

    if (duplicateCheck) {
      return res.status(400).json(duplicateCheck);
    }

    // Hash the password if it is being updated
    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user in the database
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...inputs,
        ...(email && { email }), // Update email only if provided and unique
        ...(username && { username }), // Update username only if provided and unique
        ...(contactNumber && { contactNumber }), // Update contactNumber only if provided and unique
        ...(updatedPassword && { password: updatedPassword }), // Update password only if provided
        ...(avatar && { avatar }), // Update avatar only if provided
      },
    });

    // Remove the password field from the response
    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user." });
  }
};

// test validations
export const updateVet = async (req, res) => {
  const tokenUserType = req.userType;
  const tokenUserId = req.userId;

  try {
    // Validate request body using Zod (only specialization is allowed for updates)
    const validatedData = z
      .object({ specialization: z.string().optional() })
      .safeParse(req.body);

    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: validatedData.error.errors[0].message });
    }

    // Check if the user exists and is a vet
    const existingVet = await prisma.vets.findUnique({
      where: { userId: tokenUserId },
    });

    if (!existingVet) {
      return res.status(404).json({ message: "Vet profile not found." });
    }

    // Ensure the user is only updating their own specialization
    if (tokenUserType !== "vet") {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    // Extract updated specialization field
    const { specialization } = validatedData.data;

    // Update only the specialization field
    const updatedVet = await prisma.vets.update({
      where: { userId: tokenUserId },
      data: { ...(specialization && { specialization }) },
    });

    res.status(200).json(updatedVet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vet specialization." });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const tokenUserType = req.userType;

  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    // Admin disabling others (not self)
    if (tokenUserType === "admin" && tokenUserId !== id) {
      let newUserType;
      if (user.userType === "owner") newUserType = "disableOwner";
      else if (user.userType === "vet") newUserType = "disableVet";
      else
        return res
          .status(400)
          .json({ message: "Cannot disable this user type." });

      await prisma.users.update({
        where: { id },
        data: { userType: newUserType },
      });

      return res.status(200).json({
        message: `User disabled successfully as ${newUserType}.`,
      });
    }

    // Owner disabling their own account
    if (tokenUserType === "owner" && tokenUserId === id) {
      await prisma.users.update({
        where: { id },
        data: { userType: "disableOwner" },
      });

      return res.status(200).json({
        message: "Your account has been disabled.",
      });
    }

    // Vets cannot delete their account
    if (tokenUserType === "vet" && tokenUserId === id) {
      return res.status(403).json({
        message: "Vets are not allowed to delete their own account.",
      });
    }

    return res.status(403).json({ message: "You are not authorized!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to disable user." });
  }
};
