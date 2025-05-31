document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Example validation (replace with real backend integration)
    console.log("Logging in with:", email, password);
    alert("Login submitted! (Backend logic needed)");
});

document.getElementById('forgotPassword').addEventListener('click', function (e) {
    e.preventDefault();
    alert("Redirect to Forgot Password page (not implemented).");
});
