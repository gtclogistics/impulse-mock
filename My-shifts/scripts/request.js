const tbody = document.getElementById("requests-body");
const reasonInput = document.getElementById("reason-input");
const dateSelect = document.getElementById("date-select");
const statusSelect = document.getElementById("status-select");
const requestForm = document.getElementById("requestForm");

// Load existing requests from localStorage
function loadRequests() {
    const requests = JSON.parse(localStorage.getItem("notifications")) || [];
    tbody.innerHTML = "";

    requests.forEach(req => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${req.date}</td>
            <td>${req.status}</td>
            <td>${req.message}</td>
        `;
        tbody.appendChild(row);
    });
}

// Submit a new request
function submitRequest(event) {
    event.preventDefault(); // Prevent page reload

    const reason = reasonInput.value.trim();
    const selectedDay = dateSelect.value;
    const selectedStatus = statusSelect.value;

    if (!selectedDay || !selectedStatus || !reason) {
        alert("Please select a date, status, and enter a reason.");
        return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const newRequest = {
        date: formattedDate,
        status: "Pending",
        message: `Request for ${selectedDay} - ${selectedStatus}: ${reason}`
    };

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift(newRequest);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    loadRequests();

    // Reset form
    dateSelect.value = "";
    statusSelect.value = "";
    reasonInput.value = "";

    alert("Request submitted successfully!");
}

// Initialize
window.onload = () => {
    loadRequests();
    requestForm.addEventListener("submit", submitRequest);
};
