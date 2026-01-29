// Core calculation functions for CSS Test Calculator

// Parse flexible time input into total seconds
function parseTimeInput(input) {
    const trimmed = input.trim();
    
    // Check if it's MM:SS format
    if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            
            if (!isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60 && minutes >= 0) {
                return minutes * 60 + seconds;
            }
        }
        // Invalid MM:SS format - return null, don't fall through to seconds parser
        return null;
    }
    
    // Try as total seconds
    const seconds = parseInt(trimmed, 10);
    if (!isNaN(seconds) && seconds > 0) {
        return seconds;
    }
    
    return null;
}

// Convert seconds to MM:SS format
function formatTime(seconds) {
    if (seconds === null || isNaN(seconds)) {
        return '-';
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate CSS and paces
function calculateCSS(time200, time400) {
    // Validate inputs
    if (time200 <= 0 || time400 <= 0) {
        throw new Error('Times must be positive values');
    }
    
    if (time400 <= time200) {
        throw new Error('400m time must be greater than 200m time');
    }
    
    // Calculate paces per 100m
    // 200m pace per 100m = time_200m / 2
    // 400m pace per 100m = time_400m / 4
    const pace200Seconds = time200 / 2;
    const pace400Seconds = time400 / 4;
    
    // Validate that 400m pace is slower than 200m pace
    if (pace400Seconds < pace200Seconds) {
        throw new Error('400m pace cannot be faster than 200m pace');
    }
    
    // Calculate CSS (seconds per 100m)
    // CSS = (time_400m - time_200m) / 2
    const cssSeconds = (time400 - time200) / 2;
    
    return {
        css: cssSeconds,
        pace200: pace200Seconds,
        pace400: pace400Seconds
    };
}

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseTimeInput, formatTime, calculateCSS };
}
