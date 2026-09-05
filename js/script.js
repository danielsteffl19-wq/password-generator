const passwordInput = document.getElementById("password");
const passwordLength = document.getElementById("password_length");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy_button");

const copyAlert = document.getElementById("copy_alert");

const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

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
    alert("Password length must be between 4 and 64.");
    return "";
}

    if (characterSet.length === 0) {
        alert("Select at least one character type.");
        return "";
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        password += getRandomCharacter(characterSet);
    }

    return password;
}

generateButton.addEventListener("click", () => {
    const password = generatePassword();
    passwordInput.value = password;
});

copyButton.addEventListener("click", () => {
    const password = passwordInput.value;

    navigator.clipboard.writeText(password);

    copyButton.textContent = "Copied!";
    copyButton.style.backgroundColor = "var(--color-primary)";
    copyButton.style.color = "var(--color-surface)";

    copyAlert.style.opacity = "1";
    copyAlert.style.transform = "translateY(0)";

    setTimeout(() => {
        copyButton.textContent = "Copy";
        copyButton.style.backgroundColor = "";
        copyButton.style.color = "";

        copyAlert.style.opacity = "0";
        copyAlert.style.transform = "translateY(20px)";
    }, 1500);
});