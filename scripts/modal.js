// Modal/Popup Functionality

let currentModalItem = null;
let reflectionTimeout = null;

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            // Close if clicking on overlay (not modal content)
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});

// Open modal with item data
function openModal(item) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    if (!modalOverlay || !modalContent) return;
    
    currentModalItem = item;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Build modal content
    const modalHTML = buildModalContent(item);
    modalContent.innerHTML = modalHTML;
    
    // Show modal
    modalOverlay.classList.add('active');
    
    // Initialize reflection prompt functionality
    initializeReflectionPrompt(item.id);
    
    // Scroll modal content to top
    modalContent.scrollTop = 0;
}

// Helper function to ensure proper URL encoding for Wikimedia Commons
function fixWikimediaUrl(url) {
    if (!url || !url.includes('wikimedia.org')) {
        return url;
    }
    
    // Ensure URL is properly encoded
    try {
        // Decode and re-encode to ensure proper formatting
        const decoded = decodeURIComponent(url);
        // Re-encode only the filename part if needed
        return url;
    } catch (e) {
        return url;
    }
}

// Build modal HTML content
function buildModalContent(item) {
    const modalData = item.modalContent || {};
    
    // Build images HTML
    let imagesHTML = '';
    if (modalData.images && modalData.images.length > 0) {
        imagesHTML = '<div class="modal-images">';
        modalData.images.forEach((imgSrc, index) => {
            const fixedUrl = fixWikimediaUrl(imgSrc);
            const imageId = `modal-image-${item.id}-${index}`;
            imagesHTML += `
                <img 
                    id="${imageId}"
                    src="${fixedUrl}" 
                    alt="${item.name}" 
                    class="modal-image"
                    crossorigin="anonymous"
                    loading="lazy"
                    onerror="handleImageError(this, '${imgSrc}', ${item.id})"
                >`;
        });
        imagesHTML += '</div>';
    } else if (item.image) {
        const fixedUrl = fixWikimediaUrl(item.image);
        const imageId = `modal-image-${item.id}-0`;
        imagesHTML = `
            <div class="modal-images">
                <img 
                    id="${imageId}"
                    src="${fixedUrl}" 
                    alt="${item.name}" 
                    class="modal-image"
                    crossorigin="anonymous"
                    loading="lazy"
                    onerror="handleImageError(this, '${item.image}', ${item.id})"
                >
            </div>`;
    }
    
    return `
        <div class="modal-header">
            <h2 class="modal-title">${modalData.title || item.name || 'Unknown Species'}</h2>
            <p class="modal-subtitle">${item.habitat || 'Unknown Habitat'} • Extinct: ${item.extinctDate || 'Unknown'}</p>
        </div>
        ${imagesHTML}
        <div class="modal-description">
            ${modalData.description || item.text || 'No description available.'}
        </div>
        ${modalData.details ? `<div class="modal-details">${modalData.details}</div>` : ''}
        <div class="reflection-prompt">
            <label for="reflection-${item.id}" class="reflection-prompt-label">
                ${modalData.reflectionPrompt || 'Share a thought about this loss...'}
            </label>
            <textarea 
                id="reflection-${item.id}" 
                class="reflection-textarea" 
                placeholder="Type your reflection here... (your words will fade away)"
            ></textarea>
        </div>
    `;
}

// Close modal
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (!modalOverlay) return;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Hide modal
    modalOverlay.classList.remove('active');
    
    // Clear current item
    currentModalItem = null;
    
    // Clear reflection timeout
    if (reflectionTimeout) {
        clearTimeout(reflectionTimeout);
        reflectionTimeout = null;
    }
}

// Initialize reflection prompt ephemeral behavior
function initializeReflectionPrompt(itemId) {
    const textarea = document.getElementById(`reflection-${itemId}`);
    
    if (!textarea) return;
    
    // Clear any previous timeout
    if (reflectionTimeout) {
        clearTimeout(reflectionTimeout);
    }
    
    // Handle text input
    textarea.addEventListener('input', function() {
        // Clear previous timeout
        if (reflectionTimeout) {
            clearTimeout(reflectionTimeout);
        }
        
        // Save to localStorage (optional)
        const reflectionText = textarea.value;
        if (reflectionText.trim()) {
            localStorage.setItem(`reflection-${itemId}`, reflectionText);
        }
        
        // Set timeout to fade text after user stops typing
        reflectionTimeout = setTimeout(function() {
            fadeReflectionText(textarea);
        }, 3000); // Fade after 3 seconds of no typing
    });
    
    // Load saved reflection if exists (optional - comment out for true impermanence)
    const savedReflection = localStorage.getItem(`reflection-${itemId}`);
    if (savedReflection) {
        textarea.value = savedReflection;
    }
}

// Fade reflection text
function fadeReflectionText(textarea) {
    if (!textarea || !textarea.value.trim()) return;
    
    // Add fade class
    textarea.classList.add('reflection-fade');
    
    // Clear text after fade
    setTimeout(function() {
        textarea.value = '';
        textarea.classList.remove('reflection-fade');
        // Optionally remove from localStorage
        // localStorage.removeItem(`reflection-${textarea.id.replace('reflection-', '')}`);
    }, 2000);
}

// Handle image loading errors
function handleImageError(imgElement, originalUrl, itemId) {
    if (!imgElement) return;
    
    // Track how many fallback attempts we've made
    const attemptCount = parseInt(imgElement.dataset.fallbackAttempts || '0');
    
    // If we've tried all fallbacks, show placeholder
    if (attemptCount >= 4) {
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
        imgElement.alt = 'Image not available';
        imgElement.style.opacity = '0.5';
        return;
    }
    
    // Increment attempt counter
    imgElement.dataset.fallbackAttempts = (attemptCount + 1).toString();
    
    // Try 1: Use item.image as fallback (this is often the working URL)
    if (attemptCount === 0 && currentModalItem && currentModalItem.image && currentModalItem.image !== originalUrl) {
        imgElement.src = currentModalItem.image;
        return;
    }
    
    // Try alternative Wikimedia Commons URL formats
    if (originalUrl && originalUrl.includes('wikimedia.org')) {
        try {
            // Extract the path after /commons/
            const commonsMatch = originalUrl.match(/\/commons\/(.+)$/);
            if (commonsMatch) {
                const pathAfterCommons = commonsMatch[1];
                
                if (attemptCount === 1) {
                    // Try 2: Use the path directly with upload.wikimedia.org (most common format)
                    const directUrl = `https://upload.wikimedia.org/wikipedia/commons/${pathAfterCommons}`;
                    imgElement.src = directUrl;
                    return;
                } else if (attemptCount === 2) {
                    // Try 3: Extract filename and use thumbnail API format
                    const filenameMatch = pathAfterCommons.match(/\/([^\/]+\.(jpg|jpeg|png|gif|webp))$/i);
                    if (filenameMatch) {
                        const filename = decodeURIComponent(filenameMatch[1]);
                        // Wikimedia Commons uses MD5 hash for directory structure
                        // First char and first two chars of MD5 hash
                        // For now, try common patterns
                        const firstChar = filename.charAt(0).toLowerCase();
                        const secondChar = filename.length > 1 ? filename.charAt(1).toLowerCase() : firstChar;
                        const thumbnailUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${firstChar}/${firstChar}${secondChar}/${encodeURIComponent(filename)}/1200px-${encodeURIComponent(filename)}`;
                        imgElement.src = thumbnailUrl;
                        return;
                    }
                } else if (attemptCount === 3) {
                    // Try 4: Use the original URL but ensure proper HTTPS
                    const httpsUrl = originalUrl.replace(/^http:/, 'https:');
                    imgElement.src = httpsUrl;
                    return;
                }
            }
        } catch (e) {
            console.warn('Error processing Wikimedia URL:', e);
        }
    }
    
    // If no Wikimedia URL or all attempts failed, show placeholder
    imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
    imgElement.alt = 'Image not available';
    imgElement.style.opacity = '0.5';
}

// Export functions globally
window.openModal = openModal;
window.handleImageError = handleImageError;

