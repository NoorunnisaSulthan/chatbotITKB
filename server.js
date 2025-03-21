const express = require("express");
const app = express();

app.use(express.static("public")); // Serve static files from 'public' folder

// Middleware to allow embedding in an iframe
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL"); // Allows embedding
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors 'self' sharepoint.com *.sharepoint.com"
    );
    next();
  });
  
  
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});



const PORT = process.env.PORT || 3000; // Use the Azure-provided port or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
