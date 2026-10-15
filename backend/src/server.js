import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import config, { validateConfig, logConfigStatus } from "./config.js";
import Blog from "./models/Blog.js";
import blogSeeds from "../blogSeeds.js";

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

		const directorBlog = blogSeeds.find(
			(blog) => blog.slug === "director-message-opportunities-learning-german"
		);
		if (!directorBlog) {
			throw new Error("Director German-language blog post is missing from blog seeds");
		}

		const { image, ...directorBlogWithoutImage } = directorBlog;
		const seedResult = await Blog.bulkWrite([{
			updateOne: {
				filter: { slug: directorBlog.slug },
				update: {
					$setOnInsert: directorBlogWithoutImage,
					$set: { image }
				},
				upsert: true
			}
		}]);
		console.log(
			seedResult.upsertedCount
				? "✅ Published the Director's German-language blog post"
				: "ℹ️ Director's German-language blog post already exists"
		);

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
