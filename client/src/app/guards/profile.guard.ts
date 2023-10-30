import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from "../api/api.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard {
  constructor(private apiService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.apiService.checkAuth().pipe(
      map(response => {
        if (response.isAuthenticated && response.role === 'ROLE_User') {
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
