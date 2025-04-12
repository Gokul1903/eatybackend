require('dotenv').config();
const path = require("path");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { createServer } = require("http");       // ✅ New
const { Server } = require("socket.io");        // ✅ New

// ROUTERS
const authRouter = require('./eatyrouts/authRout');
const shoprout = require('./eatyrouts/shoprout');
const userrout = require('./eatyrouts/useroperation');

const app = express();
const server = createServer(app);               // ✅ New HTTP Server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://eatyapp.netlify.app"
    ],
    credentials: true
  }
});

// ✅ WebSocket logic
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Custom event when order is placed
  socket.on("newOrder", (orderData) => {
    console.log("Order Received:", orderData);
    io.emit("orderUpdate", orderData);  // send to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://eatyapp.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/owner', shoprout);
app.use('/user', userrout);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");

    // ✅ Start Socket.io compatible server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
