document.addEventListener('DOMContentLoaded', function() {
    // Initialize current date and time
    updateCurrentDateTime();
    
    // Real-time clock update
    setInterval(updateCurrentDateTime, 1000);
    
    // Fetch latest market news on page load
    fetchLatestMarketNews();
    
    // Set up periodic news updates (every 5 minutes)
    setInterval(fetchLatestMarketNews, 300000); // 5 minutes
    
    // Set up more frequent market data updates (every 15 seconds)
    setInterval(updateMarketData, 15000);
    
    // Set up sector performance updates (every minute)
    setInterval(updateSectorPerformance, 60000);
    
    // Load more news button functionality
    document.getElementById('loadMoreNewsBtn').addEventListener('click', loadMoreNews);
    
    // Apply news filters
    document.getElementById('applyNewsFilter').addEventListener('click', applyNewsFilters);
});

// Update the current date and time display
function updateCurrentDateTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    document.getElementById('currentDateTime').textContent = formattedDateTime;
    
    // Also update the sentiment gauge time
    document.querySelector('.sentiment-update').textContent = `Updated: ${months[now.getUTCMonth()]} ${day}, ${year}, ${hours}:${minutes} UTC`;
}

// Months array for formatting
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Fetch the latest market news
function fetchLatestMarketNews() {
    // Show loading indicator
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer.children.length === 0) {
        newsContainer.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Fetching latest market news...</p>
            </div>
        `;
    }
    
    // In a real implementation, this would make an API call to get the latest news
    // For demo purposes, we'll simulate this with a timeout
    setTimeout(() => {
        // Only clear container if this is the initial load
        if (newsContainer.querySelector('.spinner-border')) {
            newsContainer.innerHTML = '';
        }
        
        // Generate current UTC time
        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        
        // Format date for display (e.g., "April 10, 2025")
        const formattedDate = `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
        
        // Generate time strings with slight variations for realistic display
        const time1 = `${formattedDate} - ${String(hours).padStart(2, '0')}:${String(minutes - (minutes % 5)).padStart(2, '0')} UTC`;
        const time2 = `${formattedDate} - ${String(hours).padStart(2, '0')}:${String((minutes - 15 + 60) % 60).padStart(2, '0')} UTC`;
        const time3 = `${formattedDate} - ${String(hours - 1 + 24).padStart(2, '0')}:${String((minutes + 10) % 60).padStart(2, '0')} UTC`;
        
        // Get latest news with current timestamps
        const latestNews = [
            {
                source: 'Bloomberg',
                time: time1,
                category: 'Markets',
                title: 'Global Markets Respond to Latest Economic Indicators',
                excerpt: 'Markets are adjusting positions as new economic data suggests stronger than expected growth in key regions, with technology and financial sectors leading gains.',
                tickers: ['SPY', 'QQQ', 'XLF']
            },
            {
                source: 'Reuters',
                time: time2,
                category: 'Technology',
                title: 'Tech Sector Surges on Positive Earnings Forecasts',
                excerpt: 'Technology companies are seeing significant share price increases as analysts revise earnings forecasts upward following stronger than expected consumer demand.',
                tickers: ['AAPL', 'MSFT', 'GOOG']
            },
            {
                source: 'CNBC',
                time: time3,
                category: 'Cryptocurrency',
                title: 'Cryptocurrency Markets Show Increased Volatility',
                excerpt: 'Digital asset markets are experiencing heightened volatility as traders respond to regulatory developments and increasing institutional participation.',
                tickers: ['BTC', 'ETH', 'SOL']
            },
        ];
        
        // Add news items to the container if it's empty (first load)
        if (newsContainer.children.length === 0) {
            latestNews.forEach((item, index) => {
                addNewsItem(item, index, newsContainer);
            });
        } else {
            // Check if we have new content to add (in a real app, this would compare with existing content)
            // For demo, we'll just add the first item as "breaking news" if appropriate
            const breakingNews = {
                source: 'Breaking News',
                time: `${formattedDate} - ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} UTC`,
                category: 'Markets',
                title: 'BREAKING: Federal Reserve Announces Surprise Policy Change',
                excerpt: 'In an unexpected move, the Federal Reserve has just announced a significant change to its monetary policy approach, citing recent economic data.',
                tickers: ['SPY', 'TLT', 'GLD']
            };
            
            // Only add breaking news occasionally (simulating real updates)
            if (Math.random() > 0.7) { // 30% chance of breaking news
                addNewsItem(breakingNews, -1, newsContainer, true);
            }
        }
    }, 1000);
}

// Add a news item to the container with animation
function addNewsItem(item, index, container, isBreaking = false) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item' + (isBreaking ? ' breaking-news' : '');
    newsItem.style.opacity = '0';
    newsItem.style.transform = 'translateY(20px)';
    
    newsItem.innerHTML = `
        ${isBreaking ? '<div class="breaking-news-banner">Breaking News</div>' : ''}
        <div class="news-meta">
            <span class="news-source"><i class="fas fa-newspaper"></i> ${item.source}</span>
            <span class="news-time"><i class="far fa-clock"></i> ${item.time}</span>
            <span class="news-category"><i class="fas fa-tag"></i> ${item.category}</span>
        </div>
        <h4 class="news-title">${item.title}</h4>
        <p class="news-excerpt">${item.excerpt}</p>
        <div class="news-tickers">
            <span>Related: </span>
            ${item.tickers.map(ticker => `<a href="#" class="ticker-tag">$${ticker}</a>`).join(' ')}
        </div>
        <a href="#" class="news-read-more">Read Full Article <i class="fas fa-external-link-alt"></i></a>
    `;
    
    // Add breaking news at the top, other news at the appropriate position
    if (isBreaking) {
        container.insertBefore(newsItem, container.firstChild);
    } else {
        container.appendChild(newsItem);
    }
    
    // Staggered animation
    setTimeout(() => {
        newsItem.style.transition = 'all 0.5s ease';
        newsItem.style.opacity = '1';
        newsItem.style.transform = 'translateY(0)';
    }, isBreaking ? 100 : 100 * (index + 1));
    
    // If it's breaking news, add highlight effect
    if (isBreaking) {
        setTimeout(() => {
            newsItem.classList.add('highlight-pulse');
            setTimeout(() => {
                newsItem.classList.remove('highlight-pulse');
            }, 3000);
        }, 500);
    }
}

// Load more news functionality
function loadMoreNews() {
    const loadMoreButton = document.getElementById('loadMoreNewsBtn');
    loadMoreButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    
    // In a real implementation, this would fetch the next page of news
    // For demo, we'll simulate with a timeout
    setTimeout(() => {
        const newsContainer = document.getElementById('newsContainer');
        
        // Generate current UTC time
        const now = new Date();
        const formattedDate = `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
        const hours = (now.getUTCHours() - 2 + 24) % 24; // Earlier news (2 hours ago)
        
        // Generate older news with appropriate timestamps
        const olderNews = [
            {
                source: 'Financial Times',
                time: `${formattedDate} - ${String(hours).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`,
                category: 'Economy',
                title: 'Consumer Confidence Index Shows Unexpected Rise',
                excerpt: 'The latest consumer confidence data indicates a significant improvement in economic outlook among households, potentially signaling stronger retail spending.',
                tickers: ['XLY', 'XRT', 'WMT']
            },
            {
                source: 'Wall Street Journal',
                time: `${formattedDate} - ${String(hours).padStart(2, '0')}:${String((now.getUTCMinutes() - 25 + 60) % 60).padStart(2, '0')} UTC`,
                category: 'Energy',
                title: 'Oil Prices Fluctuate as Supply Concerns Emerge',
                excerpt: 'Crude oil markets are seeing increased volatility as new supply constraints coincide with changing demand forecasts in major economies.',
                tickers: ['XLE', 'CVX', 'XOM']
            },
            {
                source: 'MarketWatch',
                time: `${formattedDate} - ${String(hours).padStart(2, '0')}:${String((now.getUTCMinutes() - 45 + 60) % 60).padStart(2, '0')} UTC`,
                category: 'Healthcare',
                title: 'Healthcare Sector Rallies on New Treatment Approvals',
                excerpt: 'Major pharmaceutical companies are seeing share price increases following regulatory approval for several key treatments targeting chronic conditions.',
                tickers: ['XLV', 'JNJ', 'PFE']
            }
        ];
        
        // Add older news items with animation
        olderNews.forEach((item, index) => {
            addNewsItem(item, index, newsContainer);
        });
        
        // Reset button text
        loadMoreButton.textContent = 'Load More News';
    }, 1500);
}

// Update market data with real-time simulation
function updateMarketData() {
    const indices = [
        {
            selector: '.index-card:nth-child(1)',
            name: 'S&P 500',
            price: 5432.18
        },
        {
            selector: '.index-card:nth-child(2)',
            name: 'NASDAQ',
            price: 18768.54
        },
        {
            selector: '.index-card:nth-child(3)',
            name: 'DOW JONES',
            price: 42135.76
        },
        {
            selector: '.index-card:nth-child(4)',
            name: 'RUSSELL 2000',
            price: 2486.23
        }
    ];
    
    indices.forEach(index => {
        const indexCard = document.querySelector(index.selector);
        if (!indexCard) return;  // Skip if element not found
        
        const priceElement = indexCard.querySelector('.price');
        const changeElement = indexCard.querySelector('.change');
        const chartElement = indexCard.querySelector('.mini-chart div');
        
        if (!priceElement || !changeElement || !chartElement) return;
        
        // Generate realistic price movements (smaller, more realistic changes)
        const volatility = 0.15; // Lower volatility for more realistic movements
        const changeAmount = (Math.random() * volatility * 2 - volatility).toFixed(2);
        const newPrice = (index.price + parseFloat(changeAmount)).toFixed(2);
        const newPercent = (parseFloat(changeAmount) / newPrice * 100).toFixed(2);
        const isPositive = parseFloat(changeAmount) >= 0;
        
        // Flash animation for price changes
        priceElement.classList.add(isPositive ? 'flash-positive' : 'flash-negative');
        
        // Update displayed values with the new price information
        priceElement.textContent = Intl.NumberFormat('en-US').format(newPrice);
        changeElement.textContent = `${isPositive ? '+' : ''}${changeAmount} (${isPositive ? '+' : ''}${newPercent}%)`;
        changeElement.className = `change ${isPositive ? 'positive' : 'negative'}`;
        chartElement.className = isPositive ? 'chart-up' : 'chart-down';
        
        // Remove flash animation after a delay
        setTimeout(() => {
            priceElement.classList.remove('flash-positive', 'flash-negative');
        }, 1000);
    });
}

// Update sector performance with real-time data
function updateSectorPerformance() {
    const sectors = document.querySelectorAll('.sector-item');
    
    sectors.forEach(sector => {
        const sectorValueElement = sector.querySelector('.sector-value');
        if (!sectorValueElement) return;
        
        // Get current percentage
        const currentValue = parseFloat(sectorValueElement.textContent);
        
        // Generate small random change
        const change = (Math.random() * 0.4 - 0.2).toFixed(1); // Small movements
        const newValue = (currentValue + parseFloat(change)).toFixed(1);
        const isPositive = parseFloat(newValue) >= 0;
        
        // Update value and classes
        sectorValueElement.textContent = `${isPositive ? '+' : ''}${newValue}%`;
        sectorValueElement.className = `sector-value ${isPositive ? 'positive' : 'negative'}`;
        sectorValueElement.style.width = `${Math.abs(parseFloat(newValue) * 20 + 40)}%`; // Scale for visual display
        
        // Brief highlight effect for changes
        sectorValueElement.classList.add(change > 0 ? 'flash-positive' : 'flash-negative');
        setTimeout(() => {
            sectorValueElement.classList.remove('flash-positive', 'flash-negative');
        }, 1000);
    });
    
    // Update sentiment gauge occasionally
    if (Math.random() > 0.7) {
        updateSentimentGauge();
    }
}

// Update market sentiment gauge
function updateSentimentGauge() {
    const gaugeElement = document.querySelector('.gauge-value');
    const scoreElement = document.querySelector('.gauge-score');
    if (!gaugeElement || !scoreElement) return;
    
    // Get current sentiment value
    const currentWidth = parseInt(gaugeElement.style.width) || 65;
    
    // Generate small random change
    const change = Math.random() * 6 - 3; // Smaller movements
    const newWidth = Math.max(10, Math.min(90, currentWidth + change)); // Keep between 10% and 90%
    
    // Update the gauge display
    gaugeElement.style.width = `${newWidth}%`;
    scoreElement.textContent = `${Math.round(newWidth)}% ${newWidth > 50 ? 'Bullish' : 'Bearish'}`;
    
    // Adjust position of the score label
    scoreElement.style.left = `${newWidth}%`;
}

// Apply news filters functionality
function applyNewsFilters() {
    const category = document.getElementById('newsCategory').value;
    const source = document.getElementById('newsSource').value;
    const timeframe = document.getElementById('newsTimeframe').value;
    
    // Show loading spinner
    document.getElementById('newsContainer').innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Filtering news...</p>
        </div>
    `;
    
    // In a real implementation, this would filter news from an API
    // For demo, simulate with timeout
    setTimeout(() => {
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';
        
        // Create filter tag indicator
        if (category !== 'all' || source !== 'all' || timeframe !== 'today') {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag mb-3';
            filterTag.innerHTML = `
                <span>Filtered by: </span>
                ${category !== 'all' ? `<span class="badge bg-primary me-2">${category}</span>` : ''}
                ${source !== 'all' ? `<span class="badge bg-info me-2">${source}</span>` : ''}
                ${timeframe !== 'today' ? `<span class="badge bg-secondary me-2">${timeframe}</span>` : ''}
                <button class="btn btn-sm btn-outline-light ms-2" id="clearFiltersBtn">Clear Filters</button>
            `;
            newsContainer.appendChild(filterTag);
            
            // Add clear filters functionality
            document.getElementById('clearFiltersBtn').addEventListener('click', function() {
                document.getElementById('newsCategory').value = 'all';
                document.getElementById('newsSource').value = 'all';
                document.getElementById('newsTimeframe').value = 'today';
                applyNewsFilters();
            });
        }
        
        // For the demo, generate some filtered results based on selected criteria
        fetchFilteredNews(category, source, timeframe);
    }, 1000);
}

// Fetch filtered news based on criteria
function fetchFilteredNews(category, source, timeframe) {
    const newsContainer = document.getElementById('newsContainer');
    const filterTag = newsContainer.querySelector('.filter-tag');
    
    // Generate current UTC time
    const now = new Date();
    const formattedDate = `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
    
    // Generate news that would match the filters
    const allNews = [
        // Stocks category
        {
            source: 'Bloomberg',
            time: `${formattedDate} - ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`,
            category: 'Stocks',
            title: 'Market Volatility Increases as Earnings Season Approaches',
            excerpt: 'Stock markets are experiencing increased volatility as investors position ahead of the upcoming earnings season, with focus on technology and financial sectors.',
            tickers: ['VIX', 'SPY', 'QQQ']
        },
        // Technology category
        {
            source: 'Reuters',
            time: `${formattedDate} - ${String(now.getUTCHours()).padStart(2, '0')}:${String((now.getUTCMinutes() - 30 + 60) % 60).padStart(2, '0')} UTC`,
            category: 'Technology',
            title: 'Semiconductor Supply Chain Showing Signs of Improvement',
            excerpt: 'The global semiconductor supply chain is showing significant signs of improvement, with manufacturers reporting increased production capacity and shorter lead times.',
            tickers: ['SMH', 'SOXX', 'TSM']
        },
        // Cryptocurrency category
        {
            source: 'CNBC',
            time: `${formattedDate} - ${String(now.getUTCHours() - 1).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`,
            category: 'Cryptocurrency',
            title: 'New Regulatory Framework Proposed for Digital Assets',
            excerpt: 'Lawmakers have introduced a comprehensive regulatory framework for digital assets, aiming to provide clarity for the cryptocurrency industry while ensuring consumer protection.',
            tickers: ['BTC', 'ETH', 'COIN']
        },
    ];
    
    // Filter based on selected criteria
    const filteredNews = allNews.filter(item => {
        if (category !== 'all' && item.category.toLowerCase() !== category.toLowerCase()) {
            return false;
        }
        if (source !== 'all' && !item.source.toLowerCase().includes(source.toLowerCase())) {
            return false;
        }
        // Simple timeframe filtering (in a real app, this would be more sophisticated)
        if (timeframe !== 'today') {
            return false; // Just for demo purposes, only showing "today" news
        }
        return true;
    });
    
    // Display filtered news
    if (filteredNews.length > 0) {
        filteredNews.forEach((item, index) => {
            addNewsItem(item, index, newsContainer, false);
        });
    } else {
        // No results message
        const noResults = document.createElement('div');
        noResults.className = 'no-results text-center my-5';
        noResults.innerHTML = `
            <i class="fas fa-search fa-3x mb-3"></i>
            <h5>No news found matching your filters</h5>
            <p class="text-muted">Try adjusting your filter criteria</p>
            <button class="btn btn-outline-light mt-3" id="resetFiltersBtn">Reset Filters</button>
        `;
        newsContainer.appendChild(noResults);
        
        // Reset filters functionality
        document.getElementById('resetFiltersBtn').addEventListener('click', function() {
            document.getElementById('newsCategory').value = 'all';
            document.getElementById('newsSource').value = 'all';
            document.getElementById('newsTimeframe').value = 'today';
            applyNewsFilters();
        });
    }
}