import { Component } from '@angular/core';
import { UserService } from '../api/api.service';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private apiService: UserService, private router: Router, private _snackBar: MatSnackBar) {}

  onSubmit() {
    this.apiService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.role === 'ROLE_Admin') {
          this.router.navigateByUrl('/admin');
        } else if (response.role === 'ROLE_User') {
          this.router.navigateByUrl('/profile');
        } else {
          this._snackBar.open('Could not determine the user role.', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'error-snackbar'
          });
        }

        this._snackBar.open('Logged in successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this._snackBar.open('Error logging in. Please try again.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }

}

