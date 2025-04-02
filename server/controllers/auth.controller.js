import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { checkExistingUser } from "../validations/userValidator.js";

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    userType,
    username,
    email,
    contactNumber,
    password,
    avatar,
    vetDetails, // Object containing specialization & licenseNumber (for VET)
    petDetails,
  } = req.body;

  try {
    const duplicateCheck = await checkExistingUser(
      username,
      email,
      contactNumber,
      vetDetails?.licenseNumber
    );

    if (duplicateCheck) {
      return res.status(400).json({ message: duplicateCheck.message });
    }

    // find out a way to check if the user is already registered

    if (userType === "vet" || userType === "admin") {
      if (!req.isAdmin) {
        return res.status(403).json({
          message: "You are not Authorized!!",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstName,
      lastName,
      userType,
      username,
      email,
      contactNumber,
      password: hashedPassword,
      avatar,
    };

    if (userType === "owner" && petDetails) {
      const newUser = await prisma.users.create({
        data: userData,
      });

      const newPet = await prisma.petProfile.create({
        data: {
          userId: newUser.id,
          petName: petDetails.petName,
          petType: petDetails.petType,
          petBreed: petDetails.petBreed,
          petAge: petDetails.petAge,
          petGender: petDetails.petGender,
          petAvatar: petDetails.petAvatar,
        },
      });

      return res
        .status(201)
        .json({ message: "User created successfully!", newUser, newPet });
    }

    if (userType === "vet" && vetDetails) {
      const newUser = await prisma.users.create({
        data: userData,
      });
      const newVet = await prisma.vets.create({
        data: {
          userId: newUser.id,
          specialization: vetDetails.specialization,
          licenseNumber: vetDetails.licenseNumber,
        },
      });

      console.log("Vet Created:", newVet);
      return res
        .status(201)
        .json({ message: "Vet registered successfully!", newUser, newVet });
    }

    if (userType === "admin") {
      const newUser = await prisma.users.create({
        data: userData,
      });

      console.log("Admin Created:", newUser);
      return res
        .status(201)
        .json({ message: "New admin registered successfully!", newUser });
    } else {
      return res.status(400).json({ message: "Invalid user type provided." });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message || "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials!", user });
    }

    // res
    //   .setHeader("Set-Cookie", "test=" + "myValue")
    //   .json({ message: "Logged in!" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        userType: user.userType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Login Successful!", userInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to login");
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
