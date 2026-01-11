import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthData, AuthDataResponse, AuthRequest } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants/network.constants';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_URL}/auth`;
  private authData: AuthData | null = null;
  private authUpdated = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private timerTimeout: any;
  constructor(private http: HttpClient) {}

  notifyAuthListners(isLoggedIn: boolean) {
    this.authUpdated.next(isLoggedIn);
  }
  getAuthListner(): Observable<boolean> {
    return this.authUpdated.asObservable();
  }
  getAuthStatus(): boolean {
    return this.authUpdated.getValue();
  }
  getAuthData(): AuthData | null {
    return this.authData;
  }
  getToken(): string | null {
    return this.authData?.accessToken ?? null;
  }
  register(authData: AuthRequest) {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/register`, authData)
      .subscribe(({ message }) => {
        console.log('register message in service', message);

        this.router.navigate(['/login']);
      });
  }
  login(authData: AuthRequest) {
    return this.http
      .post<AuthDataResponse>(`${this.apiUrl}/login`, authData)
      .pipe(
        map((response: AuthDataResponse) => {
          return {
            id: response.id,
            email: response.email,
            accessToken: response.accessToken ?? '',
            refreshToken: response.refreshToken ?? '',
            expiresIn: response.expiresIn ?? 0,
          };
        })
      )
      .subscribe((response: AuthData) => {
        this.authData = response;
        console.log('login auth data in service', this.authData);
        if (
          response.accessToken.length > 0 &&
          response.refreshToken.length > 0
        ) {
          this.setAuthData(response);
          const expiresIn = response.expiresIn * 1000;
          this.timerTimeout = setTimeout(() => {
            this.logoutFunctionality();
          }, expiresIn);
          this.notifyAuthListners(true);
        } else {
          this.notifyAuthListners(false);
        }
      });
  }
  setAuthData(authData: AuthData) {
    this.authData = authData;
    console.log('setting auth data in service', this.authData);
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('expiresIn', authData.expiresIn.toString() ?? '0');
    localStorage.setItem('id', authData.id);
    localStorage.setItem('email', authData.email);
  }
  private logoutFunctionality() {
    console.log('logout functionality in service');
    clearTimeout(this.timerTimeout);
    this.timerTimeout = null;

    this.authData = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('id');
    localStorage.removeItem('email');

    this.notifyAuthListners(false);
    this.router.navigate(['/login']);
  }
  logout() {
    return this.http
      .post<AuthDataResponse>(`${this.apiUrl}/logout`, {
        refreshToken: this.authData?.refreshToken,
      })
      .subscribe((response: any) => {
        this.logoutFunctionality();
      });
  }
}
