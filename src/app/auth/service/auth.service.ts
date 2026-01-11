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
      .post<AuthDataResponse>(`${this.apiUrl}/register`, authData)
      .pipe(
        map((response: AuthDataResponse) => {
          return {
            id: response.id,
            email: response.email,
            accessToken: response.accessToken ?? '',
            refreshToken: response.refreshToken ?? '',
          };
        })
      )
      .subscribe((response: AuthData) => {
        this.authData = response;
        console.log('register auth data in service', this.authData);

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
          this.notifyAuthListners(true);
        } else {
          this.notifyAuthListners(false);
        }
      });
  }
  logout() {
    return this.http
      .post<AuthDataResponse>(`${this.apiUrl}/logout`, {
        refreshToken: this.authData?.refreshToken,
      })
      .subscribe((response: any) => {
        this.authData = null;
        this.notifyAuthListners(false);
        this.router.navigate(['/login']);
      });
  }
}
