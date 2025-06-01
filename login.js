document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    togglePasswordBtn.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        togglePasswordBtn.textContent = isHidden ? "🙈" : "👁️";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;

        emailError.classList.remove("show");
        passwordError.classList.remove("show");

        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        if (!emailVal) {
            emailError.textContent = "Email is required";
            emailError.classList.add("show");
            valid = false;
        }

        if (!passwordVal) {
            passwordError.textContent = "Password is required";
            passwordError.classList.add("show");
            valid = false;
        }

        if (!valid) return;

        if (
            emailVal === "admin@company.com" &&
            passwordVal === "@p1#f3S$N7f%z8T3&"
        ) {
            alert("Form submitted");
            // simulate redirection: window.location.href = "/home.html";
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
