// UI logic for CSS Test Calculator
// Core functions (parseTimeInput, formatTime, calculateCSS) are in css-calculator.js

// Try to auto-calculate CSS if both inputs are valid
function tryAutoCalculateCSS() {
    const time200Input = document.getElementById('time200').value;
    const time400Input = document.getElementById('time400').value;
    
    if (!time200Input || !time400Input) {
        document.getElementById('errorMessage').classList.add('hidden');
        return;
    }
    
    const time200 = parseTimeInput(time200Input);
    const time400 = parseTimeInput(time400Input);
    
    if (time200 === null || time400 === null) {
        document.getElementById('errorMessage').classList.add('hidden');
        return;
    }
    
    try {
        const results = calculateCSS(time200, time400);
        displayResults(results.css, results.pace200, results.pace400);
        document.getElementById('errorMessage').classList.add('hidden');
    } catch (error) {
        document.getElementById('resultsSection').classList.add('hidden');
        showError(error.message);
    }
}

// Update individual pace when input changes
function updatePace(inputId, paceBoxId, distance) {
    const input = document.getElementById(inputId).value;
    const paceBox = document.getElementById(paceBoxId);
    const distanceNum = distance === 200 ? '200' : '400';
    
    const secondsEl = document.getElementById('seconds' + distanceNum);
    const minSecEl = document.getElementById('minSec' + distanceNum);
    const paceEl = document.getElementById('pace' + distanceNum);
    
    if (!input) {
        paceBox.classList.add('hidden');
        return;
    }
    
    const time = parseTimeInput(input);
    if (time === null || time <= 0) {
        paceBox.classList.add('hidden');
        return;
    }
    
    const pace = time / (distance / 100);
    
    secondsEl.textContent = time;
    minSecEl.textContent = formatTime(time);
    paceEl.textContent = formatTime(pace);
    paceBox.classList.remove('hidden');
}

// Display results
function displayResults(css, pace200, pace400) {
    const resultsSection = document.getElementById('resultsSection');
    const cssResult = document.getElementById('cssResult');
    const errorMessage = document.getElementById('errorMessage');
    
    cssResult.textContent = formatTime(css) + '/100';
    
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
    document.getElementById('pace200Box').classList.add('hidden');
    document.getElementById('pace400Box').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    
    // Reset pace display values
    document.getElementById('seconds200').textContent = '-';
    document.getElementById('minSec200').textContent = '-';
    document.getElementById('pace200').textContent = '-';
    document.getElementById('seconds400').textContent = '-';
    document.getElementById('minSec400').textContent = '-';
    document.getElementById('pace400').textContent = '-';
    
    document.getElementById('time200').focus();
}

// Event listeners
document.getElementById('resetBtn').addEventListener('click', reset);

// Allow Enter key to trigger reset when focused on inputs
document.getElementById('time400').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('time400').blur();
    }
});

// Focus on first input on load
window.addEventListener('load', () => {
    document.getElementById('time200').focus();
});

// Auto-calculate paces on input blur (when user finishes editing)
document.getElementById('time200').addEventListener('blur', () => {
    updatePace('time200', 'pace200Box', 200);
    tryAutoCalculateCSS();
});

document.getElementById('time400').addEventListener('blur', () => {
    updatePace('time400', 'pace400Box', 400);
    tryAutoCalculateCSS();
});
