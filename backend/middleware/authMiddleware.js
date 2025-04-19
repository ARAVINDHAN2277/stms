// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Replace this with your actual secret (should match what you use to sign the token)

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("inside "+process.env.JWT_SECRET)
    // Attach decoded user info to request
    req.user = decoded;

    next(); // Pass control to next handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export default authMiddleware;
