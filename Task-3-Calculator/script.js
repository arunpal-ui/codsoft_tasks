
const result = document.getElementById("result");
const history = document.getElementById("history");

let expression = "";
let calculated = false;

// Display values
function updateDisplay() {
    result.value = expression || "0";
}

// Add numbers and operators
function appendValue(value) {

    const operators = ["+", "-", "*", "/", "%"];

    if (calculated) {
        if (operators.includes(value) && value !== "%") {
            calculated = false;
        } else {
            expression = "";
            history.textContent = "";
            calculated = false;
        }
    }

    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) return;

        if (currentNumber === "") {
            expression += "0";
        }
    }

    if (operators.includes(value)) {
        if (expression === "" && value !== "-") return;

        const lastChar = expression.slice(-1);

        if (operators.includes(lastChar)) {
            if (value === "-" && lastChar !== "-") {
                expression += value;
            } else {
                expression = expression.slice(0, -1) + value;
            }
            updateDisplay();
            return;
        }
    }

    expression += value;
    updateDisplay();
}

// Clear display
function clearDisplay() {
    expression = "";
    history.textContent = "";
    calculated = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (calculated) {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
}

// Calculate result safely
function calculate() {

    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const answer = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Math error");
        }

        history.textContent = expression + " =";

        expression = String(
            Number(answer.toPrecision(12))
        );

        calculated = true;
        updateDisplay();

    } catch (error) {
        result.value = "Error";
        expression = "";
        calculated = false;
    }
}

// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;

    if ("0123456789+-*/%.".includes(key) && key.length === 1) {
        appendValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearDisplay();
    }
});
