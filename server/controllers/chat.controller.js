import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving chats",
    });
  }
};
