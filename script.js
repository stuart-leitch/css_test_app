// Parse flexible time input into total seconds
function parseTimeInput(input) {
    const trimmed = input.trim();
    
    // Check if it's MM:SS format
    if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            
            if (!isNaN(minutes) && !isNaN(seconds) && seconds < 60) {
                return minutes * 60 + seconds;
            }
        }
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
    
    // Calculate CSS (seconds per 100m)
    // CSS = (time_400m - time_200m) / 2
    const cssSeconds = (time400 - time200) / 2;
    
    // Calculate paces per 100m
    // 200m pace per 100m = time_200m / 2
    // 400m pace per 100m = time_400m / 4
    const pace200Seconds = time200 / 2;
    const pace400Seconds = time400 / 4;
    
    return {
        css: cssSeconds,
        pace200: pace200Seconds,
        pace400: pace400Seconds
    };
}

// Display results
function displayResults(css, pace200, pace400) {
    const resultsSection = document.getElementById('resultsSection');
    const cssResult = document.getElementById('cssResult');
    const pace200Result = document.getElementById('pace200');
    const pace400Result = document.getElementById('pace400');
    const errorMessage = document.getElementById('errorMessage');
    
    cssResult.textContent = formatTime(css) + '/100';
    pace200Result.textContent = formatTime(pace200) + '/100';
    pace400Result.textContent = formatTime(pace400) + '/100';
    
    resultsSection.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

// Reset form
function reset() {
    document.getElementById('time200').value = '';
    document.getElementById('time400').value = '';
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('time200').focus();
}

// Event listeners
document.getElementById('calculateBtn').addEventListener('click', () => {
    const time200Input = document.getElementById('time200').value;
    const time400Input = document.getElementById('time400').value;
    
    if (!time200Input || !time400Input) {
        showError('Please enter both 200m and 400m times');
        return;
    }
    
    const time200 = parseTimeInput(time200Input);
    const time400 = parseTimeInput(time400Input);
    
    if (time200 === null || time400 === null) {
        showError('Invalid time format. Use MM:SS or seconds.');
        return;
    }
    
    try {
        const results = calculateCSS(time200, time400);
        displayResults(results.css, results.pace200, results.pace400);
    } catch (error) {
        showError(error.message);
    }
});

document.getElementById('resetBtn').addEventListener('click', reset);

// Allow Enter key to calculate
document.getElementById('time400').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('calculateBtn').click();
    }
});

// Focus on first input on load
window.addEventListener('load', () => {
    document.getElementById('time200').focus();
});
