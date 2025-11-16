/**
 * 두 값의 얕은 동등성을 비교합니다.
 * 객체와 배열은 1단계 깊이까지만 비교합니다.
 */
export const shallowEquals = (a: unknown, b: unknown): boolean => {
  // 참조가 완전히 같은 경우 바로 true
  if (Object.is(a, b)) return true;

  // 타입이 다르면 바로 false
  if (typeof a !== typeof b) return false;

  // null 처리 (typeof null === "object" 이므로 별도 분기)
  if (a === null || b === null) return false;

  // 배열 비교 (1단계 깊이까지만)
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i += 1) {
      // 얕은 비교이므로 각 요소에 대해 Object.is 만 사용
      if (!Object.is(a[i], b[i])) return false;
    }
    return true;
  }

  // 객체 비교 (1단계 깊이까지만)
  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string | symbol, unknown>;
    const bObj = b as Record<string | symbol, unknown>;

    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false;
      if (!Object.is(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  // 그 외 기본 타입들은 Object.is 로 비교
  return Object.is(a, b);
};

/**
 * 두 값의 깊은 동등성을 비교합니다.
 * 객체와 배열의 모든 중첩된 속성을 재귀적으로 비교합니다.
 */
export const deepEquals = (a: unknown, b: unknown): boolean => {
  // 참조가 같거나, 기본 타입이면서 값이 완전히 같은 경우
  if (Object.is(a, b)) return true;

  // 타입이 다르면 바로 false
  if (typeof a !== typeof b) return false;

  // null 처리
  if (a === null || b === null) return false;

  // 배열인 경우: 길이와 각 요소를 재귀적으로 비교
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i += 1) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  // 객체인 경우: 키와 각 키의 값을 재귀적으로 비교
  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false;
      if (!deepEquals(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  // 그 외 타입들은 Object.is 결과를 그대로 반환
  return Object.is(a, b);
};
