import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		// Set MONGODB_URI in your environment before starting the server.
		await connectDB();
		app.listen(PORT, () => {
			console.log(`API running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();
