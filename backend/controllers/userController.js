// Packages and files
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Controllers
// @desc    Register users
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // request body to this endpoint will have name, email, and password
  const { name, email, password } = req.body;

  // basic validation to see req.body has the required content
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check whether user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Pribate
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
