// Loading Screen Logic

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const portfolioContainer = document.getElementById('portfolio-container');
    const loaderText = document.getElementById('loader-text');
    const loadingBar = document.getElementById('loading-bar');
    
    // Check if we're coming from manifesto page - if so, skip loading screen
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const fromManifesto = referrer.includes('manifesto.html') || urlParams.get('from') === 'manifesto';
    
    // If coming from manifesto, hide loader immediately and show portfolio
    if (fromManifesto && loader) {
        loader.style.display = 'none';
        if (portfolioContainer) {
            portfolioContainer.classList.add('loaded');
        }
        return; // Exit early, don't run loading animation
    }
    
    const loadingBarDuration = 3000; // 3 seconds for loading bar
    const textAnimationDuration = 800; // 0.8 seconds for text animation
    const waitAfterTextChange = 2500; // 2.5 seconds wait after text changes
    const minimumDisplayTime = loadingBarDuration + textAnimationDuration + waitAfterTextChange; // Total minimum display time
    const startTime = Date.now();

    // Function to change text after loading bar completes
    function changeText() {
        if (loaderText) {
            loaderText.classList.add('text-changing');
            // Update text content after animation starts
            setTimeout(function() {
                loaderText.textContent = 'An Homage to What Once Was';
            }, textAnimationDuration / 2); // Change text at midpoint of animation
        }
    }

    // Function to hide loader
    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);

        setTimeout(function() {
            loader.classList.add('hidden');
            if (portfolioContainer) {
                portfolioContainer.classList.add('loaded');
            }
            
            // Remove loader from DOM after fade out
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500); // Match CSS transition duration
        }, remainingTime);
    }

    // Start text change animation after loading bar completes (3 seconds)
    setTimeout(function() {
        changeText();
    }, loadingBarDuration);

    // Wait for all critical assets to load
    window.addEventListener('load', function() {
        hideLoader();
    });

    // Fallback: hide loader after maximum wait time
    setTimeout(function() {
        if (loader && !loader.classList.contains('hidden')) {
            hideLoader();
        }
    }, minimumDisplayTime + 1000); // Maximum wait time with buffer
});

