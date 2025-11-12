// Catholic Songs Website - Complete Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    console.log('🌹 Mary\'s Garden of Song - Website Initialized');
    
    // Initialize all interactive features
    setupNavigation();
    setupSongInteractions();
    setupVideoInteractions();
    setupPrayerFeatures();
    setupMobileMenu();
    setupMobileFixes();
    
    // New enhanced features
    initEnhancedFeatures();
    
    // Load songs from backend
    updateSongDisplay();
    
    showWelcomeMessage();
}

// Mobile-specific fixes
function setupMobileFixes() {
    // Prevent zoom on double-tap
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Fix hover states on touch devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Improve touch scrolling
    document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Navigation smooth scrolling
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Song interactions (like, play, lyrics, download)
function setupSongInteractions() {
    const likeButtons = document.querySelectorAll('.song-like');
    const playButtons = document.querySelectorAll('.btn-play');
    const lyricsButtons = document.querySelectorAll('.btn-lyrics');
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    // Like functionality
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#e53e3e'; // Red color for liked
                showNotification('Song added to favorites! 💖');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showNotification('Song removed from favorites');
            }
        });
    });
    
    // Play button functionality
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const songCard = this.closest('.song-card');
            const songTitle = songCard.querySelector('.song-title').textContent;
            const songArtist = songCard.querySelector('.song-artist').textContent;
            
            showNotification(`🎵 Now playing: ${songTitle} by ${songArtist}`);
            
            // Simulate play action
            simulateAudioPlayback(songTitle);
        });
    });
    
    // Lyrics button functionality
    lyricsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const songCard = this.closest('.song-card');
            const songTitle = songCard.querySelector('.song-title').textContent;
            
            showLyricsModal(songTitle);
        });
    });

    // Download button functionality
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const songCard = this.closest('.song-card');
            const songTitle = songCard.querySelector('.song-title').textContent;
            
            downloadSong(songTitle);
        });
    });
}

// Video interactions
function setupVideoInteractions() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('h3').textContent;
            showNotification(`🎬 Opening: ${videoTitle}`);
            
            // In real app, this would open video player
            setTimeout(() => {
                showNotification('📺 Video player would open here with Catholic content');
            }, 1000);
        });
    });
}

// Prayer features
function setupPrayerFeatures() {
    const prayerCard = document.querySelector('.prayer-card');
    const prayButton = document.querySelector('.btn-pray');
    let prayerCount = 0;
    
    if (prayButton) {
        prayButton.addEventListener('click', function() {
            prayerCount++;
            const countDisplay = document.querySelector('.count');
            if (countDisplay) {
                countDisplay.textContent = prayerCount;
            }
            
            if (prayerCount % 10 === 0) {
                showNotification(`🎉 ${prayerCount} prayers completed! Our Lady is pleased!`);
            } else {
                showNotification('🙏 Prayer counted! Hail Mary, full of grace...');
            }
            
            // Add visual feedback
            prayerCard.classList.add('prayer-active');
            setTimeout(() => {
                prayerCard.classList.remove('prayer-active');
            }, 500);
        });
    }
}

// Mobile menu for responsive design
function setupMobileMenu() {
    // This would be expanded for mobile hamburger menu
    console.log('Mobile menu setup ready');
}

// Download song function
function downloadSong(songTitle) {
    showNotification(`⬇️ Starting download: ${songTitle}`);
    
    // Simulate download progress
    simulateDownload(songTitle);
}

// Simulate download (replace with real backend call)
function simulateDownload(songTitle) {
    showNotification(`📥 Downloading: ${songTitle}.mp3`);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        showNotification(`📥 Downloading ${songTitle}: ${progress}%`);
        
        if (progress >= 100) {
            clearInterval(interval);
            showNotification(`✅ Download complete: ${songTitle}.mp3`);
            
            // Create a fake download link
            createFakeDownload(songTitle);
        }
    }, 200);
}

// Create fake download for demo
function createFakeDownload(songTitle) {
    const fakeContent = `Catholic Song: ${songTitle}

Lyrics and music for personal prayer and worship.

This is a demo download from:
Mary's Garden of Song
Dedicated to Mary, Mother of Jesus

"My soul magnifies the Lord" - Luke 1:46`;
    
    const blob = new Blob([fakeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show welcome message
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Welcome to Mary\'s Garden of Song! 🌹');
    }, 1000);
}

// Notification system
function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--marian-blue);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Simulate audio playback
function simulateAudioPlayback(songTitle) {
    console.log(`🎵 Playing: ${songTitle}`);
    showNotification(`🔊 Now playing: ${songTitle} - Audio simulation`);
}

// Show lyrics modal
function showLyricsModal(songTitle) {
    const lyrics = getSongLyrics(songTitle);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'lyrics-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${songTitle} - Lyrics</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <pre>${lyrics}</pre>
            </div>
            <div class="modal-footer">
                <button class="btn-primary close-lyrics-btn">Close</button>
            </div>
        </div>
    `;
    
    // Close functionality
    const closeBtn = modal.querySelector('.close-modal');
    const closeBtn2 = modal.querySelector('.close-lyrics-btn');
    
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    closeBtn2.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

// Get song lyrics (sample data)
function getSongLyrics(songTitle) {
    const lyricsData = {
        "Ave Maria": `Ave Maria, gratia plena
Dominus tecum
Benedicta tu in mulieribus
Et benedictus fructus ventris tui, Jesus

Sancta Maria, Mater Dei
Ora pro nobis peccatoribus
Nunc et in hora mortis nostrae
Amen`,

        "Hail Holy Queen": `Hail, holy Queen, Mother of Mercy
Hail, our life, our sweetness and our hope
To thee do we cry, poor banished children of Eve
To thee do we send up our sighs
Mourning and weeping in this valley of tears

Turn then, most gracious advocate
Thine eyes of mercy toward us
And after this our exile
Show unto us the blessed fruit of thy womb, Jesus
O clement, O loving, O sweet Virgin Mary`,

        "Immaculate Mary": `Immaculate Mary, your praises we sing
You reign now in splendor with Jesus our King
Ave, ave, ave, Maria
Ave, ave, Maria

In heaven the blessed your glory proclaim
On earth we your children invoke your sweet name
Ave, ave, ave, Maria
Ave, ave, Maria`,

        "Were You There": `Were you there when they crucified my Lord?
Were you there when they crucified my Lord?
Oh, sometimes it causes me to tremble, tremble, tremble
Were you there when they crucified my Lord?

Were you there when they laid him in the tomb?
Were you there when they laid him in the tomb?
Oh, sometimes it causes me to tremble, tremble, tremble
Were you there when they laid him in the tomb?`
    };
    
    return lyricsData[songTitle] || "Lyrics not available for this song.";
}

// ===== ENHANCED FEATURES =====

// Enhanced features initialization
function initEnhancedFeatures() {
    setupSearch();
    setupDarkMode();
    setupAudioPlayer();
    setupCatholicCalendar();
    
    console.log('🌟 Enhanced Catholic features loaded!');
}

// Add search functionality
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.placeholder = '🔍 Search songs, artists, lyrics...';
    searchInput.className = 'search-input';
    
    // Add search to hero section
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
        heroActions.parentNode.insertBefore(searchInput, heroActions);
    }

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterSongs(searchTerm);
    });
}

function filterSongs(searchTerm) {
    const songCards = document.querySelectorAll('.song-card');
    let visibleCount = 0;
    
    songCards.forEach(card => {
        const title = card.querySelector('.song-title').textContent.toLowerCase();
        const artist = card.querySelector('.song-artist').textContent.toLowerCase();
        const description = card.querySelector('.song-description').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       artist.includes(searchTerm) || 
                       description.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
    });

    // Show message if no results
    if (searchTerm && visibleCount === 0) {
        showNotification('No songs found matching your search');
    }
}

// Add dark mode toggle
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.title = 'Toggle Dark Mode';
    
    // Add to navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.appendChild(darkModeToggle);
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        showNotification(document.body.classList.contains('dark-mode') ? 
            'Dark mode activated' : 'Light mode activated');
    });
}

// Audio player setup
function setupAudioPlayer() {
    console.log('Audio player setup ready for real MP3 files');
}

// Catholic calendar feature
function setupCatholicCalendar() {
    const today = new Date();
    const liturgicalSeasons = {
        '12-25': '🎄 Christmas',
        '03-19': '👑 St. Joseph',
        '08-15': '👑 Assumption of Mary',
        '11-01': '😇 All Saints Day'
    };
    
    const todayKey = `${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    if (liturgicalSeasons[todayKey]) {
        setTimeout(() => {
            showNotification(`📅 Today: ${liturgicalSeasons[todayKey]}`);
        }, 2000);
    }
}

// Backend integration
const API_BASE = 'http://localhost:3000/api';

// Fetch songs from backend
async function loadSongsFromBackend() {
    try {
        const response = await fetch(`${API_BASE}/songs`);
        const result = await response.json();
        
        if (result.success) {
            console.log('🎵 Loaded songs from backend:', result.data);
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('❌ Failed to load songs from backend:', error);
        // Fallback to sample data
        return getSampleSongs();
    }
}

function getSampleSongs() {
    return [
        {
            id: 1,
            title: "Ave Maria",
            artist: "Traditional",
            category: "marian",
            lyrics: "Ave Maria, gratia plena...",
            likes: 25,
            playCount: 150
        }
    ];
}

// Update song display to use backend data
async function updateSongDisplay() {
    try {
        const songs = await loadSongsFromBackend();
        // In a real app, you would update the DOM with backend data
        console.log('Songs loaded:', songs);
    } catch (error) {
        console.log('Using sample data for display');
    }
}

// Add CSS animations
function addAnimationsToCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .prayer-active {
            transform: scale(1.02);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .modal-content pre {
            white-space: pre-wrap;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations when script loads
addAnimationsToCSS();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp };
}
