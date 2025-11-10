// ===================================
// --- TAB SWITCHING LOGIC ---
// ===================================

// Get all elements with the class '.nav-btn' (our "Stopwatch" and "Timer" buttons)
const navButtons = document.querySelectorAll('.nav-btn');
// Get all elements with the class '.panel' (the content sections for stopwatch and timer)
const panels = document.querySelectorAll('.panel');

// Loop through each navigation button we found
navButtons.forEach(btn => {
    // Add a 'click' event listener to each button
    btn.addEventListener('click', () => {
        // --- When a button is clicked, do the following: ---

        // 1. Remove the 'active' class from all buttons to 'deactivate' them
        navButtons.forEach(b => b.classList.remove('active'));
        // 2. Remove the 'active' class from all panels to hide them
        panels.forEach(p => p.classList.remove('active'));

        // 3. Add the 'active' class to the *specific button* that was clicked
        btn.classList.add('active');
        // 4. Get the 'data-target' attribute from the clicked button (e.g., "stopwatch")
        //    and build the corresponding panel ID (e.g., "stopwatch-panel")
        const targetPanel = document.getElementById(btn.dataset.target + '-panel');
        // 5. Add the 'active' class to that target panel to make it visible
        targetPanel.classList.add('active');
    }); // End of click event listener
}); // End of forEach loop

// ===================================
// --- STOPWATCH LOGIC ---
// ===================================

// --- Get Stopwatch DOM Elements ---
// Get the <span> element that displays the hours
const hrEl = document.getElementById('hr');
// Get the <span> element that displays the minutes
const minEl = document.getElementById('min');
// Get the <span> element that displays the seconds
const secEl = document.getElementById('sec');
// Get the <span> element that displays the centiseconds (1/100th of a sec)
const countEl = document.getElementById('count');

// Get the three control buttons for the stopwatch
const startStopBtn = document.getElementById('start-stop');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');

// Get the <ul> (unordered list) element where lap times will be shown
const lapsList = document.getElementById('laps-list');

// --- Stopwatch State Variables ---
// Stores the timestamp (in milliseconds) when the stopwatch was started or resumed
let swStartTime = 0;
// Stores the total elapsed time (in ms) when the stopwatch is paused
let swElapsedTime = 0;
// Holds the reference to the 'setInterval' function, so we can stop it later
let swTimerInterval = null;
// A "flag" to track if the stopwatch is currently running (true) or stopped/paused (false)
let isSwRunning = false;
// A counter to keep track of the lap number (Lap 1, Lap 2, etc.)
let lapCounter = 1;

// --- Helper Functions ---

/**
 * Adds a leading zero to numbers less than 10.
 * Example: 7 -> "07"
 * @param {number} num - The number to pad.
 * @returns {string} A two-digit string.
 */
function pad(num) {
    // This is a ternary operator: (condition ? value_if_true : value_if_false)
    return num < 10 ? '0' + num : String(num);
}

/**
 * Converts a total time in milliseconds into hours, minutes, seconds, and centiseconds.
 * @param {number} ms - The total elapsed milliseconds.
 * @returns {object} An object with time components.
 */
function calculateSwTime(ms) {
    // 1 hour = 3,600,000 ms
    const hours = Math.floor(ms / 3600000);
    // 1 minute = 60,000 ms. (% 3600000 gets the remainder after hours)
    const minutes = Math.floor((ms % 3600000) / 60000);
    // 1 second = 1000 ms. (% 60000 gets the remainder after minutes)
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);
    // 1 centisecond = 10 ms. (% 1000 gets the remainder after seconds)
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    // Return all values as an object
    return { hours, minutes, seconds, centiseconds };
}

/**
 * Updates the stopwatch display (the HTML) with the current time.
 */
function updateSwDisplay() {
    // Calculate the total elapsed time: Current time minus the time we started
    swElapsedTime = Date.now() - swStartTime;
    // Convert that millisecond value into H, M, S, CS
    const { hours, minutes, seconds, centiseconds } = calculateSwTime(swElapsedTime);
    
    // Update the text content of each <span> element
    hrEl.textContent = pad(hours);
    minEl.textContent = pad(minutes);
    secEl.textContent = pad(seconds);
    countEl.textContent = pad(centiseconds);
}

/**
 * Formats milliseconds into a "HH:MM:SS.CS" string for the lap list.
 * @param {number} ms - The total elapsed milliseconds.
 * @returns {string} The formatted time string.
 */
function formatLapTime(ms) {
    // Get the time components
    const { hours, minutes, seconds, centiseconds } = calculateSwTime(ms);
    // Use "template literals" (backticks ``) to build the string
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

// --- Main Stopwatch Functions ---

/**
 * Starts the stopwatch timer.
 */
function startStopwatch() {
    // Set the start time. By subtracting elapsed time, we can resume from a pause.
    // (e.g., Date.now() (10000) - swElapsedTime (3000) = swStartTime (7000))
    swStartTime = Date.now() - swElapsedTime;
    
    // Start a new interval that calls 'updateSwDisplay' every 10 milliseconds
    // (This is fast enough to show 100ths of a second)
    swTimerInterval = setInterval(updateSwDisplay, 10);
    
    // Set our "flag" to true
    isSwRunning = true;
    // Change the button text to "Pause"
    startStopBtn.textContent = "Pause";
    // Add the '.running' class to the button (for the yellow style)
    startStopBtn.classList.add('running');
}

/**
 * Pauses the stopwatch timer.
 */
function pauseStopwatch() {
    // Stop the interval timer from running
    clearInterval(swTimerInterval);
    // We're paused, so record the *exact* time we stopped
    swElapsedTime = Date.now() - swStartTime;
    // Set our "flag" to false
    isSwRunning = false;
    // Change the button text back to "Start"
    startStopBtn.textContent = "Start";
    // Remove the '.running' class from the button
    startStopBtn.classList.remove('running');
}

/**
 * Resets the stopwatch to 00:00:00.00 and clears laps.
 */
function resetStopwatch() {
    // Stop the interval if it's running
    if (swTimerInterval) {
        clearInterval(swTimerInterval);
    }
    
    // Reset all our state variables back to their default values
    swStartTime = 0;
    swElapsedTime = 0;
    swTimerInterval = null;
    isSwRunning = false;
    lapCounter = 1; // Reset the lap counter to 1
    
    // Reset the button text and style
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove('running');
    
    // Reset the display text to "00" for all fields
    hrEl.textContent = "00";
    minEl.textContent = "00";
    secEl.textContent = "00";
    countEl.textContent = "00";
    
    // Clear all items from the lap list
    lapsList.innerHTML = "";
}

/**
 * Records the current stopwatch time as a "lap".
 */
function recordLap() {
    // If the stopwatch isn't running, don't do anything
    if (!isSwRunning) return;
    
    // Get the current elapsed time formatted as a string
    const lapTime = formatLapTime(swElapsedTime);
    // Create a new <li> (list item) element in memory
    const li = document.createElement('li');
    
    // Set the HTML content for our new list item
    li.innerHTML = `
        <span class="lap-label">Lap ${lapCounter}</span>
        <span class="lap-time">${lapTime}</span>
    `;
    
    // Add the new <li> element to the *beginning* of the lap list
    lapsList.prepend(li);
    // Increment the lap counter for the next time
    lapCounter++;
}

// --- Stopwatch Event Listeners ---

// Add a 'click' listener to the main Start/Stop button
startStopBtn.addEventListener('click', () => {
    // Check our "flag"
    if (isSwRunning) {
        // If it's running, call the pause function
        pauseStopwatch();
    } else {
        // If it's paused or stopped, call the start function
        startStopwatch();
    }
});

// Add a 'click' listener to the Reset button
resetBtn.addEventListener('click', resetStopwatch);
// Add a 'click' listener to the Lap button
lapBtn.addEventListener('click', recordLap);


// ===================================
// --- NEW: TIMER LOGIC ---
// ===================================

// --- Get Timer DOM elements ---
// Get the <div> that holds the number *inputs*
const timerInputs = document.getElementById('timer-inputs');
// Get the <div> that holds the *running display*
const timerDisplay = document.getElementById('timer-display');
// Get the <span> elements for the running timer's display
const tHrEl = document.getElementById('t-hr');
const tMinEl = document.getElementById('t-min');
const tSecEl = document.getElementById('t-sec');
// Get the <input> elements for setting the time
const tInputHr = document.getElementById('t-input-hr');
const tInputMin = document.getElementById('t-input-min');
const tInputSec = document.getElementById('t-input-sec');
// Get the control buttons for the timer
const timerStartStopBtn = document.getElementById('timer-start-stop');
const timerResetBtn = document.getElementById('timer-reset');
// Get the <audio> element that plays the beep
const timerBeep = document.getElementById('timer-beep');

// --- Timer State Variables ---
// Stores the total remaining countdown time in *seconds*
let totalSeconds = 0;
// Holds the reference to the timer's 'setInterval'
let timerInterval = null;
// A "flag" to track if the timer is currently running
let isTimerRunning = false;

// --- Timer Event Listeners ---
// Add a 'click' listener to the timer's Start/Stop button
timerStartStopBtn.addEventListener('click', () => {
    // Check if the timer is currently running
    if (isTimerRunning) {
        // If yes, pause it
        pauseTimer();
    } else {
        // If no, start it (or resume it)
        startTimer();
    }
});

// Add a 'click' listener to the timer's Reset button
timerResetBtn.addEventListener('click', resetTimer);

// --- Timer Main Functions ---

/**
 * Starts the countdown timer.
 */
function startTimer() {
    // If totalSeconds is 0, it means we are starting fresh (not resuming)
    if (totalSeconds === 0) {
        // Read the values from the input boxes
        // 'parseInt' converts the text "10" into the number 10.
        // '|| 0' means "if the value is invalid (e.g., empty), use 0 instead".
        const hours = parseInt(tInputHr.value) || 0;
        const minutes = parseInt(tInputMin.value) || 0;
        const seconds = parseInt(tInputSec.value) || 0;
        
        // Convert all inputs into a single 'totalSeconds' value
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }

    // If there's still no time (e.g., user entered 0), don't start
    if (totalSeconds <= 0) {
        totalSeconds = 0; // Ensure it's reset
        return; // Exit the function
    }

    // --- We are ready to start! ---
    // Hide the input boxes
    timerInputs.style.display = 'none';
    // Show the running timer display
    timerDisplay.style.display = 'flex';
    
    // Set the "flag" to true
    isTimerRunning = true;
    // Change the button text to "Pause"
    timerStartStopBtn.textContent = "Pause";
    // Add the '.running' class for styling
    timerStartStopBtn.classList.add('running');

    // Call this function once *immediately* to show the starting time
    updateTimerDisplay();

    // Start a new interval that runs a function *once every second* (1000 ms)
    timerInterval = setInterval(() => {
        // Subtract 1 from the total seconds
        totalSeconds--;
        // Update the H:M:S display with the new time
        updateTimerDisplay();

        // Check if the timer has reached zero
        if (totalSeconds <= 0) {
            // If time is up, call the function to finish
            finishTimer();
        }
    }, 1000); // 1000 milliseconds = 1 second
}

/**
 * Pauses the countdown timer.
 */
function pauseTimer() {
    // Stop the 1-second interval
    clearInterval(timerInterval);
    // Set the interval reference to null
    timerInterval = null;
    // Set the "flag" to false
    isTimerRunning = false;
    // Change the button text to "Resume" (since totalSeconds is not 0)
    timerStartStopBtn.textContent = "Resume";
    // Remove the '.running' class
    timerStartStopBtn.classList.remove('running');
}

/**
 * Resets the timer back to the input screen.
 */
function resetTimer() {
    // Stop the interval if it's running
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset all state variables
    totalSeconds = 0;
    isTimerRunning = false;

    // Reset the button text and style
    timerStartStopBtn.textContent = "Start";
    timerStartStopBtn.classList.remove('running');

    // Show the input boxes again
    timerInputs.style.display = 'flex';
    // Hide the running timer display
    timerDisplay.style.display = 'none';
    
    // We don't reset the input values, so the user can easily run the same timer again.
}

/**
 * Updates the timer's H:M:S display (the running clock).
 */
function updateTimerDisplay() {
    // Calculate how many full hours are in totalSeconds
    const hours = Math.floor(totalSeconds / 3600);
    // Calculate how many full minutes are left *after* hours are removed
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // Calculate how many seconds are left *after* minutes are removed
    const seconds = totalSeconds % 60;

    // Update the HTML content, using pad() to add leading zeros
    tHrEl.textContent = pad(hours);
    tMinEl.textContent = pad(minutes);
    tSecEl.textContent = pad(seconds);
}

/**
 * Called when the timer reaches zero.
 */
function finishTimer() {
    // Stop the interval
    clearInterval(timerInterval);
    // Clear the interval reference
    timerInterval = null;
    
    // Rewind the beep sound to the beginning (in case it's played back-to-back)
    timerBeep.currentTime = 0;
    // Play the beep sound
    timerBeep.play();
    
    // Set the display to "00:00:00"
    tHrEl.textContent = "00";
    tMinEl.textContent = "00";
    tSecEl.textContent = "00";
    
    // Use 'setTimeout' to delay the alert slightly. This ensures the beep
    // has a moment to play before the browser's alert "pauses" everything.
    setTimeout(() => {
        // Show a popup alert
        alert("Time's Up!");
        // Reset the timer back to the input screen
        resetTimer();
    }, 100); // Wait 100 milliseconds
}