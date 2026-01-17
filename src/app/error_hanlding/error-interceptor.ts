import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDefaultDailogComponent } from './error-default-dailog/error-default-dailog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private dialog = inject(MatDialog);

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: any) => {
                console.log('error in error interceptor', error);

                this.dialog.open(ErrorDefaultDailogComponent, {
                    data: { message: error.error.message },
                });
                return throwError(() => error);
            })
        );
    }
}
