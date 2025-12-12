// Scroll-Based Animations

document.addEventListener('DOMContentLoaded', function() {
    // Wait for portfolio items to be rendered
    setTimeout(function() {
        initializeScrollAnimations();
    }, 500);
});

function initializeScrollAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioItems.length === 0) return;
    
    // Create Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of item is visible
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Item enters viewport - fade in
                entry.target.classList.add('visible');
                
                // Optional: Reduce blur on scroll
                const image = entry.target.querySelector('.portfolio-item-image');
                if (image) {
                    setTimeout(function() {
                        image.style.filter = 'blur(8px)'; // Slightly reduce blur
                    }, 300);
                }
            } else {
                // Item leaves viewport - fade out (optional, for "decay" theme)
                // Uncomment to enable fade-out effect
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    // Observe each portfolio item
    portfolioItems.forEach(item => {
        observer.observe(item);
    });
    
    // Stagger initial animations for items already in viewport
    portfolioItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
            setTimeout(function() {
                item.classList.add('visible');
            }, index * 100); // Stagger by 100ms
        }
    });
}

// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll to CSS
    document.documentElement.style.scrollBehavior = 'smooth';
});

