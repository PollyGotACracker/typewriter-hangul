import { setupContainer, setupCursor, setupPutter } from "./modules/setup.js";
import createTyper from "./modules/typing.js";
import storage from "./modules/storage.js";

const elSection = document.querySelector("section#typewriter");
const elCursor = document.querySelector("span.cursor");

const textareaText = document.querySelector("textarea#text");
const btnStart = document.querySelector("button.start");
const btnReset = document.querySelector("button.reset");

const { fixed, current } = setupContainer(elSection);
const cursorColor = current.getColor();
const cursor = setupCursor(elCursor, cursorColor);
const putter = setupPutter(textareaText);
const { startTyping, stopTyping } = createTyper({
  fixed,
  current,
  cursor,
});

window.addEventListener("DOMContentLoaded", async () => {
  putter.focus();
  let text = "";
  const saved = storage.get();
  if (saved) {
    text = saved;
  } else {
    text = storage.getDefault();
  }
  putter.set(text);
  await startTyping(text);
});

btnStart.addEventListener("click", async () => {
  stopTyping();
  fixed.clear();
  current.clear();

  const text = putter.get();
  storage.set(text);
  if (text) {
    await startTyping(text);
  }
});

btnReset.addEventListener("click", () => {
  putter.focus();
  stopTyping();
  fixed.clear();
  current.clear();

  storage.clear();
  // putter.clear();
  const text = storage.getDefault();
  putter.set(text);
});
