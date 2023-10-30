import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable, of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard {

  constructor(private apiService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.apiService.checkAuth().pipe(
      map(response => {
        if (response.isAuthenticated) {
          if (state.url === '/login') {
            this.router.navigate([response.role === 'ROLE_Admin' ? '/admin' : '/profile']);
            return false;
          }
          return true;
        } else {
          if (state.url !== '/login') {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        }
      }),
      catchError(err => {
        console.error('Error checking authentication:', err);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
