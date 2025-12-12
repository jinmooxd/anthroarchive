// Landing Page Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize background video
    const backgroundVideo = document.getElementById('background-video');
    
    if (backgroundVideo) {
        // Add cache-busting query parameter based on file modification time or random
        const videoSource = backgroundVideo.querySelector('source');
        if (videoSource) {
            // Remove existing cache-busting parameter and add new one
            const baseSrc = videoSource.src.split('?')[0];
            const timestamp = new Date().getTime();
            videoSource.src = baseSrc + '?v=' + timestamp;
            // Force video to reload with new source
            backgroundVideo.load();
        }
        
        console.log('Video element found');
        console.log('Video source:', backgroundVideo.querySelector('source')?.src);
        
        // Add error handling
        backgroundVideo.addEventListener('error', function(e) {
            console.error('Video error occurred:', e);
            console.error('Video error details:', backgroundVideo.error);
            if (backgroundVideo.error) {
                console.error('Error code:', backgroundVideo.error.code);
                console.error('Error message:', backgroundVideo.error.message);
            }
            console.log('Video currentSrc:', backgroundVideo.currentSrc);
            console.log('Make sure the video file exists at: assets/images/landing/background.mp4');
        });
        
        // Log when video loads successfully
        backgroundVideo.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded');
            console.log('Video duration:', backgroundVideo.duration);
            console.log('Video dimensions:', backgroundVideo.videoWidth, 'x', backgroundVideo.videoHeight);
            
            // Ensure video is visible
            backgroundVideo.style.display = 'block';
            backgroundVideo.style.visibility = 'visible';
            
            // Try to play
            const playPromise = backgroundVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Video playing successfully');
                    console.log('Video is playing:', !backgroundVideo.paused);
                }).catch(function(error) {
                    console.warn('Video autoplay failed:', error.message);
                    console.log('This is normal in some browsers. Video should play after page load.');
                });
            }
        });
        
        backgroundVideo.addEventListener('loadeddata', function() {
            console.log('Background video data loaded');
        });
        
        backgroundVideo.addEventListener('canplay', function() {
            console.log('Video can start playing');
            backgroundVideo.play().catch(e => console.log('Play error:', e.message));
        });
        
        // Set video source explicitly if not set
        if (!backgroundVideo.currentSrc) {
            console.warn('Video source not loaded. Checking source element...');
            const source = backgroundVideo.querySelector('source');
            if (source) {
                console.log('Source element found:', source.src);
                backgroundVideo.load(); // Force reload
            }
        }
        
        // Ensure video is visible for debugging (you can remove this later)
        console.log('Video element styles:', window.getComputedStyle(backgroundVideo));
        console.log('Video opacity:', window.getComputedStyle(backgroundVideo).opacity);
        
    } else {
        console.error('Background video element not found! Check HTML.');
    }
    
    // Ensure animated underline works smoothly
    const enterLink = document.querySelector('.enter-experience-link');
    
    if (enterLink) {
        // Add smooth entrance animation
        enterLink.style.opacity = '0';
        enterLink.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            enterLink.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            enterLink.style.opacity = '1';
            enterLink.style.transform = 'translateY(0)';
        }, 300);
        
        // The CSS handles the underline animation on hover
        // This ensures proper interaction
        enterLink.addEventListener('mouseenter', function() {
            // Remove mouseleave class if present
            enterLink.classList.remove('mouseleave');
            // Underline animation on hover is handled by CSS
        });
        
        enterLink.addEventListener('mouseleave', function() {
            // Add class to trigger reverse animation
            enterLink.classList.add('mouseleave');
            // Remove class after animation completes
            setTimeout(function() {
                enterLink.classList.remove('mouseleave');
            }, 500);
        });
    }
    
    // Add fade-in animations for other elements
    const elements = document.querySelectorAll('.top-left, .hero-headline, .bottom-bar');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
});
