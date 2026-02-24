import genCharSteps from "./hangul.js";

let timeoutId = null;
let stopFlag = false;

export default function createTyper({ fixed, current, cursor }) {
  async function startTyping(text) {
    const stepsArray = genCharSteps(text);
    stopFlag = false;
    cursor.start();

    for (let i = 0; i < stepsArray.length; i++) {
      const steps = stepsArray[i];
      for (let j = 0; j < steps.length; j++) {
        if (stopFlag) return;
        const char = steps[j];

        // 문자가 완성된 경우 고정된 문자열에 추가하고 현재 문자를 비움
        if (j === steps.length - 1) {
          fixed.add(char);
          current.clear();
        } else {
          current.change(char);
        }

        const [nextChar] = stepsArray[i + 1] ?? "";
        // const [prevChar] = stepsArray[i - 1] ?? "";
        const breakChars = ["\n", "\r", "\r\n"];
        const puncChars = [".", "?", "!"];

        // 지연 시간 생성
        const isDelay =
          breakChars.includes(char) ||
          (puncChars.includes(char) && !puncChars.includes(nextChar));

        const ms = isDelay
          ? Math.random() * 400 + 200
          : Math.random() * 100 + 50;

        // 반복문 내 비동기 처리
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            timeoutId = setTimeout(() => {
              resolve();
            }, ms);
          });
        });
      }
    }
    // 타이핑 완료
    stopTyping();
  }

  function stopTyping() {
    stopFlag = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
    cursor.pause();
  }

  return { startTyping, stopTyping };
}
