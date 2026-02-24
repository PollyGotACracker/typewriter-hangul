export function setupContainer(elContainer) {
  // DOM 요소는 span 2개를 준비하여 하나는 최종 문자 push, 다른 하나는 마지막 문자 변경
  const elFixed = document.createElement("span");
  elFixed.className = "fixed";
  elFixed.textContent = "";

  const elCurrent = document.createElement("span");
  elCurrent.className = "current";
  elCurrent.textContent = "";

  elContainer.prepend(elCurrent);
  elContainer.prepend(elFixed);

  return {
    fixed: {
      add(char) {
        elFixed.textContent += char;
      },
      clear() {
        elFixed.textContent = "";
      },
      getColor() {
        return window.getComputedStyle(elFixed).color;
      },
    },
    current: {
      change(char) {
        elCurrent.textContent = char;
      },
      clear() {
        elCurrent.textContent = "";
      },
      getColor() {
        return window.getComputedStyle(elCurrent).color;
      },
    },
  };
}

export function setupCursor(elCursor, color) {
  elCursor.style.backgroundColor = color;

  return {
    start() {
      elCursor.classList.remove("blink");
    },
    pause() {
      elCursor.classList.add("blink");
    },
  };
}

export function setupPutter(elPutter) {
  return {
    focus() {
      elPutter.focus();
    },
    get() {
      return elPutter.value;
    },
    set(text) {
      elPutter.textContent = text;
    },
    clear() {
      elPutter.value = "";
    },
  };
}
