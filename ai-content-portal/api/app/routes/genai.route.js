// Import Express and create a router instance
const express = require('express');
const router = express.Router();

// Import the controller function that handles promo generation
const { generatePromo } = require('../controllers/genai.controller');

// Define the route for generating promotional content
router.post('/generate-promo', generatePromo);

// Export the router so it can be used in server.js
module.exports = router;
