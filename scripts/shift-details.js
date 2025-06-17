document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById("back-button");
    const shiftData = JSON.parse(localStorage.getItem("shiftDetail"));
    const shiftDateEl = document.getElementById("shift-date");
    const shiftInfoEl = document.getElementById("shift-info");
    const startBtn = document.getElementById("start-btn");
    const endBtn = document.getElementById("end-btn");
    const shiftTimer = document.getElementById("shift-timer");

    let timerInterval = null;

    const startedShifts = JSON.parse(localStorage.getItem("startedShifts") || "{}");
    const endedShifts = JSON.parse(localStorage.getItem("endedShifts") || "{}");

    function updateTimer(startTime) {
        const start = new Date(startTime);
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
        const seconds = Math.floor((now - start) / 1000);
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        shiftTimer.textContent = `Shift Duration: ${h}:${m}:${s}`;
    }

    function startShiftTimer(startTime) {
        updateTimer(startTime);
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => updateTimer(startTime), 1000);
    }

    function handleStartShift() {
        const dateKey = shiftData.date;
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
        startedShifts[dateKey] = now.toISOString();
        localStorage.setItem("startedShifts", JSON.stringify(startedShifts));
        startShiftTimer(now.toISOString());
        startBtn.disabled = true;
        endBtn.disabled = false;
    }

    function handleEndShift() {
        const dateKey = shiftData.date;
        const start = new Date(startedShifts[dateKey]);
        const end = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
        const duration = Math.floor((end - start) / 1000);
        const h = String(Math.floor(duration / 3600)).padStart(2, '0');
        const m = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
        const s = String(duration % 60).padStart(2, '0');
        shiftTimer.textContent = `Total Worked Time: ${h}:${m}:${s}`;
        endedShifts[dateKey] = end.toISOString();
        localStorage.setItem("endedShifts", JSON.stringify(endedShifts));
        endBtn.disabled = true;
        if (timerInterval) clearInterval(timerInterval);
    }

    backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const lastView = localStorage.getItem("lastView") || "grid";
        window.location.href = `my-shifts.html?view=${lastView}`;
    });

    if (shiftData) {
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
        const shiftDate = new Date(shiftData.date);
        const isoToday = now.toISOString().split("T")[0];
        const isoShiftDate = shiftDate.toISOString().split("T")[0];

        shiftDateEl.textContent = `Date: ${shiftData.date}`;
        const alreadyStarted = startedShifts[shiftData.date];
        const alreadyEnded = endedShifts[shiftData.date];

        if (isoToday === isoShiftDate && shiftData.status.includes("Active Shift")) {
            if (alreadyStarted && !alreadyEnded) {
                startBtn.disabled = true;
                endBtn.disabled = false;
                startShiftTimer(alreadyStarted);
                shiftInfoEl.textContent = "Shift in progress. Don’t forget to end your shift when you're done.";
            } else if (alreadyEnded) {
                const start = new Date(alreadyStarted);
                const end = new Date(alreadyEnded);
                const duration = Math.floor((end - start) / 1000);
                const h = String(Math.floor(duration / 3600)).padStart(2, '0');
                const m = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
                const s = String(duration % 60).padStart(2, '0');
                shiftTimer.textContent = `Total Worked Time: ${h}:${m}:${s}`;
                startBtn.disabled = true;
                endBtn.disabled = true;
                shiftInfoEl.textContent = "Shift already completed.";
            } else {
                startBtn.disabled = false;
                shiftInfoEl.textContent = "You have an active shift today. Please start your shift to begin tracking.";
            }
        } else {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
            endOfWeek.setHours(23, 59, 59, 999);

            if (
                shiftData.status === "Active Shift" &&
                shiftDate >= startOfWeek &&
                shiftDate <= endOfWeek
            ) {
                shiftInfoEl.textContent = "You have a shift this day.";
            } else if (shiftData.status === "Shift Completed") {
                shiftInfoEl.textContent = "Shift already completed.";
            } else if (shiftData.status === "Incomplete Active Shift") {
                shiftInfoEl.textContent = "You had a shift today but did not started or completed it.";
            } else {
                shiftInfoEl.textContent = "No shift for this date.";
            }

            startBtn.disabled = true;
            endBtn.disabled = true;
        }
    }

    startBtn.addEventListener("click", handleStartShift);
    endBtn.addEventListener("click", handleEndShift);
});
