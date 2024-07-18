import { verifyToken } from "../services/auth.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (token) {
      const response = await verifyToken({ token: token });
      if (response.ok) {
        next();
      } else {
        return res.status(401).json("Not authorized!");
      }
    } else {
      return res.status(401).json("Not authorized!");
    }
  } catch (error) {
    return res.status(401).json("Not authorized!");
  }
};
