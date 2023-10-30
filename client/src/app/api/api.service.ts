import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserData} from "../admin-dashboard/admin-dashboard.component";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = 'http://localhost:8080/api/v1/users';
  private authURL = 'http://localhost:8080/api/v1/auth';

  private authSubject = new BehaviorSubject<any>(null);

  authData$ = this.authSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.refreshAuthData();
  }

  refreshAuthData() {
    this.checkAuth().subscribe(
      data => {
        this.authSubject.next(data);
      },
      error => {
        this.authSubject.next(null);
      }
    );
  }

  getUsers(): Observable<any> {
    return this.httpClient.get<any>(this.baseURL, { withCredentials: true });
  }

  getUser(id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseURL + '/' + id, { withCredentials: true });
  }

  createUser(userData: UserData): Observable<any> {
    return this.httpClient.post(this.baseURL, userData, { withCredentials: true });
  }

  modifyUser(userData: UserData, id: number): Observable<any> {
    return this.httpClient.put(this.baseURL + '/' + id, userData, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(this.baseURL + '/' + id, { withCredentials: true });
  }

  login(username: string, password: string): Observable<any> {
    const url = `http://localhost:8080/login`;

    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    };

    return this.httpClient.post(url, body.toString(), options).pipe(
      tap(() => {
        this.refreshAuthData();
      })
    );
  }

  checkAuth(): Observable<any> {
    return this.httpClient.get(this.authURL + '/check', {withCredentials: true})
  }

  logout(): Observable<any> {
    const url = `http://localhost:8080/logout`;
    return this.httpClient.post(url, {}, {withCredentials: true}).pipe(
      tap(() => {
        this.refreshAuthData();
      })
    );
  }

  register(username: string, password: string, email: string): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    return this.httpClient.post(this.authURL + '/register', {login: username, password: password, email: email}, options);
  }

}

