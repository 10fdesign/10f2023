document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".mobile-menu-icon").forEach(icon => icon.addEventListener("click", function() {
    document.querySelector("body").classList.toggle("overflow-hidden");
    document.getElementById("mobile-menu").classList.toggle("!h-screen");
    document.getElementById("scrolled-header").classList.toggle("shadow");
  }));
});