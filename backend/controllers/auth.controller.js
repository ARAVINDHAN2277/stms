import * as authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!["player", "organiser"].includes(role)) {
      return res.status(400).json("Invalid role");
    }

    await authService.registerUser({ username, email, password, role });
    res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await authService.loginUser({ email, password });
    
    const roleLower = user.role.toLowerCase();
    
    const token = jwt.sign({ id: user.id, role: roleLower }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    // Bridge to frontend format: include _id and lowercase role
    const frontendUser = {
      ...user,
      _id: user.id,
      role: roleLower
    };
    
    res.cookie("token", token, { httpOnly: true }).json({ 
      message: "Login successful", 
      token, 
      userData: frontendUser 
    });
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json(err.message);
    if (err.message === 'Invalid credentials') return res.status(400).json(err.message);
    res.status(500).json(err.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json("User logged out");
};
