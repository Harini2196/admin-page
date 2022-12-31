import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
@Injectable()
export class UserGuard implements  CanActivate {
  accessToken: any;
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token')) {
      this.accessToken = localStorage.getItem('token');

      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
