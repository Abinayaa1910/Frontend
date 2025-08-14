// Import axios to make HTTP requests to the Flask backend
const axios = require('axios');

// Controller function to handle promo generation
exports.generatePromo = async (req, res) => {
  try {
    // Forward the incoming request body to the Flask API at /generate-promo
    const response = await axios.post('http://localhost:5000/generate-promo', req.body);

    // Send the Flask API's response back to the frontend
    res.json(response.data);
  } catch (error) {
    // Handle any errors and send error message to frontend
    res.status(500).json({ error: error.message });
  }
};
