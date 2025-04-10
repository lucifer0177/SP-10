// Trading Economics API integration
const API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
const BASE_URL = 'https://api.tradingeconomics.com';

// Fetch economic calendar data
async function fetchEconomicCalendar() {
    try {
        const response = await fetch(`${BASE_URL}/calendar?c=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching economic calendar:', error);
        return [];
    }
}

// Fetch market news
async function fetchMarketNews() {
    try {
        const response = await fetch(`${BASE_URL}/news?c=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching market news:', error);
        return [];
    }
}

// Display economic calendar
function displayEconomicCalendar(events) {
    const calendarContainer = document.querySelector('.economic-calendar');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = events.map(event => `
        <div class="event-item">
            <div class="event-time">${new Date(event.Date).toLocaleTimeString()}</div>
            <div class="event-details">
                <span class="event-name">${event.Country} - ${event.Event}</span>
                <span class="event-importance ${getImportanceClass(event.Importance)}">${getImportanceText(event.Importance)}</span>
            </div>
        </div>
    `).join('');
}

// Display market news
function displayMarketNews(news) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    newsContainer.innerHTML = news.map(item => `
        <div class="news-item">
            <div class="news-source">${item.source}</div>
            <h6 class="news-title">${item.title}</h6>
            <p class="news-description">${item.description}</p>
            <div class="news-footer">
                <span class="news-date">${new Date(item.date).toLocaleString()}</span>
                <a href="${item.url}" target="_blank" class="news-link">Read more</a>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getImportanceClass(importance) {
    if (importance >= 3) return 'high';
    if (importance >= 2) return 'medium';
    return 'low';
}

function getImportanceText(importance) {
    if (importance >= 3) return 'High';
    if (importance >= 2) return 'Medium';
    return 'Low';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const [calendarEvents, marketNews] = await Promise.all([
        fetchEconomicCalendar(),
        fetchMarketNews()
    ]);
    
    displayEconomicCalendar(calendarEvents);
    displayMarketNews(marketNews);
    
    // Update every 5 minutes
    setInterval(async () => {
        const [updatedCalendar, updatedNews] = await Promise.all([
            fetchEconomicCalendar(),
            fetchMarketNews()
        ]);
        displayEconomicCalendar(updatedCalendar);
        displayMarketNews(updatedNews);
    }, 300000);
});
