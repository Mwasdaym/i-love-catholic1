const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: IS_PRODUCTION 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files with cache control
app.use(express.static(path.join(__dirname, 'frontend'), {
    maxAge: IS_PRODUCTION ? '1d' : '0',
    etag: true
}));

// ==================== CATHOLIC SONGS DATABASE ====================
class CatholicSongsDatabase {
    constructor() {
        this.songs = [
            {
                id: 1,
                title: "Ave Maria",
                artist: "Traditional",
                category: "marian",
                lyrics: `Ave Maria, gratia plena
Dominus tecum
Benedicta tu in mulieribus
Et benedictus fructus ventris tui, Jesus

Sancta Maria, Mater Dei
Ora pro nobis peccatoribus
Nunc et in hora mortis nostrae
Amen`,
                duration: "4:15",
                likes: 156,
                playCount: 892,
                tags: ["latin", "prayer", "mary", "classical"],
                audioUrl: "/api/stream/ave-maria",
                downloadUrl: "/api/download/ave-maria",
                featured: true
            },
            {
                id: 2,
                title: "Hail Holy Queen",
                artist: "Sisters of Mercy", 
                category: "marian",
                lyrics: `Hail, holy Queen, Mother of Mercy
Hail, our life, our sweetness and our hope
To thee do we cry, poor banished children of Eve
To thee do we send up our sighs
Mourning and weeping in this valley of tears`,
                duration: "3:45",
                likes: 89,
                playCount: 456,
                tags: ["prayer", "mary", "traditional"],
                audioUrl: "/api/stream/hail-holy-queen",
                downloadUrl: "/api/download/hail-holy-queen",
                featured: true
            },
            {
                id: 3,
                title: "Immaculate Mary",
                artist: "Traditional",
                category: "marian",
                lyrics: `Immaculate Mary, your praises we sing
You reign now in splendor with Jesus our King
Ave, ave, ave, Maria
Ave, ave, Maria

In heaven the blessed your glory proclaim
On earth we your children invoke your sweet name
Ave, ave, ave, Maria
Ave, ave, Maria`,
                duration: "3:20",
                likes: 134,
                playCount: 567,
                tags: ["lourdes", "mary", "hymn"],
                audioUrl: "/api/stream/immaculate-mary",
                downloadUrl: "/api/download/immaculate-mary",
                featured: true
            },
            {
                id: 4,
                title: "Salve Regina",
                artist: "Gregorian Chant",
                category: "marian", 
                lyrics: `Salve Regina, Mater misericordiae
Vita, dulcedo, et spes nostra, salve
Ad te clamamus, exsules filii Hevae
Ad te suspiramus, gementes et flentes
In hac lacrimarum valle`,
                duration: "5:30",
                likes: 78,
                playCount: 234,
                tags: ["latin", "chant", "traditional"],
                audioUrl: "/api/stream/salve-regina",
                downloadUrl: "/api/download/salve-regina",
                featured: false
            },
            {
                id: 5,
                title: "Tantum Ergo",
                artist: "Traditional",
                category: "eucharistic",
                lyrics: `Tantum ergo Sacramentum
Veneremur cernui
Et antiquum documentum
Novo cedat ritui
Praestet fides supplementum
Sensuum defectui`,
                duration: "2:45",
                likes: 67,
                playCount: 189,
                tags: ["latin", "eucharist", "benediction"],
                audioUrl: "/api/stream/tantum-ergo",
                downloadUrl: "/api/download/tantum-ergo",
                featured: false
            }
        ];
        
        this.categories = [
            { id: 'marian', name: 'Marian Hymns', count: 3, color: '#2c5aa0' },
            { id: 'eucharistic', name: 'Eucharistic', count: 1, color: '#d4af37' },
            { id: 'lent', name: 'Lent & Easter', count: 0, color: '#8b4513' },
            { id: 'advent', name: 'Advent', count: 0, color: '#228b22' }
        ];
        
        this.statistics = {
            totalSongs: 5,
            totalPlays: 2338,
            totalLikes: 524,
            mostPopular: "Ave Maria"
        };
    }

    getSongs(query = {}) {
        let filteredSongs = [...this.songs];
        
        // Filter by category
        if (query.category && query.category !== 'all') {
            filteredSongs = filteredSongs.filter(song => song.category === query.category);
        }
        
        // Filter by search
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            filteredSongs = filteredSongs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm) ||
                song.lyrics.toLowerCase().includes(searchTerm) ||
                song.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort
        if (query.sort === 'popular') {
            filteredSongs.sort((a, b) => b.playCount - a.playCount);
        } else if (query.sort === 'latest') {
            filteredSongs.sort((a, b) => b.id - a.id);
        } else if (query.sort === 'likes') {
            filteredSongs.sort((a, b) => b.likes - a.likes);
        }
        
        return filteredSongs;
    }

    getSongById(id) {
        return this.songs.find(song => song.id === parseInt(id));
    }

    incrementPlayCount(id) {
        const song = this.getSongById(id);
        if (song) {
            song.playCount++;
            this.statistics.totalPlays++;
            return true;
        }
        return false;
    }

    likeSong(id) {
        const song = this.getSongById(id);
        if (song) {
            song.likes++;
            this.statistics.totalLikes++;
            return song.likes;
        }
        return null;
    }

    getFeaturedSongs() {
        return this.songs.filter(song => song.featured);
    }

    getCategories() {
        return this.categories;
    }

    getStatistics() {
        return this.statistics;
    }
}

const songsDB = new CatholicSongsDatabase();

// ==================== API ROUTES ====================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Catholic Songs API',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API status
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: '🌹 Catholic Songs API - Dedicated to Mary, Mother of Jesus',
        version: '2.0.0',
        data: {
            totalSongs: songsDB.statistics.totalSongs,
            totalPlays: songsDB.statistics.totalPlays,
            totalLikes: songsDB.statistics.totalLikes,
            mostPopular: songsDB.statistics.mostPopular
        }
    });
});

// Get all songs with filtering
app.get('/api/songs', (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        
        const songs = songsDB.getSongs({ category, search, sort });
        
        // Simple pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedSongs = songs.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedSongs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: songs.length,
                pages: Math.ceil(songs.length / limit)
            },
            filters: {
                category,
                search,
                sort
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch songs',
            error: error.message
        });
    }
});

// Get featured songs
app.get('/api/songs/featured', (req, res) => {
    try {
        const featuredSongs = songsDB.getFeaturedSongs();
        res.json({
            success: true,
            data: featuredSongs,
            count: featuredSongs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured songs'
        });
    }
});

// Get single song
app.get('/api/songs/:id', (req, res) => {
    try {
        const song = songsDB.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }
        
        // Increment play count
        songsDB.incrementPlayCount(req.params.id);
        
        res.json({
            success: true,
            data: song
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch song'
        });
    }
});

// Like a song
app.post('/api/songs/:id/like', (req, res) => {
    try {
        const newLikeCount = songsDB.likeSong(req.params.id);
        if (newLikeCount === null) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Song liked successfully',
            likes: newLikeCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to like song'
        });
    }
});

// Get categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = songsDB.getCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});

// Get statistics
app.get('/api/statistics', (req, res) => {
    try {
        const stats = songsDB.getStatistics();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Search songs
app.get('/api/search', (req, res) => {
    try {
        const { q: query } = req.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const results = songsDB.getSongs({ search: query });
        
        res.json({
            success: true,
            data: results,
            query,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed'
        });
    }
});

// Download endpoint (simulated)
app.get('/api/download/:songName', (req, res) => {
    try {
        const { songName } = req.params;
        
        // In a real app, this would serve actual MP3 files
        // For now, we'll simulate the download
        
        res.json({
            success: true,
            message: `Download started for ${songName}`,
            note: 'This is a simulation. In production, actual MP3 files would be served.',
            action: 'Add your Catholic music MP3 files to enable real downloads'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Download failed'
        });
    }
});

// Stream endpoint (simulated)
app.get('/api/stream/:songName', (req, res) => {
    try {
        const { songName } = req.params;
        
        res.json({
            success: true,
            message: `Audio stream for ${songName}`,
            note: 'This is a simulation. Add MP3 files for real audio streaming.',
            action: 'Connect to a real audio streaming service or host MP3 files'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Streaming failed'
        });
    }
});

// ==================== CATHOLIC PRAYERS API ====================

app.get('/api/prayers', (req, res) => {
    const prayers = [
        {
            id: 1,
            title: "Hail Mary",
            prayer: `Hail Mary, full of grace, the Lord is with thee.
Blessed art thou amongst women,
and blessed is the fruit of thy womb, Jesus.
Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death. Amen.`,
            category: "marian"
        },
        {
            id: 2,
            title: "Our Father",
            prayer: `Our Father, who art in heaven,
hallowed be thy name.
Thy kingdom come,
thy will be done,
on earth as it is in heaven.`,
            category: "traditional"
        }
    ];
    
    res.json({
        success: true,
        data: prayers
    });
});

// ==================== ERROR HANDLING ====================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        availableEndpoints: {
            songs: ['GET /api/songs', 'GET /api/songs/featured', 'GET /api/songs/:id', 'POST /api/songs/:id/like'],
            categories: ['GET /api/categories'],
            search: ['GET /api/search'],
            prayers: ['GET /api/prayers'],
            system: ['GET /health', 'GET /api/status', 'GET /api/statistics']
        }
    });
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
});

// ==================== SERVER STARTUP ====================
app.listen(PORT, () => {
    console.log(`
    🌹 CATHOLIC SONGS WEBSITE 🌹
    ===================================
    🚀 Server running on port ${PORT}
    🌐 Frontend: http://localhost:${PORT}
    📚 API: http://localhost:${PORT}/api
    💚 Health: http://localhost:${PORT}/health
    
    📊 Features:
    ✅ ${songsDB.statistics.totalSongs} Catholic songs
    ✅ Marian hymns & traditional prayers  
    ✅ Search and filtering
    ✅ Song statistics & likes
    ✅ Mobile-responsive design
    ✅ Download & streaming endpoints
    
    🙏 Dedicated to Mary, Mother of Jesus
    "My soul magnifies the Lord" - Luke 1:46
    ===================================
    `);
    
    // Log available endpoints
    console.log('\n📋 Available API Endpoints:');
    console.log('   GET  /api/songs           - Get all songs');
    console.log('   GET  /api/songs/featured  - Get featured songs');
    console.log('   GET  /api/songs/:id       - Get specific song');
    console.log('   POST /api/songs/:id/like  - Like a song');
    console.log('   GET  /api/categories      - Get song categories');
    console.log('   GET  /api/search?q=query - Search songs');
    console.log('   GET  /api/prayers         - Get Catholic prayers');
    console.log('   GET  /api/status          - API status');
    console.log('   GET  /health             - Health check');
});

module.exports = app;
