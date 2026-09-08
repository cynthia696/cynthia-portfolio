(() => {
  document.querySelectorAll(".footer-photo").forEach((el) => {
    el.addEventListener("click", () => {
      const on = el.classList.toggle("is-flipped");
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
})();
