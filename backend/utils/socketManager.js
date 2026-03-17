import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a private room for personal notifications
    socket.on("join_private", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined private room.`);
    });

    // Join a tournament room for live score updates
    socket.on("join_tournament", (tournamentId) => {
      socket.join(`tournament:${tournamentId}`);
      console.log(`Socket joined tournament room: ${tournamentId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Helper to emit to a specific user
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

// Helper to emit to a tournament room
export const emitToTournament = (tournamentId, event, data) => {
  if (io) {
    io.to(`tournament:${tournamentId}`).emit(event, data);
  }
};

// Helper for global announcements
export const emitGlobal = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
