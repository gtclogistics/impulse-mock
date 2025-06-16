document.addEventListener("DOMContentLoaded", () => {
  const dashboard = document.getElementById("dashboard");
  const toggleBtn = document.querySelector(".dashboard-toggle");
  const notificationBox = document.getElementById("notification-box");

  // Navigation functions
  window.goHome = () => window.location.href = "../Pages/home";
  window.goToSettings = () => window.location.href = "/settings";
  window.goToProfile = () => window.location.href = "/profile";
  window.goToAbout = () => window.location.href = "/about";
  window.navigateTo = (page) => window.location.href = page;

  // Toggle Notifications
  window.toggleNotifications = () => {
    if (notificationBox) {
      notificationBox.classList.toggle("hidden");
    }
  };

  // Toggle Sidebar Dashboard
  window.toggleDashboard = () => {
    if (dashboard.classList.contains("show")) {
      dashboard.classList.remove("show");
      document.body.classList.remove("with-dashboard");
    } else {
      dashboard.classList.add("show");
      document.body.classList.add("with-dashboard");
    }
  };

  // Toggle via button (prevent close on button click)
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent closing when toggle is clicked
      toggleDashboard();
    });
  }

  // Close Dashboard when clicking outside
  document.addEventListener("click", (event) => {
    if (
        dashboard.classList.contains("show") &&
        !dashboard.contains(event.target) &&
        !toggleBtn.contains(event.target)
    ) {
      dashboard.classList.remove("show");
      document.body.classList.remove("with-dashboard");
    }
  });
});
