import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    console.log('token in auth interceptor', token);
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return next.handle(req);
  }
}
