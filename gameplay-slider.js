(() => {
  const root = document.querySelector("[data-gameplay-carousel]");
  if (!root) return;

  const track = root.querySelector(".gameplay-track");
  const slides = Array.from(root.querySelectorAll(".gameplay-slide"));
  const dots = Array.from(root.querySelectorAll(".gameplay-dots button"));
  const prev = root.querySelector(".gameplay-prev");
  const next = root.querySelector(".gameplay-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  let startX = null;

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", i === index ? "false" : "true"));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    render();
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    if (!reduceMotion && !document.hidden && slides.length > 1) {
      timer = setInterval(() => goTo(index + 1), 4500);
    }
  };

  prev?.addEventListener("click", () => { goTo(index - 1); start(); });
  next?.addEventListener("click", () => { goTo(index + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); start(); }));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
      start();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
      start();
    }
  });

  root.addEventListener("pointerenter", stop);
  root.addEventListener("pointerleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });

  root.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0]?.clientX ?? null;
    stop();
  }, { passive: true });

  root.addEventListener("touchend", (event) => {
    if (startX == null) {
      start();
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (Math.abs(delta) > 45) goTo(index + (delta < 0 ? 1 : -1));
    startX = null;
    start();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  render();
  start();
})();