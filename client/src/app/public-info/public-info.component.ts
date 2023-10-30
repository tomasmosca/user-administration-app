import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../api/api.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as XLSX from "xlsx";

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
  selector: 'app-public-info',
  templateUrl: './public-info.component.html',
  styleUrls: ['./public-info.component.css']
})
export class PublicInfoComponent {
  displayedColumns: string[] = ['name', 'age'];
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

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource.data = users.filter((user:UserData) => {
        return user.name && user.age;
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  exportToExcel() {
    const dataCopy = this.dataSource.data.map(elem => {
      return {
        name: elem.name,
        age: elem.age
      }
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataCopy);
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
