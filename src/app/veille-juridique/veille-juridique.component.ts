

import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Categorie } from 'src/app/categorie/categorie';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importer le module FormsModule;
import { ElementRef } from '@angular/core';
import { CategorieService } from 'src/app/categorie/categorie.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import unidecode from 'unidecode';
import { Departement } from 'src/app/departement/departement';
import { DepartementService } from 'src/app/departement/departement.service';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document';
import { SearchService } from '../homepage/SearchService.service';

@Component({
  selector: 'app-veille-juridique',
  templateUrl: './veille-juridique.component.html',
  styleUrls: ['./veille-juridique.component.css']
})
export class VeilleJuridiqueComponent{




  
 

  pageHtml: string = '';


  public categories: Categorie[] = [];
  public documents: Document[] = [];
  
  public users: User[] = [];
  
  @ViewChild('departmentSelect') departmentSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('categorieSelect') categorieSelect!: ElementRef<HTMLSelectElement>;
  
  
  
  public editCategorie: Categorie | undefined|null;
  public deleteCategorie: Categorie | undefined|null;
  
  constructor(private searchService: SearchService,private router: Router,private UserService:UserService, private DocumentService:DocumentService, private CategorieService: CategorieService, private DepartementService:DepartementService ){}
  
  
  ngOnInit() {


    this.searchService.getSearchTerm().subscribe((term: string) => {
      this.searchItems(term);
    });

    this.searchService.searchTriggered.subscribe((searchTerm: string) => {
      this.searchItems(searchTerm);
    });
    this.getCategories();
    this.getUsers();
    this.getDepartements();
    this.getDocuments();
  
  }
  
  
  public getDocuments(): void {
    this.DocumentService.getDocuments().subscribe(
      (response: Document[]) => {
        this.documents = response;
        console.log(this.documents);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  
  }
  

  
public DownloadDocument(documentId: number) {
  this.DocumentService.viewDocument(documentId).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'document.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    (error: any) => {
      console.error('Error while viewing the document:', error);
    }
  );
}



viewDocument() {

  this.DocumentService.viewDocument(54).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'document.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    (error: any) => {
      console.error('Error while viewing the document:', error);
    }
  );
}




viewContrat() {

  this.DocumentService.viewDocument(52).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'document.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    (error: any) => {
      console.error('Error while viewing the document:', error);
    }
  );
}

  
  
  public selectedCategorie: Categorie | null = null; 
  
  
  clearSearchInput() {
    this.searchTerm = '';
    this.getCategories();
    
  }
  
  
  
  
  public getCategories(): void {
    this.CategorieService.getCategories().subscribe(
      (response: Categorie[]) => {
        this.categories = response;
        console.log(this.categories);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public getUsers(): void {
    this.UserService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log(this.users);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  
  
  
  public onAddCategorie(addForm: NgForm): void {
    this.CategorieService.addCategorie(addForm.value).subscribe(
      (response: Categorie) => {
        console.log(response);
        this.getCategories();
        addForm.reset();
        document.getElementById('add-Categorie-form')!.click();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
  
  
  
  
  public selectedCategorieId: number=5;
  
  public   onUpdateCategorie(Categorie: Categorie): void {
  
    this.CategorieService.updateCategorie(Categorie).subscribe(
      (response: Categorie) => {
        console.log(response);
        this.getCategories();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  
  
  
  
  public onDeleteCategorie(CategorieId: number|undefined): void {
    if (CategorieId){
      this.CategorieService.deleteCategorie(CategorieId).subscribe(
      (response: void) => {
        console.log(response);
        this.getCategories();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    }
    
  }
  
  
  public searchTerm: string = '';
  
  
  
  
  
  
  
  filteredDepartments: Categorie[] = [];
  
  
  
  
  
  
  
  
  searchTermm: string = '';
  
  
  // Recherche Categorie
  
  
  public searchCategoriess(key: string): void {
    console.log(key);
    const searchTerms = key.toLowerCase().split(' ').filter(term => term !== '');
  
    if (searchTerms.length === 0) {
      this.getCategories();
      return;
    }
  
    const results: Categorie[] = [];
  
    for (const categorie of this.categories) {
      let found = false;
  
      for (const term of searchTerms) {
        const normalizedTerm = unidecode(term);
        const normalizedNom = unidecode(categorie.nom.toLowerCase());
        const normalizedDescription = unidecode(categorie.description.toLowerCase());
  
        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription = normalizedDescription.includes(normalizedTerm);
  
        if (termFoundInNom || termFoundInDescription) {
          found = true;
          break;
        }
      }
  
      if (found) {
        results.push(categorie);
      }
    }
  
    this.categories = results;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  searchItems(key: string) {
    console.log('RANI JIT'+key);
    const searchTerms = key.toLowerCase().split(' ').filter(term => term !== '');
  
    if (searchTerms.length === 0) {
      this.getDepartements();
      this.getCategories();
      return;
    }
  
    const departementResults: Departement[] = [];
    const categorieResults: Categorie[] = [];
  
    for (const departement of this.departements) {
      let found = false;
  
      for (const term of searchTerms) {
        const normalizedTerm = unidecode(term);
        const normalizedNom = unidecode(departement.nom.toLowerCase());
        const normalizedDescription = unidecode(departement.description.toLowerCase());
  
        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription = normalizedDescription.includes(normalizedTerm);
  
        if (termFoundInNom || termFoundInDescription) {
          found = true;
          break;
        }
      }
  
      if (found) {
        departementResults.push(departement);
      }
    }
  
    for (const categorie of this.categories) {
      let found = false;
  
      for (const term of searchTerms) {
        const normalizedTerm = unidecode(term);
        const normalizedNom = unidecode(categorie.nom.toLowerCase());
        const normalizedDescription = unidecode(categorie.description.toLowerCase());
  
        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription = normalizedDescription.includes(normalizedTerm);
  
        if (termFoundInNom || termFoundInDescription) {
          found = true;
          break;
        }
      }
      if (found) {
        categorieResults.push(categorie);
      }
    }
  
    this.departements = departementResults;
    this.categories = categorieResults;
  }
  
  
  
  
  public departements: Departement[] = [];
  public getDepartements(): void {
    this.DepartementService.getDepartements().subscribe(
      (response: Departement[]) => {
        this.departements = response;
        console.log(this.departements);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  const encodedString = 'Hello%20World%21';
  const decodedString = decodeURIComponent(encodedString);
  console.log(decodedString); // Output: "Hello World!"
  
    
  }


  


}