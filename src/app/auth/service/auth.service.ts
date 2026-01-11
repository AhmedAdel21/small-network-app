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

          this.setAuthTimer(response.expiresIn);

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
    const now = new Date().getTime();
    const expiresInDate = new Date(now + authData.expiresIn * 1000);
    localStorage.setItem('expiresInDate', expiresInDate.toISOString());
  }
  authInformation(): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresInDate = localStorage.getItem('expiresInDate');
    if (!accessToken || !refreshToken || !expiresInDate) {
      return null;
    }
    const now = new Date().getTime();
    const expiresIn = new Date(expiresInDate).getTime() - now;
    if (expiresIn <= 0) {
      return null;
    }
    return { accessToken, refreshToken, expiresIn: expiresIn / 1000 };
  }
  setAuthTimer(expiresIn: number) {
    console.log('setting auth timer in service', expiresIn);
    this.timerTimeout = setTimeout(() => {
      this.logoutFunctionality();
    }, expiresIn * 1000);
  }
  autoAuth() {
    const authInformation = this.authInformation();
    console.log('auto auth in service', authInformation);
    if (!authInformation) {
      return;
    }
    this.authData = {
      id: '',
      email: '',
      accessToken: authInformation.accessToken,
      refreshToken: authInformation.refreshToken,
      expiresIn: authInformation.expiresIn,
    };
    this.notifyAuthListners(true);

    this.setAuthTimer(authInformation.expiresIn);
  }
  private logoutFunctionality() {
    console.log('logout functionality in service');
    clearTimeout(this.timerTimeout);
    this.timerTimeout = null;

    this.authData = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresInDate');

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
