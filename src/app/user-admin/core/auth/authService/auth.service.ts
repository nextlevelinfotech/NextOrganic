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
  ) { }

  // Save encrypted token
  setToken(token: string) {
    const encryptedToken = this.encrypt.encryptionAES(token);
    localStorage.setItem('customerToken', encryptedToken);
  }

  // Access original token (सधैं ताजा टोकन localStorage बाट तान्छ)
  getCustomerToken() {
    const storedToken = localStorage.getItem('customerToken');

    if (!storedToken) return null;

    try {
      return this.encrypt.decryptionAES(storedToken);
    } catch (e) {
      console.error('Token decryption failed', e);
      return null;
    }
  }

  // Check login (टोकन डिक्रिप्ट गरेर हेर्छ)
  isLoggedIn(): boolean {
    const token = this.getCustomerToken();
    return !!token;
  }

  // Logout
  logout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerId');
    // localStorage.clear();
    this.router.navigate(['/home']);
  }

  // Set userId
  setCustomerId(customerId: number) {
    localStorage.setItem('customerId', customerId.toString());
  }

  // Get customerId (सधैं ताजा customerId localStorage बाट तान्छ)
  getCustomerId(): number | null {
    const customerId = localStorage.getItem('customerId');

    if (!customerId) {
      return null;
    } ``

    const id = Number(customerId);
    return isNaN(id) ? null : id;
  }
}