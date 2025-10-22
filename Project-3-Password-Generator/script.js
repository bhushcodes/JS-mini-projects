// Character sets for password generation
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const ambiguousChars = '0Ol1I';

// DOM elements
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const excludeAmbiguousCheck = document.getElementById('excludeAmbiguous');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const passwordOutput = document.getElementById('passwordOutput');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthText = document.getElementById('strengthText');
const toast = document.getElementById('toast');

// Update length display
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

// Generate password function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    
    // Build character set based on selected options
    if (uppercaseCheck.checked) charset += charSets.uppercase;
    if (lowercaseCheck.checked) charset += charSets.lowercase;
    if (numbersCheck.checked) charset += charSets.numbers;
    if (symbolsCheck.checked) charset += charSets.symbols;
    
    // Validate that at least one option is selected
    if (charset === '') {
        showToast('Please select at least one character type!', 'error');
        return;
    }
    
    // Remove ambiguous characters if option is selected
    if (excludeAmbiguousCheck.checked) {
        charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }
    
    // Generate password using cryptographically secure random values
    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    // Ensure password contains at least one character from each selected type
    password = ensureComplexity(password, charset);
    
    // Display password
    passwordOutput.value = password;
    
    // Update strength indicator
    updateStrength(password);
    
    // Trigger animation
    generateBtn.querySelector('svg').style.animation = 'none';
    setTimeout(() => {
        generateBtn.querySelector('svg').style.animation = 'rotate 0.6s ease-in-out';
    }, 10);
}

// Ensure password has at least one character from each selected type
function ensureComplexity(password, charset) {
    const types = [];
    if (uppercaseCheck.checked) types.push({ chars: charSets.uppercase, regex: /[A-Z]/ });
    if (lowercaseCheck.checked) types.push({ chars: charSets.lowercase, regex: /[a-z]/ });
    if (numbersCheck.checked) types.push({ chars: charSets.numbers, regex: /[0-9]/ });
    if (symbolsCheck.checked) types.push({ chars: charSets.symbols, regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/ });
    
    let result = password;
    const array = new Uint32Array(types.length);
    window.crypto.getRandomValues(array);
    
    types.forEach((type, index) => {
        if (!type.regex.test(result)) {
            // Replace a random character with one from the missing type
            let chars = type.chars;
            if (excludeAmbiguousCheck.checked) {
                chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('');
            }
            const randomChar = chars[array[index] % chars.length];
            const randomPos = Math.floor(Math.random() * result.length);
            result = result.substring(0, randomPos) + randomChar + result.substring(randomPos + 1);
        }
    });
    
    return result;
}

// Calculate password strength
function updateStrength(password) {
    let strength = 0;
    const length = password.length;
    
    // Length score
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;
    if (length >= 20) strength += 1;
    
    // Complexity score
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Update UI based on strength
    strengthIndicator.className = 'strength-fill';
    
    if (strength <= 3) {
        strengthIndicator.classList.add('weak');
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#ef4444';
    } else if (strength <= 6) {
        strengthIndicator.classList.add('medium');
        strengthText.textContent = 'Medium strength';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthIndicator.classList.add('strong');
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#10b981';
    }
}

// Copy to clipboard function
async function copyToClipboard() {
    const password = passwordOutput.value;
    
    if (!password) {
        showToast('Generate a password first!', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(password);
        showToast('Password copied to clipboard!', 'success');
        
        // Visual feedback
        copyBtn.style.background = '#10b981';
        setTimeout(() => {
            copyBtn.style.background = '';
        }, 300);
    } catch (err) {
        // Fallback for older browsers
        passwordOutput.select();
        document.execCommand('copy');
        showToast('Password copied to clipboard!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#ef4444';
    } else {
        toast.style.background = '#10b981';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Allow Enter key to generate password
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generatePassword();
    }
});

// Generate initial password on load
window.addEventListener('load', () => {
    generatePassword();
});

// Validate checkbox selection
const checkboxes = [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck];
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checkedCount = checkboxes.filter(cb => cb.checked).length;
        
        // Prevent unchecking all checkboxes
        if (checkedCount === 0) {
            checkbox.checked = true;
            showToast('At least one character type must be selected!', 'error');
        }
    });
});
