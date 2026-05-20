import * as CryptoES from 'crypto-es';


export function hexToUint8Array(hex: string): Uint8Array {
  const length = hex.length / 2;
  const u8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    u8[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return u8;
}
export function uint8ArrayToWordArray(u8: Uint8Array): CryptoES.WordArray {
  const words = [];
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      (u8[i] << 24) |
      (u8[i + 1] << 16) |
      (u8[i + 2] << 8) |
      (u8[i + 3] || 0)
    );
  }
  return CryptoES.WordArray.create(words, u8.length);
}
export function wordArrayToUint8Array(wordArray: CryptoES.WordArray): Uint8Array {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[Math.floor(i / 4)] >> (24 - 8 * (i % 4))) & 0xff;
  }
  return u8;
}
export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  // calculate total length
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

  // create new array
  const result = new Uint8Array(totalLength);

  // copy each array into result
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}
export function uint8ArrayToHex(u8: Uint8Array): string {
  return Array.from(u8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}