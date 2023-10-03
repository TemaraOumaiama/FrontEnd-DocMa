import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrat } from './contrat';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ContratService {
  private apiServerUrl = environment.apiBaseUrl;
  Contrat = null;
  constructor(private http: HttpClient) {}

  public getContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiServerUrl}/contrats/all`);
  }

  public addContra2t(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/contrats/add`, formData);
  }

  public addContrat(contrat: Contrat): Observable<Contrat> {
    const formData = new FormData();
    formData.append('file', contrat.file!);
    formData.append('user', JSON.stringify(contrat));

    // Make sure to set the 'Content-Type' header to undefined or remove it entirely to let the browser set the correct boundary for multipart/form-data.
    const headers = {};

    return this.http.post<Contrat>(
      `${this.apiServerUrl}/contrats/add`,
      formData,
      {
        headers,
      }
    );
  }

  public updateContrat(Contrat: Contrat): Observable<Contrat> {
    return this.http.put<Contrat>(
      `${this.apiServerUrl}/contrats/update`,
      Contrat
    );
  }

  public deleteContrat(ContratId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/contrats/delete/${ContratId}`
    );
  }

  public getContratByNom(ContratName: string): Observable<void> {
    return this.http.get<void>(
      `${this.apiServerUrl}/contrats/findName/${ContratName}`
    );
  }

  public viewContrat(documentId: number): Observable<HttpResponse<any>> {
    const url = `${this.apiServerUrl}/contrats/view/${documentId}`;
    return this.http.get(url, {
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }

  public getDfetchUnreadContrats(): Observable<string> {
    return this.http.get<string>(`${this.apiServerUrl}/contrats/fetch-unread`);
  }

  public addContratsToLocalCache(contrats: Contrat[]): void {
    localStorage.setItem('contrats', JSON.stringify(contrats));
  }
  public getContratsFromLocalCache(): Contrat[] | null {
    const usersString = localStorage.getItem('contrats');
    if (usersString !== null) {
      return JSON.parse(usersString);
    }
    return null;
  }
}
