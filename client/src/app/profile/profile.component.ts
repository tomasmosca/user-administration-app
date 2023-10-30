import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserService } from "../api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {switchMap, tap} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  initData!: { email: any; login: any; identification: any; name: any; age: any; address: any; phone: any; role: any; };
  email = new FormControl('', []);
  userId!: number;
  hide = true;
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.userService.checkAuth().pipe(
      tap(response => {
        this.userId = response.userId;
      }),
      switchMap(() => this.userService.getUser(this.userId))
    ).subscribe((response) => {
      this.initData = response;
      this.email.setValue(this.initData.email || '');
      this.email.setValidators([Validators.required, Validators.email]);
      this.profileForm = new FormGroup({
        login: new FormControl(this.initData.login || '', [Validators.required, Validators.minLength(5)]),
        password: new FormControl(''),
        email: this.email,
        identification: new FormControl(this.initData.identification || '', [Validators.minLength(5)]),
        name: new FormControl(this.initData.name || '', [Validators.minLength(5)]),
        age: new FormControl(this.initData.age || '', [Validators.min(0), Validators.max(100)]),
        address: new FormControl(this.initData.address || '', [Validators.minLength(5)]),
        phone: new FormControl(this.initData.phone || '', [Validators.minLength(6)]),
        role: new FormControl(this.initData.role || ''),
      });
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.modifyUser(this.profileForm.value, this.userId).subscribe(response => {
        this._snackBar.open('Profile updated successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      }, error => {
        this._snackBar.open('Error: Failed to update profile.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      });
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
