document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeToggleBtn.textContent = '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    });

    // --- 2. Scroll Reveal Animations ---
    // Uses Intersection Observer to fade and slide elements in as you scroll down
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once revealed to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Copy IP to Clipboard with Animation ---
    const copyBtn = document.getElementById('copy-btn');
    const ipText = document.getElementById('ip-text').textContent;

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(ipText).then(() => {
            const originalText = copyBtn.textContent;
            
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copy-success');

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copy-success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            copyBtn.textContent = 'Failed';
        });
    });

    // --- 4. Live Server Status & Player Count ---
    const serverIP = 'ChickenCity.serverr.de';
    const statusText = document.getElementById('server-status');
    const statusDot = document.getElementById('status-dot');
    const refreshBtn = document.getElementById('refresh-status');

    function fetchServerStatus() {
        statusText.textContent = 'Pinging server...';
        refreshBtn.classList.add('spinning');
        
        fetch(`https://api.mcsrvstat.us/2/${serverIP}`)
            .then(response => response.json())
            .then(data => {
                refreshBtn.classList.remove('spinning');
                if (data.online) {
                    statusDot.classList.add('online');
                    statusDot.classList.remove('offline');
                    statusText.innerHTML = `Online: <span style="color: var(--accent-color);">${data.players.online}</span> / ${data.players.max} players`;
                } else {
                    statusDot.classList.add('offline');
                    statusDot.classList.remove('online');
                    statusText.textContent = 'Server is currently offline.';
                }
            })
            .catch(error => {
                console.error('Error fetching server status:', error);
                refreshBtn.classList.remove('spinning');
                statusText.textContent = 'Error loading status.';
                statusDot.classList.add('offline');
            });
    }

    refreshBtn.addEventListener('click', fetchServerStatus);
    fetchServerStatus();

    const newsGrid = document.getElementById('news-grid');
    const eventsGrid = document.getElementById('events-grid');
    
    // Load data from data.js
    const posts = siteData.posts || [];
    const events = siteData.events || [];
    
    // Render News Posts (sorted by date, newest first)
    if (posts.length === 0) {
        newsGrid.innerHTML = `
            <div class="card news-card" style="text-align: center; grid-column: 1 / -1;">
                <p style="color: var(--text-secondary); font-size: 1.1rem;">📰 No news at this time</p>
                <p style="color: var(--text-secondary); margin-top: 10px; opacity: 0.7;">Check back later for updates!</p>
            </div>
        `;
    } else {
        // Sort posts by date (newest first)
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        newsGrid.innerHTML = sortedPosts.map(post => `
            <div class="card news-card hover-glow">
                <span class="news-date">${formatDate(post.date)}</span>
                <h3>${post.title}</h3>
                <p class="news-excerpt">${post.excerpt}</p>
                <a href="post.html?id=${post.id}" class="read-more">Read more →</a>
            </div>
        `).join('');
    }
    
    // Render Events
    if (events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="card event-card" style="text-align: center; grid-column: 1 / -1;">
                <p style="color: var(--text-secondary); font-size: 1.1rem;">⏳ No events scheduled</p>
                <p style="color: var(--text-secondary); margin-top: 10px; opacity: 0.7;">We're still in Early Access! Events will start once the server is fully launched.</p>
            </div>
        `;
    } else {
        const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        eventsGrid.innerHTML = sortedEvents.map(event => `
            <div class="card event-card hover-glow">
                <span class="event-date-badge">${formatDate(event.date)}</span>
                <h3 class="event-name">${event.name}</h3>
                <p class="event-desc">${event.description}</p>
                ${event.time ? `<p class="event-time">🕒 ${event.time}</p>` : ''}
            </div>
        `).join('');
    }

    // --- Helper Functions ---
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
});