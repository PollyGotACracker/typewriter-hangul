const KEY = "typewriter";
const DEFAULT_TEXT = `유니코드를 사용해서 한글 초성, 중성, 종성을 쪼개봐요.
이모지도 지원해요.🦜`;

export default {
  get() {
    return localStorage.getItem(KEY);
  },
  set(text) {
    localStorage.setItem(KEY, text);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
  getDefault() {
    return DEFAULT_TEXT;
  },
};
