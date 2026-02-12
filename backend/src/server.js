import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		// Set MONGODB_URI in your environment before starting the server.
		await connectDB();

		// Create HTTP server
		const httpServer = createServer(app);

		// Initialize Socket.io with CORS
		const io = new Server(httpServer, {
			cors: {
				origin: process.env.CORS_ORIGIN || "*",
				methods: ["GET", "POST"]
			}
		});

		// Socket.io connection handler
		io.on("connection", (socket) => {
			console.log("User connected");

			// Listen for sendMessage event
			socket.on("sendMessage", (message) => {
				// Broadcast message to all connected users
				io.emit("receiveMessage", message);
			});

			// Handle disconnect
			socket.on("disconnect", () => {
				console.log("User disconnected");
			});
		});

		httpServer.listen(PORT, () => {
			console.log(`API running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();
