const passwordInput = document.getElementById("password");
const passwordLength = document.getElementById("password_length");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy_button");

const errorAlert = document.getElementById("error_alert");

const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const strengthValue = document.getElementById("strength_value");
const strengthProgress = document.getElementById("strength_progress");

function getCharacterSet() {
    let characterSet = "";

    if (lowercase.checked) {
        characterSet += lowercaseChars;
    }

    if (uppercase.checked) {
        characterSet += uppercaseChars;
    }

    if (numbers.checked) {
        characterSet += numberChars;
    }

    if (symbols.checked) {
        characterSet += symbolChars;
    }

    return characterSet;
}

function getRandomCharacter(characterSet) {
    const randomValue = new Uint32Array(1);
    crypto.getRandomValues(randomValue);

    const randomIndex = randomValue[0] % characterSet.length;

    return characterSet[randomIndex];
}

function generatePassword() {
    const length = Number(passwordLength.value);
    const characterSet = getCharacterSet();

    if (length < 4 || length > 64) {
    showErrorAlert("Password length must be between 4 and 64.");
    return "";
}

    if (characterSet.length === 0) {
        showErrorAlert("Select at least one character type.");
        return "";
    }
    
    let password = "";

    for (let i = 0; i < length; i++) {
        password += getRandomCharacter(characterSet);
    }

    return password;
}

function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    return score;
}

let errorAlertTimeout;

function showErrorAlert(message) {
    clearTimeout(errorAlertTimeout);

    errorAlert.textContent = message;

    errorAlert.style.opacity = "1";
    errorAlert.style.transform = "translateY(0)";

    errorAlertTimeout = setTimeout(() => {
        errorAlert.style.opacity = "0";
        errorAlert.style.transform = "translateY(20px)";
    }, 1500);
}

function updatePasswordStrength(password) {
    const score = getPasswordStrength(password);

    if (score <= 2) {
        strengthValue.textContent = "Weak";
        strengthProgress.style.width = "33%";
        strengthProgress.style.backgroundColor = "#04530b";
    } else if (score <= 4) {
        strengthValue.textContent = "Medium";
        strengthProgress.style.width = "66%";
        strengthProgress.style.backgroundColor = "#098c09";
    } else {
        strengthValue.textContent = "Strong";
        strengthProgress.style.width = "100%";
        strengthProgress.style.backgroundColor = "var(--color-primary)";
    }
}

generateButton.addEventListener("click", () => {
    const password = generatePassword();

    if (!password) {
        return;
    }

    passwordInput.value = password;
    updatePasswordStrength(password);
});

copyButton.addEventListener("click", async () => {
    const password = passwordInput.value;

    try {
        await navigator.clipboard.writeText(password);

        copyButton.textContent = "Copied!";
        copyButton.style.backgroundColor = "var(--color-primary)";
        copyButton.style.color = "var(--color-surface)";

        setTimeout(() => {
            copyButton.textContent = "Copy";
            copyButton.style.backgroundColor = "";
            copyButton.style.color = "";
        }, 1500);

    } catch (error) {
        showErrorAlert("Unable to copy password.");
    }
});


const initialPassword = generatePassword();

if (initialPassword) {
    passwordInput.value = initialPassword;
    updatePasswordStrength(initialPassword);
}