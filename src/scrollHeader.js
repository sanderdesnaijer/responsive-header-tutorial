export const scrollHeader = (
  element,
  {
    className = "hide-menu",
    offsetSelector = "[data-scroll-anchor]",
    mediaQueryMatch = "(min-width: 48rem)",
  } = {}
) => {
  const offsetElement = element.querySelector(offsetSelector);
  if (!offsetElement) {
    console.warn(`no ${offsetSelector} has been found`);
  }
  const offset = offsetElement?.getBoundingClientRect().height || 0;
  const mediaQuery = window.matchMedia(mediaQueryMatch);

  let direction = "";
  let lastY = null;
  let isPastOffset = false;
  let isDisabled = mediaQuery.matches;

  const onScroll = () => {
    if (isDisabled) return;

    const { scrollY } = window;

    isPastOffset = scrollY > offset;

    const isAtBottom =
      scrollY + window.innerHeight >= document.documentElement.scrollHeight;

    if (!isAtBottom && lastY !== null) {
      direction = scrollY > lastY ? "down" : "up";
    }

    element.classList.toggle(className, isPastOffset && direction === "down");

    lastY = scrollY;
  };

  const onMediaChange = (event) => {
    isDisabled = event.matches;

    if (event.matches) {
      element.classList.remove(className);
    }
  };
  mediaQuery.addEventListener("change", onMediaChange);

  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", onScroll);
    mediaQuery.removeEventListener("change", onMediaChange);
    element.classList.remove(className);
  };
};
