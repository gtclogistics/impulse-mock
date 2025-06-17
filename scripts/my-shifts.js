document.addEventListener("DOMContentLoaded", () => {
  const calendarListView = document.getElementById("calendar-list-view");
  const calendarGridView = document.getElementById("calendar-grid-view");
  const table = document.querySelector(".calendar-table");
  const requestBtn = document.querySelector(".request-btn");
  const plusBtn = document.querySelector(".plus-btn");
  const dashboard = document.getElementById("dashboard");
  const dashboardToggle = document.getElementById("dashboard-toggle");
  const bellIcon = document.getElementById("notification-link");
  const notificationBox = document.querySelector(".notification-box");
  const monthYearTitle = document.getElementById("month-year-title");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const viewSelector = document.getElementById("view-selector");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  let currentView = localStorage.getItem("lastView") || "grid";
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
  let currentDate = new Date(today);

  const activeShifts = ["2025-06-10", "2025-06-11", "2025-06-12", "2025-06-13", "2025-06-14","2025-06-16"];

  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
  nextWeekStart.setHours(0, 0, 0, 0);

  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  nextWeekEnd.setHours(23, 59, 59, 999);

  function autoSubmitIfPastDeadline() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
    const submitted = JSON.parse(localStorage.getItem("submittedAvailability") || "false");
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    const saturday = new Date(monday);
    saturday.setDate(saturday.getDate() + 5);
    saturday.setHours(23, 59, 0, 0);
    if (now > saturday && !submitted) {
      const selectedCheckboxes = JSON.parse(localStorage.getItem("selectedDays") || "[]");
      localStorage.setItem("submittedAvailability", true);
      localStorage.setItem("selectedDays", JSON.stringify(selectedCheckboxes));
    }
  }

  function getShiftStatus(day, isCurrentMonth) {
    if (!isCurrentMonth) return "";
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    cellDate.setHours(0, 0, 0, 0);
    const isoDate = cellDate.toISOString().split("T")[0];
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));

    const startedShifts = JSON.parse(localStorage.getItem("startedShifts") || "{}");
    const endedShifts = JSON.parse(localStorage.getItem("endedShifts") || "{}");
    const isStarted = startedShifts[isoDate];
    const isEnded = endedShifts[isoDate];
    const isToday = isoDate === today.toISOString().split("T")[0];

    const shiftStart = new Date(cellDate);
    shiftStart.setHours(9, 0, 0, 0);
    const shiftEnd = new Date(cellDate);
    shiftEnd.setHours(16, 0, 0, 0);

    if (isStarted && isEnded) return "Shift Completed";
    if (activeShifts.includes(isoDate)) {
      if (isToday && !isStarted && now >= shiftStart && now <= shiftEnd) return "Active Shift";
      if (isToday && !isStarted && now > shiftEnd) return "Incomplete Active Shift";
      if (!isToday && !isStarted && now > shiftEnd) return "Incomplete Active Shift";
      return "Active Shift";
    }

    const submitted = JSON.parse(localStorage.getItem("selectedDays") || "[]");
    const weekday = cellDate.toLocaleString("en-US", { weekday: "long" });
    if (cellDate >= nextWeekStart && cellDate <= nextWeekEnd && submitted.includes(weekday)) {
      return "Availability Submitted";
    }

    return "";
  }

  function updateMonthYearTitle(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    if (monthYearTitle) {
      monthYearTitle.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
  }

  function updateCalendarView() {
    const isGrid = currentView === "grid";
    calendarListView?.classList.toggle("hidden", isGrid);
    calendarGridView?.classList.toggle("hidden", !isGrid);
    if (table) table.style.display = isGrid ? "table" : "none";
    requestBtn?.style && (requestBtn.style.display = "block");
    plusBtn?.style && (plusBtn.style.display = "block");
    updateMonthYearTitle(currentDate);
    isGrid ? renderClassicCalendar(currentDate) : renderListView(currentDate);
    if (scrollTopBtn) scrollTopBtn.classList.toggle("hidden", isGrid);
  }

  function renderClassicCalendar(date) {
    const tableBody = document.querySelector(".calendar-table tbody");
    if (!tableBody) return;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    tableBody.innerHTML = "";
    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const td = document.createElement("td");
      const cellDate = new Date(year, month, day);
      const isoDate = cellDate.toISOString().split("T")[0];
      const status = getShiftStatus(day, true);
      if (status === "Shift Completed") td.classList.add("completed");
      else if (status === "Active Shift") td.classList.add("active");
      else if (status === "Availability Submitted") td.classList.add("availability");
      else if (status === "Incomplete Active Shift") td.classList.add("incomplete");

      td.innerHTML = `
        <div class='corner-label'>${day}</div>
        <div class='status-label'>${status}</div>
      `;
      td.addEventListener("click", () => {
        const message =
            status === "Incomplete Active Shift" ? "You missed your shift today." :
                status === "Active Shift" ? "You have a shift today." :
                    status === "Shift Completed" ? "Good job! Shift complete." :
                        status === "Availability Submitted" ? "Availability submitted." :
                            "No shift today.";
        localStorage.setItem("shiftDetail", JSON.stringify({ date: isoDate, status, message }));
        localStorage.setItem("lastView", "grid");
        window.location.replace("../Pages/shift-details.html");
      });

      row.appendChild(td);
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        tableBody.appendChild(row);
        row = document.createElement("tr");
      }
    }
  }

  function renderListView(date) {
    calendarListView.innerHTML = "";
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const item = document.createElement("div");
      item.className = "list-item";
      const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isoDate = cellDate.toISOString().split("T")[0];
      const status = getShiftStatus(day, true);
      const statusClass = status === "Shift Completed" ? "completed" :
          status === "Active Shift" ? "active" :
              status === "Availability Submitted" ? "availability" :
                  status === "Incomplete Active Shift" ? "incomplete" : "";

      item.innerHTML = `
        <div class="list-date">${cellDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <div class="list-status ${statusClass}">${status || "—"}</div>
      `;
      item.addEventListener("click", () => {
        const message = status ? `${status}` : "No shift";
        localStorage.setItem("shiftDetail", JSON.stringify({ date: isoDate, status, message }));
        localStorage.setItem("lastView", "list");
        window.location.replace("../Pages/shift-details.html");
      });

      calendarListView.appendChild(item);
    }
  }

  if (viewSelector) {
    viewSelector.value = currentView;
    viewSelector.addEventListener("change", (e) => {
      currentView = e.target.value;
      localStorage.setItem("lastView", currentView);
      updateCalendarView();
    });
  }

  dashboardToggle?.addEventListener("click", () => {
    const isOpen = dashboard.classList.toggle("show");
    document.body.classList.toggle("dashboard-open", isOpen);
    dashboardToggle.classList.toggle("hidden", isOpen);
    bellIcon.classList.toggle("hidden", isOpen);
    notificationBox?.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
        document.body.classList.contains("dashboard-open") &&
        !dashboard.contains(e.target) &&
        !dashboardToggle.contains(e.target)
    ) {
      dashboard.classList.remove("show");
      document.body.classList.remove("dashboard-open");
      dashboardToggle.classList.remove("hidden");
      bellIcon.classList.remove("hidden");
    }
  });

  prevMonthBtn?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendarView();
  });

  nextMonthBtn?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendarView();
  });

  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (currentView !== "grid") {
        scrollTopBtn.classList.toggle("hidden", window.scrollY < 200);
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  autoSubmitIfPastDeadline();
  updateCalendarView();
});
