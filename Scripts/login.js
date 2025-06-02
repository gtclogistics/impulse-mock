document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    togglePasswordBtn.addEventListener("click", () => {
        togglePasswordBtn.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";

            // Update the eye icon
            const eyeIcon = document.getElementById("eyeIcon");
            eyeIcon.textContent = isHidden ? "👁️" : "👁️‍🗨️";  // Visible: eye only, Hidden: eye with slash
        });

    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Reset error visibility
        emailError.classList.remove("show");
        passwordError.classList.remove("show");

        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        let valid = true;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.(gmail\.com|outlook\.com)$/;
        if (!emailRegex.test(emailVal)) {
            emailError.textContent = "Invalid credentials";
            emailError.classList.add("show");
            valid = false;
        }

        // Password Validation
        const isLengthValid = passwordVal.length >= 6 && passwordVal.length <= 15;
        const hasUppercase = /[A-Z]/.test(passwordVal);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordVal);

        if (!isLengthValid || !hasUppercase || !hasSpecialChar) {
            passwordError.textContent = "Invalid credentials";
            passwordError.classList.add("show");
            valid = false;
        }

        if (!valid) return;

        // Final authentication check
        if (
            emailVal === "admin@company.com" &&
            passwordVal === "@p1#f3S$N7f%z8T3&"
        ) {
            alert("Form submitted");
            // simulate redirect: window.location.href = "/home.html";
        } else {
            alert(`Logging in with the details\nemail: ${emailVal},\npassword: ${passwordVal}`);
        }
    });


    // Support pressing Enter to trigger form submission
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                form.dispatchEvent(new Event("submit"));
            }
        });

        input.addEventListener("input", () => {
            emailError.classList.remove("show");
            passwordError.classList.remove("show");
        });
    });
});
