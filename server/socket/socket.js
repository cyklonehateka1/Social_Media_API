import { Server } from "socket.io";

export const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  let users = [];

  //  user id will be sent from the client
  //   SocketId is the socket id of the user connected
  const addOnlineUsers = (userId, socketId) => {
    users.forEach((user) => {
      if (user.userId !== userId) {
        users = users.push(userId, socketId);
        console.log(users);
        return users;
      }
    });
  };

  const removeOfflineUsers = (socketId) => {
    users = users.filter((user) => {
      return user.socketId !== socketId;
    });
  };

  const findUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      // console.log(socket.id);
      addOnlineUsers(userId, socket.id);
      socket.emit("getUsers", addOnlineUsers);
    });
    socket.on("disconnect", (socketId) => {
      removeOfflineUsers(socketId);
      socket.emit("getUsers", addOnlineUsers);
    });
    socket.on(
      "sendMessage",
      ({ userId, recieverId, text, videos, pictures }) => {
        const user = findUser(recieverId);
        socket.to(user.socketId).emit("getMessage", {
          userId,
          text,
          videos,
          pictures,
        });
      }
    );
  });
};
