// Import express
const express = require('express');

// Create express app
const app = express();

// Define a port (default 3000)
const PORT = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 100px;
    ">
      <h1>🚀 Welcome to <span style="color:#0070f3;">WEXA AI</span></h1>
      <h2>Your DevOps & Cloud Innovation Partner</h2>
      <p>Empowering businesses with automation, scalability, and intelligent cloud solutions.</p>
      <hr style="width:60%; margin: 20px auto;">
      <p style="color:gray;">Node.js Sample App • Powered by Rajesh Kurumoju</p>
    </div>
  `);
});

// Start the server (listen on all network interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WEXA AI DevOps App running on port ${PORT}`);
});

