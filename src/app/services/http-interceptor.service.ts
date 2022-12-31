import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { ApexService } from './apex.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private apexService: ApexService, private router: Router, private snackBar: MatSnackBar) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq: any = req.clone();
    return next.handle(authReq).pipe(tap(
      (response: any) => {
      },
      (error: any) => {
        if (error.status === 401) {
          this.showLoader(false);
          this.router.navigate(['/']);
          this.snackBar.open('Your session got expired, Please login again', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snackBar',
            duration: 3000
          });
        } else if (error.status === 409) {

        } else {
          this.showLoader(false);
          this.router.navigate(['/']);
        }
      }));
  }
  showLoader(show: boolean) {
    this.apexService.showLoader(show);
  }
}
