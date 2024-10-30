const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
app.get("/", (req, res) => {
    res.send("hello world");
});
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle receiving drawing data
  socket.on("draw", (data) => {
    // Broadcast the received drawing data to other clients in the same room (if needed)
    socket.broadcast.emit("draw", data);
    console.log(data);
  });
});

const count = io.engine.clientsCount;
console.log(count);

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});