import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  encryptionAES(msg: any) {
    // Encrypt
    const ciphertext = CryptoTS.AES.encrypt(msg, 'smriti @1234');
    return ciphertext.toString();
  }

  decryptionAES(msg: any) {
    // Decrypt
    const bytes = CryptoTS.AES.decrypt(msg, 'smriti @1234');
    const plaintext = bytes.toString(CryptoTS.enc.Utf8);
    return plaintext;
  }
}
