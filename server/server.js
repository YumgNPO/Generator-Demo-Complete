// Backend entry point
const express = require('express');
const cors = require('cors'); 
const app = express();
const http = require('http'); 
const server = http.createServer(app);

// 1. CRITICAL MIDDLEWARE
app.use(cors()); // Allows frontend on port 3000 to connect
app.use(express.json()); // Allows Express to read the req.body JSON

let certificates = [];

// 2. LOGIN ROUTE
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'joeny2026') {
    res.json({ token: 'mock-jwt-token-777' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 3. GENERATE CERTIFICATE ROUTE
app.post('/api/certificates', (req, res) => {
  const formData = req.body; // Grab everything the frontend sends
  
  const newCertificate = {
    id: Date.now(),
    ...formData, // Spread all fields directly into the database object
    createdAt: new Date().toISOString()
  };
  
  certificates.push(newCertificate);
  
  // Frontend specifically needs the 'id' returned to generate the QR code
  res.status(201).json({ id: newCertificate.id }); 
});

// 4. RETRIEVE CERTIFICATE ROUTE
app.get('/api/certificates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const certificate = certificates.find(c => c.id === id);
  
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  
  res.json(certificate);
});

// 5. SERVER LAUNCH
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});