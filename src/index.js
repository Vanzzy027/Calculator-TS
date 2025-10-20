// Define a class to manage the calculator logic and DOM interaction
var Calculator = /** @class */ (function () {
    function Calculator() {
        this.currentInput = '';
        // Use Type Assertion (as HTMLInputElement) to ensure TypeScript knows the element type
        this.display = document.getElementById('displayInput');
        this.buttonsContainer = document.getElementById('buttonsContainer');
        this.toggleTrack = document.querySelector('.toggle-track');
        if (!this.display || !this.buttonsContainer || !this.toggleTrack) {
            console.error('Missing required DOM elements. Check IDs and classes.');
            return;
        }
        this.init();
    }
    Calculator.prototype.init = function () {
        this.buttonsContainer.addEventListener('click', this.handleButtonClick.bind(this));
        this.toggleTrack.addEventListener('click', this.handleThemeToggle.bind(this));
        // Initialize display
        this.updateDisplay(this.currentInput);
        this.initTheme();
    };
    // Utility function to update the display
    Calculator.prototype.updateDisplay = function (value) {
        var displayValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add thousand separators
        this.display.value = displayValue || '0';
    };
    // Handles click events on the calculator buttons
    Calculator.prototype.handleButtonClick = function (event) {
        var _a;
        var target = event.target;
        // Ensure the clicked element is a BUTTON
        if (target.tagName !== 'BUTTON') {
            return;
        }
        var buttonText = ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        var action = target.getAttribute('data-action');
        if (action === 'reset') {
            this.currentInput = '';
            this.updateDisplay(this.currentInput);
        }
        else if (action === 'del') {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay(this.currentInput);
        }
        else if (action === 'equals') {
            this.calculateResult();
        }
        else {
            // Numbers and Operators
            this.processInput(buttonText);
        }
    };
    // Logic to calculate the result safely
    Calculator.prototype.calculateResult = function () {
        if (this.currentInput === '') {
            return;
        }
        try {
            // Replace 'x' with '*' for standard JavaScript evaluation
            var expression = this.currentInput.replace(/x/g, '*');
            // WARNING: 'eval()' is generally unsafe. For a production app, use a dedicated math parser.
            var result = eval(expression);
            // Handle non-finite results (e.g., division by zero)
            if (!isFinite(result)) {
                this.display.value = 'Error';
                this.currentInput = '';
                return;
            }
            // Limit precision for display and convert back to string
            this.currentInput = String(result);
            this.updateDisplay(this.currentInput);
        }
        catch (e) {
            this.updateDisplay('Error');
            this.currentInput = '';
        }
    };
    // Logic to build the input string
    Calculator.prototype.processInput = function (value) {
        // If display is showing an error or '0', reset
        if (this.display.value === 'Error') {
            this.currentInput = '';
        }
        // Prevent multiple operators or decimals in sequence (basic validation)
        var isOperator = ['+', '-', '/', 'x'].includes(value);
        var lastChar = this.currentInput.slice(-1);
        var isLastCharOperator = ['+', '-', '/', 'x', '.'].includes(lastChar);
        if (isOperator && (isLastCharOperator || this.currentInput === '')) {
            // Prevent starting with an operator or doubling up on operators/decimals
            if (isOperator && isLastCharOperator) {
                // Replace the last operator with the new one
                this.currentInput = this.currentInput.slice(0, -1) + value;
            }
            // Do not append if currentInput is empty and it's an operator
            if (this.currentInput === '' && isOperator)
                return;
        }
        else if (value === '.' && (this.currentInput.includes('.') || lastChar === '.')) {
            // Prevent multiple decimals (simple check)
            return;
        }
        else {
            // Handle leading zero: If input is '0', replace it with a number. Keep it if the next is a decimal.
            if (this.currentInput === '0' && value !== '.') {
                this.currentInput = value;
            }
            else {
                this.currentInput += value;
            }
        }
        this.updateDisplay(this.currentInput);
    };
    // ===================================
    // THEME LOGIC
    // ===================================
    // Initialise theme based on local storage or default to theme-1
    Calculator.prototype.initTheme = function () {
        var savedTheme = localStorage.getItem('calcTheme') || 'theme-1';
        this.setTheme(savedTheme);
    };
    // Set the theme and update the toggle position
    Calculator.prototype.setTheme = function (themeName) {
        document.body.setAttribute('data-theme', themeName);
        var themeNumber = themeName.split('-')[1]; // e.g., 'theme-1' -> '1'
        this.toggleTrack.setAttribute('data-position', themeNumber);
        localStorage.setItem('calcTheme', themeName);
    };
    // Handles click events on the theme toggle track
    Calculator.prototype.handleThemeToggle = function (event) {
        var target = event.target;
        var newThemeNumber;
        // Determine the target position
        if (target.classList.contains('toggle-btn')) {
            // Clicked the button itself, cycle to next theme
            var currentPos = parseInt(this.toggleTrack.getAttribute('data-position') || '1');
            newThemeNumber = currentPos < 3 ? currentPos + 1 : 1;
        }
        else if (target.classList.contains('theme-label')) {
            // Clicked a number label, jump directly
            newThemeNumber = parseInt(target.textContent || '1');
        }
        else {
            // Clicked the track, cycle to next theme
            var currentPos = parseInt(this.toggleTrack.getAttribute('data-position') || '1');
            newThemeNumber = currentPos < 3 ? currentPos + 1 : 1;
        }
        this.setTheme("theme-".concat(newThemeNumber));
    };
    return Calculator;
}());
// Instantiate the calculator once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    new Calculator();
});
