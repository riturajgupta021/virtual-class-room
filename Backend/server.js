const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("ws");
const authRoute = require("./Routes/auth.routes");
const classRoomRoutes = require("./Routes/classroom.routes");

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/classrooms", classRoomRoutes);

// WebSocket Server for WebRTC signaling
const wss = new Server({ server });

const rooms = {}; // Object to manage room participants

wss.on("connection", (socket) => {
  console.log("WebSocket connection established");

  socket.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        const { roomId } = data;
        if (!rooms[roomId]) {
          rooms[roomId] = [];
        }
        rooms[roomId].push(socket);
        console.log(`Socket joined room: ${roomId}`);
        break;

      case "offer":
      case "answer":
      case "candidate":
        const targetRoom = rooms[data.roomId];
        if (targetRoom) {
          targetRoom.forEach((client) => {
            if (client !== socket && client.readyState === client.OPEN) {
              client.send(JSON.stringify(data));
            }
          });
        }
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  socket.on("close", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((client) => client !== socket);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
    console.log("WebSocket connection closed");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
