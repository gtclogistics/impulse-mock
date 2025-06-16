const form = document.getElementById("availabilityForm");
const checkboxes = form.querySelectorAll("input[type='checkbox']");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const editBtn = document.getElementById("editBtn");

const submitted = localStorage.getItem("availabilitySubmitted") === "true";
const savedDays = JSON.parse(localStorage.getItem("selectedDays")) || [];
const submitDeadline = getSundayDeadline();

// 1. Load existing selections
checkboxes.forEach(cb => {
    if (savedDays.includes(cb.value)) cb.checked = true;
    cb.addEventListener("change", () => {
        saveSelection();
    });
});

// 2. Auto-submit if deadline has passed and not yet submitted
if (!submitted && savedDays.length > 0 && new Date() > submitDeadline) {
    autoSubmit(savedDays);
}

// 3. Show/hide buttons
if (submitted) {
    disableForm();
    submitBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
    message.textContent = "Availability submitted.";
} else {
    submitBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
}

// 4. Manual Submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = getSelectedDays();
    if (selected.length === 0) {
        alert("Please select at least one day.");
        return;
    }
    saveToStorage(selected);
    message.textContent = "Availability submitted successfully.";
    disableForm();
    submitBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
});

// 5. Edit button logic
editBtn.addEventListener("click", () => {
    checkboxes.forEach(cb => cb.disabled = false);
    submitBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
    message.textContent = "Editing availability...";
    localStorage.setItem("availabilitySubmitted", "false");
});

// 🔧 Helpers
function getSelectedDays() {
    return Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
}

function saveSelection() {
    const selected = getSelectedDays();
    localStorage.setItem("selectedDays", JSON.stringify(selected));
}

function saveToStorage(days) {
    localStorage.setItem("availabilitySubmitted", "true");
    localStorage.setItem("selectedDays", JSON.stringify(days));
    disableForm();
}

function disableForm() {
    checkboxes.forEach(cb => cb.disabled = true);
}

function autoSubmit(days) {
    saveToStorage(days);
    message.textContent = "Availability auto-submitted at Sunday 11:59 PM.";
    submitBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
}

function getSundayDeadline() {
    const now = new Date();
    const currentDay = now.getDay(); // Sunday = 0
    const daysUntilSunday = (7 - currentDay) % 7;
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + daysUntilSunday);
    sunday.setHours(23, 59, 0, 0); // 11:59 PM
    return sunday;
}
