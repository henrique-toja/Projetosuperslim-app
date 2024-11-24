document.addEventListener('touchmove', function(event) {
  if (window.scrollY === 0 && event.touches[0].clientY > 0) {
    event.preventDefault(); // Bloqueia o pull-to-refresh
  }
}, { passive: false });