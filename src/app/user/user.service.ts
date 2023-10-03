import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { ApiResponse } from './api-response';
import { Page } from './Page';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;
  User = null;

  private host = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  users$ = (
    nom: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page>> =>
    this.http.get<ApiResponse<Page>>(
      `${this.apiServerUrl}/users?nom=${nom}&page=${page}&size=${size}`
    );

  public runPython(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/Users/api/run-python`);
  }

  public getDocumentsCreatedByUser(userId: number): Observable<any[]> {
    const url = `${this.apiServerUrl}/documents/created-by/${userId}`;
    console.log('url = ' + url);
    return this.http.get<any[]>(url);
  }

  public getUser(id: number): Observable<User> {
    const url = `${this.apiServerUrl}/Users/find/${id}`;
    console.log('khra:', url);
    return this.http.get<User>(url);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<User> {
    // console.log('ana hna On add data');

    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(
      `${this.host}/user/resetpassword/${email}`
    );
  }

  public updateUserPassword(
    userName: string,
    newPassword: string
  ): Observable<any> {
    const url = `${this.host}/user/ChangePassword`;
    const body = new FormData();
    body.append('username', userName);
    body.append('newPassword', newPassword);
    return this.http.post(url, body);
  }

  public updateimageUrl(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateimageUrl`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(
      `${this.host}/user/delete/${username}`
    );
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }
  public getUsersFromLocalCache(): User[] | null {
    const usersString = localStorage.getItem('users');
    if (usersString !== null) {
      return JSON.parse(usersString);
    }
    return null;
  }

  public createUserFormDate(
    loggedInUsername: string | null | undefined,
    user: User | null,
    imageUrl: File | undefined | null
  ): FormData {
    const formData = new FormData();
    if (loggedInUsername != null)
      if (user != null) {
        formData.append('currentUsername', loggedInUsername);
        formData.append('prenom', user.prenom);
        formData.append('nom', user.nom);
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('role', user.role);
        if (imageUrl != undefined) formData.append('imageUrl', imageUrl);
        formData.append('isActive', JSON.stringify(user.active));
        formData.append('isNonLocked', JSON.stringify(user.notLocked));
      }
    return formData;
  }

  public createUserFormDateADD(
    user: User | null,
    imageUrl: File | undefined | null
  ): FormData {
    const formData = new FormData();

    if (user != null) {
      formData.append('prenom', user.prenom);
      formData.append('nom', user.nom);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('role', user.role);
      if (imageUrl != undefined) formData.append('imageUrl', imageUrl);
      formData.append('isActive', JSON.stringify(user.active));
      formData.append('isNonLocked', JSON.stringify(user.notLocked));
    }
    return formData;
  }
}
