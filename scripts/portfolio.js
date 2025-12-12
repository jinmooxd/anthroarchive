// Portfolio Page Main Logic

let archiveData = [];

// Fetch and load archive items data
async function loadArchiveData() {
    try {
        const response = await fetch('data/archive-items.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        archiveData = await response.json();
        console.log('Archive data loaded:', archiveData);
        
        // Validate data structure
        if (!archiveData.items || !Array.isArray(archiveData.items)) {
            throw new Error('Invalid data structure: items array not found');
        }
        
        console.log(`Loaded ${archiveData.items.length} items`);
        renderPortfolioItems();
    } catch (error) {
        console.error('Error loading archive data:', error);
        console.error('Error details:', error.message);
        
        // Show error message to user
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = `
                <div class="error-message">
                    <p>Unable to load archive items.</p>
                    <p style="font-size: 0.9em; color: #999; margin-top: 0.5rem;">
                        Please make sure you're running a local server (not opening files directly).<br>
                        Error: ${error.message}
                    </p>
                </div>
            `;
        }
    }
}

// Render portfolio items dynamically
function renderPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    if (!portfolioGrid) {
        console.error('Portfolio grid element not found!');
        return;
    }
    
    // Clear existing content
    portfolioGrid.innerHTML = '';
    
    // Check if we have data
    const items = archiveData.items || [];
    
    console.log('Rendering portfolio items. Items count:', items.length);
    
    if (items.length === 0) {
        // Show message if no items found
        portfolioGrid.innerHTML = `
            <div class="no-items-message">
                <p>No archive items found.</p>
                <p style="font-size: 0.9em; color: #999; margin-top: 0.5rem;">
                    Please check that archive-items.json contains items.<br>
                    Make sure you're running a local server (not opening files directly).
                </p>
            </div>
        `;
        return;
    }
    
    // Render each portfolio item
    items.forEach((item, index) => {
        const itemElement = createPortfolioItem(item, index);
        portfolioGrid.appendChild(itemElement);
    });
    
    // Initialize scroll animations after items are rendered
    setTimeout(() => {
        if (window.initializeScrollAnimations) {
            initializeScrollAnimations();
        }
    }, 100);
}

// Create individual portfolio item element
function createPortfolioItem(item, index) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'portfolio-item';
    itemDiv.setAttribute('data-item-id', item.id);
    
    const imageUrl = item.image || 'assets/images/portfolio/placeholder.jpg';
    itemDiv.innerHTML = `
        <div class="portfolio-item-image-wrapper">
            <img 
                src="${imageUrl}" 
                alt="${item.name || 'Extinct Species'}"
                class="portfolio-item-image"
                loading="lazy"
                crossorigin="anonymous"
                onerror="handlePortfolioImageError(this, '${imageUrl}', ${item.id})"
            >
            <div class="portfolio-item-overlay">
                <h3 class="portfolio-item-name">${item.name || 'Unknown Species'}</h3>
                <p class="portfolio-item-habitat">${item.habitat || 'Unknown Habitat'}</p>
                <p class="portfolio-item-date">Extinct: ${item.extinctDate || 'Unknown'}</p>
            </div>
        </div>
    `;
    
    // Add click handler to open modal
    itemDiv.addEventListener('click', function() {
        openModal(item);
    });
    
    return itemDiv;
}

// Open modal with item details (to be implemented in modal.js)
function openModal(item) {
    // This will be handled by modal.js
    if (window.openModal) {
        window.openModal(item);
    }
}

// Check if we're using file:// protocol (which blocks fetch)
function checkProtocol() {
    if (window.location.protocol === 'file:') {
        console.warn('⚠️ File protocol detected. Fetch requests may be blocked.');
        console.warn('Please use a local server instead:');
        console.warn('  python -m http.server 8000');
        console.warn('  or: npx http-server');
        return false;
    }
    return true;
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Warn if using file:// protocol
    if (!checkProtocol()) {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Cannot load archive items</p>
                    <p style="font-size: 0.9em; color: #999; margin-top: 1rem; line-height: 1.6;">
                        You're opening this file directly, which blocks data loading.<br><br>
                        <strong>Please use a local server:</strong><br>
                        <code style="background: #eee; padding: 0.25rem 0.5rem; border-radius: 3px;">
                            python -m http.server 8000
                        </code><br>
                        Then visit: <code style="background: #eee; padding: 0.25rem 0.5rem; border-radius: 3px;">
                            http://localhost:8000
                        </code>
                    </p>
                </div>
            `;
        }
        return;
    }
    
    loadArchiveData();
});

// Handle portfolio image loading errors (similar to modal error handling)
function handlePortfolioImageError(imgElement, originalUrl, itemId) {
    if (!imgElement) return;
    
    // Track how many fallback attempts we've made
    const attemptCount = parseInt(imgElement.dataset.fallbackAttempts || '0');
    
    // If we've tried all fallbacks, use placeholder
    if (attemptCount >= 3) {
        imgElement.src = 'https://picsum.photos/800/600?random=' + itemId;
        imgElement.style.opacity = '0.7';
        console.warn(`Image failed to load after ${attemptCount} attempts for item ${itemId}:`, originalUrl);
        return;
    }
    
    // Increment attempt counter
    imgElement.dataset.fallbackAttempts = (attemptCount + 1).toString();
    
    // Try alternative Wikimedia Commons URL formats
    if (originalUrl && originalUrl.includes('wikimedia.org')) {
        try {
            // Extract the path after /commons/
            const commonsMatch = originalUrl.match(/\/commons\/(.+)$/);
            if (commonsMatch) {
                const pathAfterCommons = commonsMatch[1];
                
                if (attemptCount === 0) {
                    // Try 1: Use the path directly with upload.wikimedia.org
                    const directUrl = `https://upload.wikimedia.org/wikipedia/commons/${pathAfterCommons}`;
                    imgElement.src = directUrl;
                    return;
                } else if (attemptCount === 1) {
                    // Try 2: Ensure HTTPS
                    const httpsUrl = originalUrl.replace(/^http:/, 'https:');
                    imgElement.src = httpsUrl;
                    return;
                } else if (attemptCount === 2) {
                    // Try 3: Use placeholder
                    imgElement.src = 'https://picsum.photos/800/600?random=' + itemId;
                    return;
                }
            }
        } catch (e) {
            console.warn('Error processing Wikimedia URL:', e);
        }
    } else {
        // Not a Wikimedia URL, use placeholder
        imgElement.src = 'https://picsum.photos/800/600?random=' + itemId;
    }
}

// Export for use in other scripts
window.portfolioData = {
    getItemById: function(id) {
        return archiveData.items?.find(item => item.id === id);
    },
    getAllItems: function() {
        return archiveData.items || [];
    }
};

// Export error handler globally
window.handlePortfolioImageError = handlePortfolioImageError;

