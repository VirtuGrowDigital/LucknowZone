import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email || null,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default auth;
