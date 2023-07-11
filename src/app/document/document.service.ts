import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from './document';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class DocumentService {
  private apiServerUrl = environment.apiBaseUrl;
Document=null;
  constructor(private http: HttpClient){}

  public getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiServerUrl}/documents/all`);
  }

  public addDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/documents/add`, formData);
  }

  public updateDocument(Document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiServerUrl}/documents/update`, Document);
  }

  public deleteDocument(DocumentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/documents/delete/${DocumentId}`);
  }

  public getDocumentByNom(DocumentName: string): Observable<void> {
    return this.http.get<void>(`${this.apiServerUrl}/documents/findName/${DocumentName}`);
  }


  public viewDocument(documentId: number): Observable<HttpResponse<any>> {
    const url = `${this.apiServerUrl}/documents/view/${documentId}`;
    return this.http.get(url, { observe: 'response', responseType: 'arraybuffer' });
  }



  public getDfetchUnreadDocuments(): Observable<string> {
    return this.http.get<string>(`${this.apiServerUrl}/documents/fetch-unread`);
  }



 
  
  


  
  



}

