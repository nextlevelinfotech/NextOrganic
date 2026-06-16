import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryptionservice/encryption.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private encrypt: EncryptionService,
  ) {}

  //encript token
  Token = localStorage.getItem('token');

  //  Save encript token

  setToken(token: string) {
    const encryptedToken = this.encrypt.encryptionAES(token);
    localStorage.setItem('token', encryptedToken);
  }

  // access original token
  gettoken() {
    const storedToken = localStorage.getItem('token'); // ✅ always fresh

    if (!storedToken) return null; // ✅ prevent crash

    try {
      return this.encrypt.decryptionAES(storedToken);
    } catch (e) {
      console.error('Token decryption failed', e);
      return null;
    }
  }
  //  Check login
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //  Logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
