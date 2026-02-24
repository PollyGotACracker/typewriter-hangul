import { JUNG_LENGTH, JONG_LENGTH, CHO_TABLE } from "./table.js";

const CHO_STRIDE = JUNG_LENGTH * JONG_LENGTH;
const JUNG_STRIDE = JONG_LENGTH;

const UNICODE_HANGUL_FIRST = 0xac00;
const UNICODE_HANGUL_LAST = 0xd7a3;

// 표시 단계별 2차원 배열 생성
export default function genCharSteps(string) {
  const result = [];

  // 이모지의 경우 복수의 유니코드 조합
  // 이모지를 지원할 경우...
  // 1) string 순회 시 단순 for 문이나 for of 문을 사용할 경우 깨지기 때문에 Intl.Segmenter 사용 필요
  // 2) result는 모두 배열로 넣어야 정상 표시
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const graphemes = [...segmenter.segment(string)];

  for (let { segment } of graphemes) {
    // 이모지
    if (/\p{Extended_Pictographic}/u.test(segment)) {
      result.push([segment]);
      continue;
    }
    // 일반 문자
    const sCode = segment.charCodeAt(0);
    const steps = genSteps(sCode);
    result.push(steps);
  }

  return result;
}

// 일반 문자 배열 생성
function genSteps(sCode) {
  // 한글 완성형 유니코드: 0xAC00 ~ 0xD7A3
  if (sCode >= UNICODE_HANGUL_FIRST && sCode <= UNICODE_HANGUL_LAST) {
    const arr = [];

    // 1. 초성, 중성, 종성 인덱스 생성
    const offset = sCode - UNICODE_HANGUL_FIRST;
    const cho = Math.floor(offset / CHO_STRIDE);
    const jung = Math.floor((offset % CHO_STRIDE) / JUNG_STRIDE);
    const jong = offset % JONG_LENGTH;

    // 2. 표시할 문자 생성
    // 초성만 표시, 유니코드 사용 시 반각으로 표시되므로 별도의 테이블 데이터 사용
    const textFirst = CHO_TABLE[cho];
    // 초성 + 중성
    const codeSecond =
      UNICODE_HANGUL_FIRST + cho * CHO_STRIDE + jung * JUNG_STRIDE;
    const textSecond = String.fromCharCode(codeSecond);
    // 초성 + 중성 + 종성
    const codeThird = codeSecond + jong;
    const textThird = String.fromCharCode(codeThird);

    // 3. 표시할 문자 저장
    arr.push(textFirst, textSecond);
    // 받침이 있는 경우
    if (codeSecond !== codeThird) {
      arr.push(textThird);
    }
    return arr;
  } else {
    // 기타 영어, 한글 초성, 개행문자 등
    if (sCode === 32) {
      // \u00A0(160): &nbsp;로 개행되지 않음
      // \u200B(8203): 필요한 경우 강제 개행
      // 기본 공백 타이핑 효과 미적용, 개행 이슈 해결
      return ["\u200B\u00A0"];
    }
    return [String.fromCharCode(sCode)];
  }
}

// const offset = "안".charCodeAt() - 0xac00;
// const cho = Math.floor(offset / (21 * 28));
// const jung = Math.floor((offset % (21 * 28)) / 28);
// const jong = offset % 28;

// const code = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
// const char = String.fromCharCode(code);
// console.log(char);
