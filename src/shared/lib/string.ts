// 한글의 마지막 글자 받침 여부를 확인하는 함수
export const hasJongseong = (text: string): boolean => {
  if (!text || text.length === 0) return false;

  const lastChar = text.charAt(text.length - 1);

  // 한글 유니코드 범위 체크
  if (!/[가-힣]/.test(lastChar)) {
    return false; // 한글이 아닌 경우
  }

  // 한글 유니코드 계산 (AC00은 '가'의 유니코드 값)
  const charCode = lastChar.charCodeAt(0) - 0xac00;

  // 종성이 있는지 확인 (종성 없는 글자는 28로 나눈 나머지가 0)
  return charCode % 28 !== 0;
};
