// Import required modules
const express = require('express');
const cors = require('cors');
const genaiRoutes = require('./app/routes/genai.route'); // Custom route for GenAI functionality

const app = express();
const PORT = 3001; // Use a different port from Angular (4200) to avoid conflicts

// Enable CORS to allow requests from frontend
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Mount the GenAI API routes under the /api path
app.use('/api', genaiRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Node backend is running on http://localhost:${PORT}`);
});
