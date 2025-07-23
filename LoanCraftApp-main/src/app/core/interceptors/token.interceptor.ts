import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    if(myToken){
      request = request.clone({
        setHeaders : {Authorization: `Bearer ${myToken}`,
        // 'Content-Type': 'application/json'
      }
      })
    }
    return next.handle(request).pipe(
      // catchError((error: HttpErrorResponse) => {
      //   console.error('Interceptor caught error:', error); // log full error

      //   if (error.status === 401) {
      //     alert('401 Unauthorized - logging out...');
      //     this.auth.isLogOut(); // clear token and redirect
      //   }

      //   return throwError(() => error); // rethrow for further handling
      // })
    );

    
  }
}
