function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    message.textContent = "";

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return false;
    }

    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        return false;
    }

    alert("Registration successful!");
    return true;
}
