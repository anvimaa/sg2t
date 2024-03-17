const server = require("./server");
const sockeIo = require("socket.io");
const io = sockeIo(server);

io.on("connection", (socket) => {
  console.log("Novo Usuario");
});

module.exports = io;
