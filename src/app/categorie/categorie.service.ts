

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from './categorie';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class CategorieService {
  private apiServerUrl = environment.apiBaseUrl;
Categorie=null;
  constructor(private http: HttpClient){}

  public getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiServerUrl}/Categories/all`);
  }

  public addCategorie(Categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiServerUrl}/Categories/add`, Categorie);
  }

  public updateCategorie(Categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiServerUrl}/Categories/update`, Categorie);
  }

  public deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/Categories/delete/${id}`);
  }


  public runPython(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/Categories/api/run-python`);
  }

}

