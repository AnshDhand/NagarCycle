const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

const verifyToken = require('./middleware/authMiddleware');
const aiRoutes = require('./routes/aiRoutes');

// Routes
app.use('/api/ai', aiRoutes);

// Test Protected Route
app.get('/api/test-auth', verifyToken, (req, res) => {
    res.json({ message: 'Authenticated successfully!', user: req.user });
});

// AI Chat Route
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const { chatWithTrashtalk } = require('./services/aiService');
        const reply = await chatWithTrashtalk(message);
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: "Trashtalk offline" });
    }
});

// Calculate distance using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2-lat1) * (Math.PI/180);
  const dLon = (lon2-lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Global Seed for Active Buyers
const mockBuyersDatabase = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    // Scatter points generally around India / Delhi NCR
    lat: 28.5 + (Math.random() * 0.4 - 0.2), 
    lng: 77.2 + (Math.random() * 0.4 - 0.2),
}));

// Route: Get Nearby Active Buyers
app.get('/api/buyers/nearby', (req, res) => {
    const { lat, lng, radius = 5 } = req.query;
    
    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude parameters" });
    }
    
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    
    const nearby = mockBuyersDatabase.filter(buyer => {
        const dist = getDistanceFromLatLonInKm(userLat, userLng, buyer.lat, buyer.lng);
        return dist <= radiusKm;
    });

    // For prototype purposes: If no seeds match (e.g. user is not in Delhi), fallback to minimum 1
    const count = nearby.length > 0 ? nearby.length : Math.floor(Math.random() * 3) + 1;
    
    res.json({ count: count, radiusKm: radiusKm });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
