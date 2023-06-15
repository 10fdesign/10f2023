var scrollpos = window.scrollY;
var header;
var scrolledHeaderClasses = ["opacity-0", "-translate-y-4", "invisible"];

window.addEventListener("DOMContentLoaded", function() {
  header = document.getElementById("scrolled-header");
});

function show_on_scrolled() {
  header.classList.remove(...scrolledHeaderClasses);
}

function hide_on_not_scrolled() {
  header.classList.add(...scrolledHeaderClasses);
}

window.addEventListener('scroll', function(){ 
  header = document.getElementById("scrolled-header");
  scrollpos = window.scrollY;

  if(scrollpos > 300){
    show_on_scrolled();
  }
  else {
    hide_on_not_scrolled();
  }
});