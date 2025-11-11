// Run this function after the entire page (HTML, CSS, etc.) has loaded
window.onload = () => {
    // Get the height unit dropdown element (for "cm" or "ft-in")
    const heightUnitSelect = document.querySelector("#height-unit");

    // Get the DIV that contains the "cm" input field
    const cmInputDiv = document.querySelector("#cm-input");

    // Get the DIV that contains the "ft" and "in" input fields
    const ftInInputDiv = document.querySelector("#ft-in-input");

    // Get the "Calculate BMI" button
    const button = document.querySelector("#button");

    //  Initial setup when the page loads
    // Check the default selected height unit and show/hide inputs accordingly
    if (heightUnitSelect.value === "cm") {
        cmInputDiv.classList.remove("hidden");  // Show the cm input box
        ftInInputDiv.classList.add("hidden");   // Hide the feet/inch input box
    } else {
        cmInputDiv.classList.add("hidden");     // Hide cm input box
        ftInInputDiv.classList.remove("hidden");// Show feet/inch input box
    }

    // Add an event listener that triggers when user changes the height unit
    heightUnitSelect.addEventListener("change", () => {
        // If user selects "cm"
        if (heightUnitSelect.value === "cm") {
            cmInputDiv.classList.remove("hidden");  // Show cm input
            ftInInputDiv.classList.add("hidden");   // Hide ft/in input
        } else {
            // If user selects "ft-in"
            cmInputDiv.classList.add("hidden");     // Hide cm input
            ftInInputDiv.classList.remove("hidden");// Show ft/in input
        }
    });

    // Add a click event listener to the Calculate button
    // When user clicks, the calculateBMI() function is called
    button.addEventListener("click", calculateBMI);
};

// --- Function that calculates and displays the BMI ---
function calculateBMI() {
    // Get currently selected height unit ("cm" or "ft-in")
    const heightUnit = document.querySelector("#height-unit").value;

    // Get currently selected weight unit ("kg" or "lbs")
    const weightUnit = document.querySelector("#weight-unit").value;

    // Get the height input elements (for cm, ft, and in)
    const heightCmInput = document.querySelector("#height-cm");
    const heightFtInput = document.querySelector("#height-ft");
    const heightInInput = document.querySelector("#height-in");

    // Get the weight input element
    const weightInput = document.querySelector("#weight");

    // Get the div where result (BMI) will be displayed
    const resultDiv = document.querySelector("#result");

    // Create variables to store converted height and weight
    let heightInCm = 0; // Height in centimeters
    let weightInKg = 0; // Weight in kilograms

    // --- Handle Height Conversion ---
    if (heightUnit === "cm") {
        // If height is entered in cm, directly convert input to number
        heightInCm = parseFloat(heightCmInput.value);
    } else {
        // If height entered in feet and inches
        // Convert both inputs to numbers, if empty -> 0
        const feet = parseFloat(heightFtInput.value) || 0;
        const inches = parseFloat(heightInInput.value) || 0;

        // Convert feet and inches to centimeters
        // 1 foot = 30.48 cm, 1 inch = 2.54 cm
        heightInCm = (feet * 30.48) + (inches * 2.54);
    }

    // --- Handle Weight Conversion ---
    // Convert input string to number
    const weight = parseFloat(weightInput.value);

    // If weight is entered in kilograms
    if (weightUnit === "kg") {
        weightInKg = weight; // Use directly
    } else {
        // If entered in pounds, convert lbs to kg
        // 1 kg = 2.20462 lbs
        weightInKg = weight / 2.20462;
    }

    // --- Input Validation ---
    // Check if height is valid (> 0 and not NaN)
    if (isNaN(heightInCm) || heightInCm <= 0) {
        resultDiv.innerHTML = "Please provide a valid height."; // Error message
        return; // Stop function execution
    }

    // Check if weight is valid (> 0 and not NaN)
    if (isNaN(weightInKg) || weightInKg <= 0) {
        resultDiv.innerHTML = "Please provide a valid weight."; // Error message
        return; // Stop function execution
    }

    // --- BMI Calculation ---
    // Convert height from cm to meters
    const heightInM = heightInCm / 100;

    // Calculate BMI using formula: weight(kg) / [height(m)]²
    // .toFixed(2) rounds the value to 2 decimal places
    const bmi = (weightInKg / (heightInM * heightInM)).toFixed(2);

    // --- Display BMI Result with Category ---
    // Compare BMI value with standard categories
    if (bmi < 18.6) {
        resultDiv.innerHTML = `Under Weight: <span>${bmi}</span>`; // If BMI < 18.6
    } else if (bmi >= 18.6 && bmi < 24.9) {
        resultDiv.innerHTML = `Normal: <span>${bmi}</span>`; // If 18.6 ≤ BMI < 24.9
    } else {
        resultDiv.innerHTML = `Over Weight: <span>${bmi}</span>`; // If BMI ≥ 24.9
    }
}
