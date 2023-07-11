import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departement } from './departement';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class DepartementService {
  private apiServerUrl = environment.apiBaseUrl;
Departement=null;
  constructor(private http: HttpClient){}

  public getDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiServerUrl}/Departements/all`);
  }

  public adddepartement(Departement: Departement): Observable<Departement> {
    return this.http.post<Departement>(`${this.apiServerUrl}/Departements/add`, Departement);
  }

  public updatedepartement(Departement: Departement): Observable<Departement> {
    return this.http.put<Departement>(`${this.apiServerUrl}/Departements/update`, Departement);
  }

  public deletedepartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/Departements/delete/${id}`);
  }


  public runPython(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/departements/api/run-python`);
  }

}

