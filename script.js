// UI logic for CSS Test Calculator
// Core functions (parseTimeInput, formatTime, calculateCSS) are in css-calculator.js

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

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
    
    // Show decimals if present
    const hasDecimals = time % 1 !== 0;
    secondsEl.textContent = hasDecimals ? time.toFixed(1) : time;
    minSecEl.textContent = formatTime(time, true);
    paceEl.textContent = formatTime(pace, true);
    paceBox.classList.remove('hidden');
}

// Display results
function displayResults(css, pace200, pace400) {
    const resultsSection = document.getElementById('resultsSection');
    const cssResult = document.getElementById('cssResult');
    const errorMessage = document.getElementById('errorMessage');
    
    cssResult.textContent = formatTime(css);
    
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

// ========== TIMER TAB LOGIC ==========

let timer200StartTime = null;
let timer400StartTime = null;
let timer200Interval = null;
let timer400Interval = null;
let timer200Result = null;
let timer400Result = null;

// Format milliseconds to M:SS.s display
function formatTimerDisplay(ms) {
    const totalSeconds = ms / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
}

// Update timer display
function updateTimerDisplay(displayId, startTime) {
    const elapsed = Date.now() - startTime;
    document.getElementById(displayId).textContent = formatTimerDisplay(elapsed);
}

// Show timer result breakdown
function showTimerResult(resultBoxId, seconds, distance) {
    const pace = seconds / (distance / 100);
    const distanceNum = distance === 200 ? '200' : '400';
    
    document.getElementById('timerSeconds' + distanceNum).textContent = seconds.toFixed(1);
    document.getElementById('timerMinSec' + distanceNum).textContent = formatTime(seconds, true);
    document.getElementById('timerPace' + distanceNum).textContent = formatTime(pace, true);
    document.getElementById(resultBoxId).classList.remove('hidden');
}

// Calculate and show timer CSS result
function calculateTimerCSS() {
    if (timer200Result === null || timer400Result === null) return;
    
    try {
        const results = calculateCSS(Math.round(timer200Result), Math.round(timer400Result));
        document.getElementById('timerCssResult').textContent = formatTime(results.css, true);
        document.getElementById('timerResultsSection').classList.remove('hidden');
        document.getElementById('timerErrorMessage').classList.add('hidden');
    } catch (error) {
        document.getElementById('timerErrorMessage').textContent = error.message;
        document.getElementById('timerErrorMessage').classList.remove('hidden');
        document.getElementById('timerResultsSection').classList.add('hidden');
    }
}

// 200m Timer: Start
document.getElementById('start200Btn').addEventListener('click', () => {
    timer200StartTime = Date.now();
    timer200Interval = setInterval(() => {
        updateTimerDisplay('timer200Display', timer200StartTime);
    }, 100);
    
    document.getElementById('start200Btn').classList.add('hidden');
    document.getElementById('stop200Btn').classList.remove('hidden');
});

// 200m Timer: Stop
document.getElementById('stop200Btn').addEventListener('click', () => {
    clearInterval(timer200Interval);
    timer200Result = (Date.now() - timer200StartTime) / 1000;
    
    document.getElementById('stop200Btn').classList.add('hidden');
    showTimerResult('timer200Result', timer200Result, 200);
    
    // Show 400m trial
    document.getElementById('timer400Trial').classList.remove('hidden');
});

// 400m Timer: Start
document.getElementById('start400Btn').addEventListener('click', () => {
    timer400StartTime = Date.now();
    timer400Interval = setInterval(() => {
        updateTimerDisplay('timer400Display', timer400StartTime);
    }, 100);
    
    document.getElementById('start400Btn').classList.add('hidden');
    document.getElementById('stop400Btn').classList.remove('hidden');
});

// 400m Timer: Stop
document.getElementById('stop400Btn').addEventListener('click', () => {
    clearInterval(timer400Interval);
    timer400Result = (Date.now() - timer400StartTime) / 1000;
    
    document.getElementById('stop400Btn').classList.add('hidden');
    showTimerResult('timer400Result', timer400Result, 400);
    
    // Calculate and show CSS result
    calculateTimerCSS();
});

// Timer Reset
document.getElementById('timerResetBtn').addEventListener('click', () => {
    // Clear intervals
    clearInterval(timer200Interval);
    clearInterval(timer400Interval);
    
    // Reset state
    timer200StartTime = null;
    timer400StartTime = null;
    timer200Result = null;
    timer400Result = null;
    
    // Reset 200m trial
    document.getElementById('timer200Display').textContent = '0:00.0';
    document.getElementById('start200Btn').classList.remove('hidden');
    document.getElementById('stop200Btn').classList.add('hidden');
    document.getElementById('timer200Result').classList.add('hidden');
    
    // Reset 400m trial
    document.getElementById('timer400Display').textContent = '0:00.0';
    document.getElementById('start400Btn').classList.remove('hidden');
    document.getElementById('stop400Btn').classList.add('hidden');
    document.getElementById('timer400Result').classList.add('hidden');
    document.getElementById('timer400Trial').classList.add('hidden');
    
    // Hide results
    document.getElementById('timerResultsSection').classList.add('hidden');
    document.getElementById('timerErrorMessage').classList.add('hidden');
});
