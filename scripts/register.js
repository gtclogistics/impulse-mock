const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmPasswordError");

// 👁️ Toggle password
const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {
    toggleField(passwordInput, togglePassword);
});
toggleConfirm.addEventListener("click", () => {
    toggleField(confirmInput, toggleConfirm);
});

function toggleField(input, toggleImg) {
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    toggleImg.src = type === "password"
        ? "https://img.icons8.com/ios-filled/24/closed-eye.png"
        : "https://img.icons8.com/ios-filled/24/visible.png";
}

function showError(field, message) {
    field.textContent = message;
    field.classList.add("show");
}

function clearError(field) {
    field.textContent = "";
    field.classList.remove("show");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Name
    if (nameInput.value.trim().length < 2) {
        showError(nameError, "Full Name must be at least 2 characters");
        valid = false;
    } else {
        clearError(nameError);
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailError, "Invalid email format");
        valid = false;
    } else {
        clearError(emailError);
    }

    // Password
    const passVal = passwordInput.value.trim();
    if (!passVal) {
        showError(passwordError, "Password is required");
        valid = false;
    } else if (passVal.length < 8) {
        showError(passwordError, "Password must be at least 8 characters");
        valid = false;
    } else {
        clearError(passwordError);
    }

    // Confirm Password
    if (confirmInput.value.trim() !== passVal) {
        showError(confirmError, "Passwords do not match");
        valid = false;
    } else {
        clearError(confirmError);
    }

    if (valid) {
        alert("Form submitted successfully!");
        form.reset();
    }
});

// 🧼 Error fade out after 0.3s if input corrected
[nameInput, emailInput, passwordInput, confirmInput].forEach((field) => {
    field.addEventListener("input", () => {
        setTimeout(() => {
            if (field === nameInput && nameInput.value.length >= 2) clearError(nameError);
            if (field === emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) clearError(emailError);
            if (field === passwordInput && passwordInput.value.length >= 8) clearError(passwordError);
            if (field === confirmInput && confirmInput.value === passwordInput.value) clearError(confirmError);
        }, 300);
    });
});
