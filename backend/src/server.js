import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import config, { validateConfig, logConfigStatus } from "./config.js";

// Validate configuration before starting anything
try {
	validateConfig();
	logConfigStatus();
} catch (error) {
	console.error("❌ Server startup failed due to configuration error");
	console.error(error.message);
	process.exit(1);
}

const PORT = config.PORT;

const startServer = async () => {
	try {
		// Attempt to connect to MongoDB
		await connectDB();

		// Create HTTP server
		const httpServer = createServer(app);

		// Initialize Socket.io with CORS
		const io = new Server(httpServer, {
			cors: {
				origin: config.CORS_ORIGIN,
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

		httpServer.listen(PORT, '0.0.0.0', () => {
			console.log(`✅ API running on port ${PORT}`);
			console.log(`🌍 Environment: ${config.NODE_ENV}`);
		});

		// Graceful shutdown handler
		process.on('SIGTERM', () => {
			console.log('SIGTERM received, shutting down gracefully');
			httpServer.close(() => {
				console.log('Process terminated');
			});
		});

		process.on('SIGINT', () => {
			console.log('SIGINT received, shutting down gracefully');
			httpServer.close(() => {
				console.log('Process terminated');
			});
		});

	} catch (error) {
		console.error("❌ Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();
