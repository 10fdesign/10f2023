document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".mobile-menu-icon").forEach(icon => icon.addEventListener("click", function() {
    console.log("woo")
    document.querySelector("body").classList.toggle("overflow-hidden");
    document.getElementById("mobile-menu").classList.toggle("!h-screen");
    document.getElementById("logo").classList.toggle("opacity-0");
  }));
});