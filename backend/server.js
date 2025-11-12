const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Sample Catholic songs data
const songs = [
    {
        id: 1,
        title: "Ave Maria",
        artist: "Traditional",
        category: "marian",
        lyrics: "Ave Maria, gratia plena\nDominus tecum\nBenedicta tu in mulieribus\nEt benedictus fructus ventris tui, Jesus",
        likes: 25,
        playCount: 150
    },
    {
        id: 2,
        title: "Hail Holy Queen", 
        artist: "Sisters of Mercy",
        category: "marian",
        lyrics: "Hail, holy Queen, Mother of Mercy\nHail, our life, our sweetness and our hope",
        likes: 18,
        playCount: 89
    }
];

// API Routes
app.get('/api/songs', (req, res) => {
    res.json({ success: true, data: songs });
});

app.get('/api/songs/featured', (req, res) => {
    const featured = songs.sort((a, b) => b.likes - a.likes).slice(0, 3);
    res.json({ success: true, data: featured });
});

app.get('/api/status', (req, res) => {
    res.json({ 
        success: true, 
        message: "🌹 Catholic Songs API Running",
        version: "1.0.0",
        totalSongs: songs.length
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🌹 CATHOLIC SONGS WEBSITE 🌹
    ============================
    🚀 Server running on port ${PORT}
    🌐 Website: http://localhost:${PORT}
    📚 API: http://localhost:${PORT}/api/songs
    💚 Health: http://localhost:${PORT}/health
    
    🙏 Dedicated to Mary, Mother of Jesus
    ============================
    `);
});
