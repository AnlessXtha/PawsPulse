import jwt from "jsonwebtoken";

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      res.status(403).json({ message: "Token is not valid!" });
    }
    if (!payload.userType === "admin") {
      res.status(403).json({ message: "Not Authorized!" });
    }
  });
  req.userId = payload.id;
  req.isAdmin = true;
  next();
};
