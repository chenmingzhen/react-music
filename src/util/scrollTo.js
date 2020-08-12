export function ScrollTo(element, height, delayMs, scrollStepInPx) {
  let ele = null;
  let intervalId = null;
  function scrollStep() {
    if (ele.scrollTop === height || ele.scrollTop > height) {
      clearInterval(intervalId);
    }
    if (!ele.scroll) {
      ele.scrollTop = ele.scrollTop + scrollStepInPx;
    } else {
      ele.scroll(0, ele.scrollTop + scrollStepInPx);
    }
  }
  setTimeout(() => {
    ele = document.getElementById(element);
    if (!ele) return;
    intervalId = setInterval(scrollStep, delayMs);
  });
}
