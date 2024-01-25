import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private oidcSecurityService: OidcSecurityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token: string) => {
        const headers = request.headers
          .set('Authorization', `Bearer ${token}`);
        const authorizedRequest = request.clone({ headers });
        return next.handle(authorizedRequest);
      })
    );
  }
}
