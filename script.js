// Run this function when the whole page (including images/styles) finishes loading.
// This ensures the DOM elements we query exist.
window.onload = () => {
    // Grab the height unit selector (cm or ft-in)
    const heightUnitSelect = document.querySelector("#height-unit");
    // Grab the wrapper DIV that contains the cm input
    const cmInputDiv = document.querySelector("#cm-input");
    // Grab the wrapper DIV that contains the feet & inches inputs
    const ftInInputDiv = document.querySelector("#ft-in-input");
    // Grab the calculate button
    const button = document.querySelector("#button");

    // Add an event listener to the height unit selector.
    // Whenever the user changes the selection, this callback runs.
    heightUnitSelect.addEventListener("change", () => {
        // If the user chose "cm", show the cm input and hide ft/in inputs.
        if (heightUnitSelect.value === "cm") {
            cmInputDiv.classList.remove("hidden"); // remove hidden class -> visible
            ftInInputDiv.classList.add("hidden");  // add hidden class -> hidden
        } else {
            // Otherwise (e.g., "ft-in"), hide cm input and show ft/in input.
            cmInputDiv.classList.add("hidden");
            ftInInputDiv.classList.remove("hidden");
        }
    });

    // Add a click event listener to the calculate button.
    // When clicked, the calculateBMI function below gets executed.
    button.addEventListener("click", calculateBMI);
};

// Main function that reads inputs, validates, converts, calculates and shows BMI.
function calculateBMI() {
    // Read which units are selected for height and weight
    const heightUnit = document.querySelector("#height-unit").value;
    const weightUnit = document.querySelector("#weight-unit").value;

    // Grab the input elements for height (cm, ft, in) and weight
    const heightCmInput = document.querySelector("#height-cm");
    const heightFtInput = document.querySelector("#height-ft");
    const heightInInput = document.querySelector("#height-in");
    const weightInput = document.querySelector("#weight");
    const resultDiv = document.querySelector("#result"); // where we'll display messages

    // Variables that will hold converted metric values
    let heightInCm = 0;
    let weightInKg = 0;

    // --- Height handling ---
    if (heightUnit === "cm") {
        // If cm is selected, parse the cm input to a floating point number
        // parseFloat("") -> NaN if empty; parseFloat("180") -> 180
        heightInCm = parseFloat(heightCmInput.value);
    } else {
        // If ft/in is selected, parse both inputs; fallback to 0 for empty or invalid values.
        // The `|| 0` makes empty or NaN convert to 0, which avoids NaN in math below.
        const feet = parseFloat(heightFtInput.value) || 0;
        const inches = parseFloat(heightInInput.value) || 0;
        // Convert feet -> cm and inches -> cm using exact conversions:
        // 1 foot = 30.48 cm (12 * 2.54), 1 inch = 2.54 cm
        heightInCm = (feet * 30.48) + (inches * 2.54);
    }

    // --- Weight handling ---
    // Parse the weight input; parseFloat returns NaN if input empty or invalid.
    const weight = parseFloat(weightInput.value);
    if (weightUnit === "kg") {
        // If kg chosen, use it directly
        weightInKg = weight;
    } else {
        // If lbs chosen, convert lbs to kg. 1 kg ≈ 2.20462 lbs
        weightInKg = weight / 2.20462;
    }

    // --- Validation ---
    // Ensure height is a number and > 0
    if (isNaN(heightInCm) || heightInCm <= 0) {
        resultDiv.innerHTML = "Please provide a valid height.";
        return; // stop execution
    }
    // Ensure weight is a number and > 0
    if (isNaN(weightInKg) || weightInKg <= 0) {
        resultDiv.innerHTML = "Please provide a valid weight.";
        return; // stop execution
    }

    // --- BMI calculation ---
    const heightInM = heightInCm / 100; // convert cm to meters
    // Calculate BMI (kg / m^2). toFixed(2) formats to two decimal places as a string.
    const bmi = (weightInKg / (heightInM * heightInM)).toFixed(2);

    // --- Display the result with simple categories ---
    // Note: bmi is a string (because of toFixed). JavaScript coerces it for numeric comparison,
    // but you could use parseFloat(bmi) to be explicit.
    if (bmi < 18.6) {
        resultDiv.innerHTML = `Under Weight: <span>${bmi}</span>`;
    } else if (bmi >= 18.6 && bmi < 24.9) {
        resultDiv.innerHTML = `Normal: <span>${bmi}</span>`;
    } else {
        resultDiv.innerHTML = `Over Weight: <span>${bmi}</span>`;
    }
}
