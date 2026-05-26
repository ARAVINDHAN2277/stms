import * as authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields: username, email, password, role" });
    }
    
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
    
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields: email, password" });
    }
    
    const user = await authService.loginUser({ email, password });
    
    const roleLower = user.role;
    
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

export const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const frontendUser = {
      ...user,
      _id: user.id,
    };
    delete frontendUser.password;
    res.json(frontendUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, dateOfBirth, gender, city, skillLevel, organizationName } = req.body;
    
    const updatedUser = await authService.updateUser(userId, {
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      city,
      skillLevel,
      organizationName,
      profileCompleted: true
    });
    
    const frontendUser = {
      ...updatedUser,
      _id: updatedUser.id,
    };
    delete frontendUser.password;
    
    res.json(frontendUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
