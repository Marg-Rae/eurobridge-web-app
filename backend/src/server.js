import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file only if it exists (not in production)
if (process.env.NODE_ENV !== "production") {
	dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

// Validate required environment variables
if (!process.env.JWT_SECRET) {
	console.error("❌ ERROR: JWT_SECRET is not set in .env file");
	console.error("Please add: JWT_SECRET=your-secret-key-here");
	process.exit(1);
}

if (!process.env.MONGODB_URI) {
	console.error("❌ ERROR: MONGODB_URI is not set in .env file");
	console.error("Please add: MONGODB_URI=your-mongodb-connection-string");
	process.exit(1);
}

console.log("✅ Environment variables loaded successfully");
console.log(`✅ JWT_SECRET is set (length: ${process.env.JWT_SECRET.length} characters)`);

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
