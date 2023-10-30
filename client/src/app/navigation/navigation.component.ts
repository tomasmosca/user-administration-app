import { Component } from '@angular/core';
import {UserService} from "../api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  authData: any;

  constructor(public authService: UserService, private _snackBar: MatSnackBar,  private router: Router, private activatedRoute: ActivatedRoute) {
    this.authService.checkAuth().subscribe((response) => {this.authData = response})
  }

  isLoginOrRegisterRoute(): boolean {
    const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    return currentRoute === 'login' || (currentRoute === 'register' && !this.authData.isAuthenticated) || currentRoute === 'error' || (currentRoute === 'public' && !this.authData.isAuthenticated);
  }

  onLogoutClick(): void {
    this.authService.logout().subscribe(
      (response) => {
        this.authService.checkAuth().subscribe((response) => {
          this.authData = response
        })
        this.router.navigate(['/login']);
        this._snackBar.open('Logged out from the app.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      },
      (error) => {
        this._snackBar.open('Error: Unable to log out.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }

}
