document.addEventListener("DOMContentLoaded", () => {
    const eyeOpen = "https://img.icons8.com/ios-filled/24/visible.png";
    const eyeClosed = "https://img.icons8.com/ios-filled/24/closed-eye.png";

    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("errorMessages");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const strengthText = document.getElementById("strength");

    // Set closed eye initially
    const togglePassword = document.getElementById("togglePassword");
    togglePassword.src = eyeClosed;
    togglePassword.addEventListener("click", () => {
        const visible = passwordInput.type === "text";
        passwordInput.type = visible ? "password" : "text";
        togglePassword.src = visible ? eyeClosed : eyeOpen;
    });

    const toggleConfirm = document.getElementById("toggleConfirmPassword");
    toggleConfirm.src = eyeClosed;
    toggleConfirm.addEventListener("click", () => {
        const visible = confirmPasswordInput.type === "text";
        confirmPasswordInput.type = visible ? "password" : "text";
        toggleConfirm.src = visible ? eyeClosed : eyeOpen;
    });

    // Password strength checker
    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        let strength = "Weak";
        const strongPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        const mediumPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,7}$/;

        if (strongPattern.test(val)) strength = "Strong";
        else if (mediumPattern.test(val)) strength = "Medium";

        strengthText.textContent = `Strength: ${strength}`;
        strengthText.style.display = val.length ? "block" : "none";
    });

    // Submit handler with validation warnings
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        errorBox.innerHTML = "";
        errorBox.style.display = "none";

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const errors = [];

        if (!name) {
            errors.push("Full name is required.");
        } else if (/\d/.test(name)) {
            errors.push("Full name cannot contain numbers.");
        }

        if (!email) {
            errors.push("Email is required.");
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.push("Invalid email address.");
        }

        const strongPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!password) {
            errors.push("Password is required.");
        } else if (!strongPattern.test(password)) {
            errors.push("Password must be strong (8+ characters, letters, numbers, special characters).");
        }

        if (!confirmPassword) {
            errors.push("Password confirmation is required.");
        } else if (password !== confirmPassword) {
            errors.push("Passwords do not match.");
        }

        if (errors.length > 0) {
            errorBox.innerHTML = errors.map(msg => `<p>${msg}</p>`).join("");
            errorBox.style.display = "block";
        } else {
            alert(`Registration successful: Name=${name}, Email=${email}`);
            // You can replace alert with actual backend submission logic
        }
    });
});
