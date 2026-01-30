// Core calculation functions for CSS Test Calculator

// Import constants (works in both browser and Node.js)
if (typeof require !== 'undefined') {
    var CSS_CONSTANTS = require('./css-constants');
}
// CSS_CONSTANTS is loaded via script tag in browser, require in Node.js
const LIMITS = (typeof CSS_CONSTANTS !== 'undefined') ? CSS_CONSTANTS.limits : null;

// Parse flexible time input into total seconds
// Supports: MM:SS, MM.SS, MM SS, MM:SS.s, or plain seconds
function parseTimeInput(input) {
    const trimmed = input.trim();
    
    // Check for MM:SS format (colon separator, with optional decimal seconds)
    if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseFloat(parts[1]);
            
            if (!isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60 && minutes >= 0) {
                return minutes * 60 + seconds;
            }
        }
        // Invalid MM:SS format - return null, don't fall through to seconds parser
        return null;
    }
    
    // Check for MM SS format (space separator)
    if (trimmed.includes(' ')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseFloat(parts[1]);
            
            if (!isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60 && minutes >= 0) {
                return minutes * 60 + seconds;
            }
        }
        return null;
    }
    
    // Check for MM.SS format (period as separator, not decimal)
    // Only treat as MM.SS if: format is X.YY where YY is 00-59 AND minutes is <= 12 (reasonable swim time)
    const periodMatch = trimmed.match(/^(\d+)\.(\d{2})$/);
    if (periodMatch) {
        const minutes = parseInt(periodMatch[1], 10);
        const seconds = parseInt(periodMatch[2], 10);
        
        // Only treat as MM.SS if minutes <= 12 and seconds < 60
        if (minutes <= 12 && seconds >= 0 && seconds < 60) {
            return minutes * 60 + seconds;
        }
        // Otherwise reject invalid MM.SS (like 1.60) or fall through to decimal seconds
        if (minutes <= 12 && seconds >= 60) {
            return null;
        }
    }
    
    // Try as total seconds (including decimals like 208.5 or 440.25)
    const seconds = parseFloat(trimmed);
    if (!isNaN(seconds) && seconds > 0) {
        return seconds;
    }
    
    return null;
}

// Convert seconds to MM:SS or MM:SS.s format
function formatTime(seconds, includeDecimals = false) {
    if (seconds === null || isNaN(seconds)) {
        return '-';
    }
    
    const mins = Math.floor(seconds / 60);
    const secsRemainder = seconds % 60;
    
    if (includeDecimals && secsRemainder % 1 !== 0) {
        // Show one decimal place if there are fractional seconds
        const secs = Math.floor(secsRemainder);
        const tenths = Math.round((secsRemainder % 1) * 10);
        return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
    } else {
        const secs = Math.round(secsRemainder);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Calculate CSS and paces
function calculateCSS(time200, time400) {
    // Validate inputs
    if (time200 <= 0 || time400 <= 0) {
        throw new Error('Times must be positive values');
    }
    
    // Minimum realistic times (below would be world records)
    if (time200 < LIMITS.time200.min) {
        throw new Error(`200m time must be at least ${LIMITS.time200.min} seconds`);
    }
    
    if (time400 < LIMITS.time400.min) {
        throw new Error(`400m time must be at least ${LIMITS.time400.min} seconds`);
    }
    
    // Maximum realistic times
    if (time200 > LIMITS.time200.max) {
        throw new Error('200m time must be less than 6 minutes');
    }
    
    if (time400 > LIMITS.time400.max) {
        throw new Error('400m time must be less than 12 minutes');
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
