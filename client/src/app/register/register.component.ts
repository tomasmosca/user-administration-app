import { Component } from '@angular/core';
import {UserService} from "../api/api.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email!: string;
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private apiService: UserService, private router: Router, private _snackBar: MatSnackBar) {}

  onSubmit() {
    this.apiService.register(this.username, this.password, this.email).subscribe(
      (response: any) => {
        this.apiService.login(this.username, this.password).subscribe(
          (response: any) => {
            this.router.navigateByUrl('/profile');
            this._snackBar.open('Registered successfully!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: 'success-snackbar'
            });
          }
        )
      },
      (error) => {
        this.errorMessage = 'Register failed. Please try again.';
        this._snackBar.open('Register failed. Please try again.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }

}
