import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable, of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(private apiService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.apiService.checkAuth().pipe(
      map(response => {
        if (response.isAuthenticated && response.role === 'ROLE_Admin') {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
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

