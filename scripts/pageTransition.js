// Page Transition Logic - Two-step animation: white then black from bottom to top

document.addEventListener('DOMContentLoaded', function() {
    const portfolioLink = document.getElementById('portfolio-link');
    const manifestoLink = document.getElementById('manifesto-link');
    const pageTransitionWhite = document.getElementById('page-transition-white');
    const pageTransitionBlack = document.getElementById('page-transition-black');
    
    // Check if we're coming from a transition
    const urlParams = new URLSearchParams(window.location.search);
    const fromTransition = urlParams.get('transition') === 'true';
    
    if (fromTransition && pageTransitionWhite && pageTransitionBlack) {
        // We're on the destination page
        // Hide page content during transition
        document.body.classList.add('transitioning');
        
        // Step 1: Set white overlay to 100% immediately (no transition)
        pageTransitionWhite.style.transition = 'none';
        pageTransitionWhite.classList.add('active');
        
        // Force a reflow to ensure the style is applied
        void pageTransitionWhite.offsetHeight;
        
        // Step 2: After white finishes (0.4s), animate black overlay from bottom to top
        setTimeout(function() {
            pageTransitionWhite.style.transition = '';
            pageTransitionBlack.classList.add('active');
            
            // Step 3: After black finishes (another 0.4s, total 0.8s), reveal site from top to bottom
            setTimeout(function() {
                pageTransitionWhite.classList.remove('active');
                pageTransitionBlack.classList.remove('active');
                // Remove transitioning class and add revealing class for top-to-bottom reveal
                document.body.classList.remove('transitioning');
                document.body.classList.add('revealing');
                
                // After reveal animation completes (0.4s), clean up
                setTimeout(function() {
                    document.body.classList.remove('revealing');
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 400); // Reveal animation duration
            }, 400); // Black overlay animation duration
        }, 400); // White overlay animation duration
    }
    
    // Handle underline animation for nav links (same as landing page)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('mouseenter', function() {
            // Remove mouseleave class if present
            link.classList.remove('mouseleave');
            // Underline animation on hover is handled by CSS
        });
        
        link.addEventListener('mouseleave', function() {
            // Add class to trigger reverse animation
            link.classList.add('mouseleave');
            // Remove class after animation completes
            setTimeout(function() {
                link.classList.remove('mouseleave');
            }, 500);
        });
    });
    
    // Handle Portfolio link click - with smooth color swap transition (no loading screen)
    if (portfolioLink) {
        portfolioLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPage = window.location.pathname;
            
            // Only transition if we're not already on portfolio page
            if (!currentPage.includes('portfolio.html')) {
                // Check if we're coming from manifesto
                const isFromManifesto = currentPage.includes('manifesto.html');
                performTransition('portfolio.html', isFromManifesto);
            }
        });
    }
    
    // Handle Manifesto link click - with smooth color swap transition
    if (manifestoLink) {
        manifestoLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPage = window.location.pathname;
            
            // Only transition if we're not already on manifesto page
            if (!currentPage.includes('manifesto.html')) {
                performTransition('manifesto.html');
            }
        });
    }
    
    function performTransition(targetPage, fromManifesto) {
        if (!pageTransitionWhite || !pageTransitionBlack) return;
        
        // Step 1: White overlay comes up from bottom (0.8s)
        pageTransitionWhite.classList.add('active');
        
        // Step 2: After white overlay covers screen, navigate to new page
        // The destination page will handle the black overlay animation
        setTimeout(function() {
            let url = targetPage + '?transition=true';
            if (fromManifesto) {
                url += '&from=manifesto';
            }
            window.location.href = url;
        }, 400); // Match CSS transition duration (0.4s)
    }
});

