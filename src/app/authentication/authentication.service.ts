import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public host = environment.apiBaseUrl;
  private token: string | undefined;
  private loggedInUsername: string | undefined;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`, user, { observe: 'response' });
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null; // Parse the user object if it exists, otherwise return null
  }
  

  public loadToken(): void {
    const token = localStorage.getItem('token');
    this.token = token !== null ? token : ''; // Assign a default value if token is null
  }
  

  public getToken(): string {
    return this.token !== undefined ? this.token : ''; // Return the token if it is not undefined, otherwise return an empty string
  }
  
  

  public isUserLoggedIn(): boolean | undefined {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
    
    return undefined; // Add an ending return statement to handle any other case
  }
  

}
