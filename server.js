const express = require("express");


const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("public")); // Serve static files from 'public' folder

// Azure AI Search Configuration
const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const AZURE_SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY;
const INDEX_NAME = process.env.INDEX_NAME;

// Middleware to allow embedding in an iframe
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL"); // Allows embedding
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' sharepoint.com *.sharepoint.com"
  );
  next();
});


app.post('/ask', async (req, res) => {
  try {
      const userQuery = req.body.query;

      // Azure AI Search API request
      const response = await axios.post(
          `${AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2024-07-01`,
          { search: userQuery,top:2, select: "title, content" },
          { headers: { 'Content-Type': 'application/json', 'api-key': AZURE_SEARCH_API_KEY } }
      );

      const results = response.data.value.map(item => `${item.content}\n \n`).join("\n\n");

      res.json({ response: results || "No relevant results found." });
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ response: "An error occurred while fetching results." });
  }
});








  
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});



const PORT = process.env.PORT || 3000; // Use the Azure-provided port or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
