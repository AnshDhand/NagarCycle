const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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

const admin = require('./config/firebaseAdmin');
const db = admin.firestore();

// Route: STABLE Database Count (Exact Firestore count())
app.get('/api/buyers/count', async (req, res) => {
    try {
        const snapshot = await db.collection('users').count().get();
        const count = snapshot.data().count;
        res.json({ count });
    } catch (err) {
        console.error('Firestore count error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
