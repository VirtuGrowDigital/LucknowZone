import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Expect: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Token missing" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded.id; // save admin ID for later use
    next(); // continue to next function

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default auth;
