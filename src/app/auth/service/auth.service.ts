import { Injectable } from '@angular/core';
import { map, Observable, pipe, Subject } from 'rxjs';
import { AuthData, AuthDataResponse, AuthRequest } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants/network.constants';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_URL}/auth`;
  private authData: AuthData | null = null;
  private authUpdated = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  notifyAuthListners(isLoggedIn: boolean) {
    this.authUpdated.next(isLoggedIn);
  }
  getAuthListner(): Observable<boolean> {
    return this.authUpdated.asObservable();
  }
  getAuthData(): AuthData | null {
    return this.authData;
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
      .post<AuthDataResponse>(`${this.apiUrl}/logout`, {})
      .pipe()
      .subscribe((response: any) => {
        this.authData = null;
        this.notifyAuthListners(false);
      });
  }
}
