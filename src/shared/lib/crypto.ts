import CryptoJS from 'crypto-js';

// 환경변수로부터 키 읽기 (32자 이상 권장)
const SECRET_KEY = process.env.NEXT_PUBLIC_DANGLE_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('Environment variable NEXT_PUBLIC_DANGLE_SECRET_KEY is not defined');
}

/**
 * AES 암호화: 평문을 SECRET_KEY로 암호화하여 Base64 출력
 */
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * AES 복호화: Base64 암호문을 SECRET_KEY로 복호화하여 평문 출력
 */
export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
