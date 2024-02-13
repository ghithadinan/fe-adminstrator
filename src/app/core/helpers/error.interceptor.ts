import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {showAlert} from '../../helpers/helpers';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authService.logout();
        location.reload();
      }

      let error = err.error?.message ?? 'System error occurred. Please try again later';

      if (err.status === 422) {
        if (err.error.data) {
          const errMessages: [any] = err.error.data;
          if (errMessages.length > 0) {
            error = errMessages[0].message || err.statusText;
          }
        }
      }

      if (err.status !== 422) {
        this.toastr.error(err.message, `Error ${err.status}`);
      }

      if (err.status === 422) {
        showAlert(error);
      }

      return throwError({
        message: error,
        status: err.status
      });
    }));
  }
}
