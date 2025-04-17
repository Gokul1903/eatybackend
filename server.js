require('dotenv').config();
const path = require("path");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRouter = require('./eatyrouts/authRout');
const shoprout = require('./eatyrouts/shoprout');
const userrout = require('./eatyrouts/useroperation');
const admin = require('./eatyrouts/adminrout');

const app = express();

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS Setup - for both mobile & web
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://eatyapp.netlify.app',
  'https://eatypartner.netlify.app',
  'https://eatyadmin.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/owner', shoprout);
app.use('/user', userrout);
app.use('/admin', admin);

// DB Connect + Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to database");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
