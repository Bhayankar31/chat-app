const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send_message", ({ to, message }) => {
    // Send message to receiver
    socket.to(to).emit("receive_message", {
      from: socket.id,
      message,
    });
    // Remove from sender immediately
    socket.emit("clear_sent");
  });

  socket.on("message_seen", ({ from }) => {
    // Start timer for 5 seconds before deleting from receiver
    setTimeout(() => {
      socket.emit("clear_received", { from });
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
