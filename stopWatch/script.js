// ===================================
// --- TAB SWITCHING LOGIC ---
// ===================================
const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        navButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked button and its target panel
        btn.classList.add('active');
        const targetPanel = document.getElementById(btn.dataset.target + '-panel');
        targetPanel.classList.add('active');
    });
});

// ===================================
// --- STOPWATCH LOGIC (Unchanged) ---
// ===================================

// Get all necessary DOM elements
const hrEl = document.getElementById('hr');
const minEl = document.getElementById('min');
const secEl = document.getElementById('sec');
const countEl = document.getElementById('count');

const startStopBtn = document.getElementById('start-stop');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');

const lapsList = document.getElementById('laps-list');

// Initialize state variables
let swStartTime = 0; // Renamed to avoid conflicts
let swElapsedTime = 0; // Renamed
let swTimerInterval = null; // Renamed
let isSwRunning = false; // Renamed
let lapCounter = 1;

// Helper Functions
function pad(num) {
    return num < 10 ? '0' + num : String(num);
}

function calculateSwTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return { hours, minutes, seconds, centiseconds };
}

function updateSwDisplay() {
    swElapsedTime = Date.now() - swStartTime;
    const { hours, minutes, seconds, centiseconds } = calculateSwTime(swElapsedTime);
    
    hrEl.textContent = pad(hours);
    minEl.textContent = pad(minutes);
    secEl.textContent = pad(seconds);
    countEl.textContent = pad(centiseconds);
}

function formatLapTime(ms) {
    const { hours, minutes, seconds, centiseconds } = calculateSwTime(ms);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

// Main Functions
function startStopwatch() {
    swStartTime = Date.now() - swElapsedTime;
    swTimerInterval = setInterval(updateSwDisplay, 10);
    isSwRunning = true;
    startStopBtn.textContent = "Pause";
    startStopBtn.classList.add('running');
}

function pauseStopwatch() {
    clearInterval(swTimerInterval);
    swElapsedTime = Date.now() - swStartTime;
    isSwRunning = false;
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove('running');
}

function resetStopwatch() {
    if (swTimerInterval) {
        clearInterval(swTimerInterval);
    }
    swStartTime = 0;
    swElapsedTime = 0;
    swTimerInterval = null;
    isSwRunning = false;
    lapCounter = 1;
    
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove('running');
    hrEl.textContent = "00";
    minEl.textContent = "00";
    secEl.textContent = "00";
    countEl.textContent = "00";
    lapsList.innerHTML = "";
}

function recordLap() {
    if (!isSwRunning) return;
    const lapTime = formatLapTime(swElapsedTime);
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="lap-label">Lap ${lapCounter}</span>
        <span class="lap-time">${lapTime}</span>
    `;
    lapsList.prepend(li);
    lapCounter++;
}

// Event Listeners
startStopBtn.addEventListener('click', () => {
    if (isSwRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
});
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);


// ===================================
// --- NEW: TIMER LOGIC ---
// ===================================

// Get Timer DOM elements
const timerInputs = document.getElementById('timer-inputs');
const timerDisplay = document.getElementById('timer-display');
const tHrEl = document.getElementById('t-hr');
const tMinEl = document.getElementById('t-min');
const tSecEl = document.getElementById('t-sec');
const tInputHr = document.getElementById('t-input-hr');
const tInputMin = document.getElementById('t-input-min');
const tInputSec = document.getElementById('t-input-sec');
const timerStartStopBtn = document.getElementById('timer-start-stop');
const timerResetBtn = document.getElementById('timer-reset');
const timerBeep = document.getElementById('timer-beep');

// Timer state variables
let totalSeconds = 0;
let timerInterval = null;
let isTimerRunning = false;

// Event Listeners
timerStartStopBtn.addEventListener('click', () => {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

timerResetBtn.addEventListener('click', resetTimer);

function startTimer() {
    // Only read inputs if the timer is not already running (i.e., not paused)
    if (totalSeconds === 0) {
        const hours = parseInt(tInputHr.value) || 0;
        const minutes = parseInt(tInputMin.value) || 0;
        const seconds = parseInt(tInputSec.value) || 0;
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }

    if (totalSeconds <= 0) {
        // Don't start a timer for 0
        totalSeconds = 0; // Reset in case of invalid input
        return;
    }

    // Hide inputs, show display
    timerInputs.style.display = 'none';
    timerDisplay.style.display = 'flex';
    
    isTimerRunning = true;
    timerStartStopBtn.textContent = "Pause";
    timerStartStopBtn.classList.add('running');

    updateTimerDisplay(); // Show the time immediately

    // Start the interval (ticks every second)
    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();

        if (totalSeconds <= 0) {
            finishTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timerStartStopBtn.textContent = "Resume";
    timerStartStopBtn.classList.remove('running');
}

function resetTimer() {
    // Stop any running timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    totalSeconds = 0;
    isTimerRunning = false;

    // Reset button text and style
    timerStartStopBtn.textContent = "Start";
    timerStartStopBtn.classList.remove('running');

    // Show inputs, hide display
    timerInputs.style.display = 'flex';
    timerDisplay.style.display = 'none';

    // Reset input values (optional, can keep last values)
    // tInputHr.value = 0;
    // tInputMin.value = 0;
    // tInputSec.value = 10;
}

function updateTimerDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    tHrEl.textContent = pad(hours);
    tMinEl.textContent = pad(minutes);
    tSecEl.textContent = pad(seconds);
}

function finishTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Play the beep sound
    timerBeep.currentTime = 0; // Rewind in case it's still playing
    timerBeep.play();
    
    // Alert the user
    tHrEl.textContent = "00";
    tMinEl.textContent = "00";
    tSecEl.textContent = "00";
    alert("Time's Up!");

    resetTimer(); // Go back to the input screen
}