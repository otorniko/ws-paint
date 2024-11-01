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
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: "*",
  },
});

const canvasData = [];

io.on("connection", (socket) => {

  /*   console.log("a user connected:", socket.id);
    if (canvasData.length > 0) {
      console.log("sending canvas data to new user");
      socket.emit("drawCanvas", canvasData)
    } */

  socket.on("requestCanvasData", () => {
    console.log("canvas data requested by:", socket.id);
    if (canvasData.length > 0) {
      console.log("sending canvas data");
      socket.emit("drawCanvas", canvasData);
      console.log("canvas data sent: ", canvasData[0]);
    } else {
      console.log("no canvas data to send");
    }
  });

  socket.on("draw", (data) => {
    canvasData.push(data);
    socket.broadcast.emit("drawLine", data);
  });

  socket.on("clear", () => {
    canvasData.length = 0;
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (io.engine.clientsCount === 0) {
      canvasData.length = [];
    }
  });
});

app.get("/count", (req, res) => {
  const count = io.engine.clientsCount;
  res.send({ count });
});

app.get("/draw", (req, res) => {
  res.send(canvasData);
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});