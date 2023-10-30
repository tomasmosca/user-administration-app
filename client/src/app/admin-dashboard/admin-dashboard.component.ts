import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { UserService } from '../api/api.service'
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

export interface UserData {
  id: number;
  identification: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  email: string;
  login: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  displayedColumns: string[] = ['identification', 'name', 'age', 'phone', 'address', 'email', 'login', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private userService: UserService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<UserData>([]);
    this.fetchUsers();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialog, {
      data: { isModify: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  openModifyUserDialog(userToModify: any): void {
    const dialogRef = this.dialog.open(UserDialog, {
      data: { isModify: true, user: userToModify }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  OpenDeleteUserDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      data: { id: id, getUsers: () => this.fetchUsers() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'users.xlsx');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

@Component({
  selector: 'user-dialog',
  templateUrl: './addUser-dialog.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, NgIf],
})
export class UserDialog implements OnInit {
  hide = true;
  initData = this.data.isModify ? this.data.user : {};
  email = new FormControl(this.initData.email || '', [Validators.required, Validators.email]);
  userForm!: FormGroup;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<UserDialog>, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      login: new FormControl(this.initData.login || '', [Validators.required, Validators.minLength(5)]),
      email: this.email,
      password: new FormControl('', Validators.required),
      identification: new FormControl(this.initData.identification || '', [Validators.required, Validators.minLength(5)]),
      name: new FormControl(this.initData.name || '', [Validators.required, Validators.minLength(5)]),
      age: new FormControl(this.initData.age || '', [Validators.min(0), Validators.max(100)]),
      address: new FormControl(this.initData.address || '', [Validators.required, Validators.minLength(5)]),
      phone: new FormControl(this.initData.phone || '', [Validators.required, Validators.minLength(6)]),
      role: new FormControl(this.initData.role || '', Validators.required),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.data.isModify) {
        this.modifyUser();
      } else {
        this.addUser();
      }
    }
  }

  modifyUser(): void {
    this.userService.modifyUser(this.userForm.value, this.data.user.id).subscribe(
      () => {
        this.dialogRef.close(true);
        this._snackBar.open('User modified successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      },
      (error) => {
        console.error('Error modifying user:', error);
        this._snackBar.open('Error modifying user. Please try again.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  addUser() {
    this.userService.createUser(this.userForm.value).subscribe(
      () => { // Success callback
        this.dialogRef.close(true);
        this._snackBar.open('User created successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      },
      (error) => { // Error callback
        console.error('Error creating user:', error);
        this._snackBar.open('Error creating user. Please try again.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, NgIf],
})

export class ConfirmDeleteDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialog>, private userService: UserService, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {}

  deleteUser() {
    this.userService.deleteUser(this.data.id).subscribe(
      () => {
        this.data.getUsers();
        this._snackBar.open('User deleted successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
      },
      (error) => {
        console.error('Error deleting user:', error);
        this._snackBar.open('Error deleting user. Please try again.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }
    );
  }
}
