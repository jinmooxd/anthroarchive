// Audio Handler for Ambient Sounds

let audioInstances = {};
let isAudioEnabled = true; // Can be toggled by user preference

// Initialize audio handler
document.addEventListener('DOMContentLoaded', function() {
    // Check user preference for audio (can be stored in localStorage)
    const audioPreference = localStorage.getItem('audioEnabled');
    if (audioPreference !== null) {
        isAudioEnabled = audioPreference === 'true';
    }
});

// Create audio instance for an item
function createAudioInstance(itemId, audioSrc) {
    if (!audioSrc || !isAudioEnabled) return null;
    
    try {
        const audio = new Audio(audioSrc);
        audio.loop = false;
        audio.volume = 0.3; // Low volume for ambient effect
        audio.preload = 'auto';
        
        audioInstances[itemId] = audio;
        return audio;
    } catch (error) {
        console.warn('Could not create audio instance:', error);
        return null;
    }
}

// Play audio when item enters viewport
function playItemAudio(itemId, audioSrc) {
    if (!isAudioEnabled) return;
    
    let audio = audioInstances[itemId];
    
    if (!audio && audioSrc) {
        audio = createAudioInstance(itemId, audioSrc);
    }
    
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(error => {
            console.warn('Audio playback prevented:', error);
        });
    }
}

// Fade out audio when item leaves viewport
function fadeOutItemAudio(itemId, duration = 1000) {
    const audio = audioInstances[itemId];
    
    if (!audio) return;
    
    const startVolume = audio.volume;
    const fadeStep = startVolume / (duration / 50); // 50ms intervals
    const fadeInterval = 50;
    
    const fadeTimer = setInterval(function() {
        if (audio.volume > 0) {
            audio.volume = Math.max(0, audio.volume - fadeStep);
        } else {
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeTimer);
        }
    }, fadeInterval);
}

// Stop audio immediately
function stopItemAudio(itemId) {
    const audio = audioInstances[itemId];
    
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.3; // Reset volume for next play
    }
}

// Clean up all audio instances
function cleanupAudio() {
    Object.values(audioInstances).forEach(audio => {
        audio.pause();
        audio.src = '';
    });
    audioInstances = {};
}

// Toggle audio on/off
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    localStorage.setItem('audioEnabled', isAudioEnabled.toString());
    
    if (!isAudioEnabled) {
        // Stop all playing audio
        Object.keys(audioInstances).forEach(itemId => {
            stopItemAudio(itemId);
        });
    }
    
    return isAudioEnabled;
}

// Export functions for use in other scripts
window.audioHandler = {
    playItemAudio: playItemAudio,
    fadeOutItemAudio: fadeOutItemAudio,
    stopItemAudio: stopItemAudio,
    toggleAudio: toggleAudio,
    cleanupAudio: cleanupAudio
};

// Clean up on page unload
window.addEventListener('beforeunload', cleanupAudio);

