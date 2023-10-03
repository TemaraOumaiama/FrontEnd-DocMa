import { Component } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Categorie } from 'src/app/categorie/categorie';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';

import { Document } from 'src/app/document/document';
import { DocumentService } from 'src/app/document/document.service';

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
import { Departement } from '../departement/departement';
import { DepartementService } from '../departement/departement.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Role } from '../enum/role.enum';
@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.css'],
})
export class DossierComponent {
  pageHtml: string = '';

  publicdeptNames: string[] = [];
  public categories: Categorie[] = [];

  public users: User[] = [];
  public refreshing: boolean = false;

  @ViewChild('departmentSelect')
  departmentSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('categorieSelect') categorieSelect!: ElementRef<HTMLSelectElement>;

  public editCategorie: Categorie | undefined | null;
  public deleteCategorie: Categorie | undefined | null;
  public Documents: Document[] = [];
  public documents: Document[] = [];
  constructor(
    private router: Router,
    private UserService: UserService,
    private CategorieService: CategorieService,
    private DepartementService: DepartementService,
    private authenticationService: AuthenticationService,
    private DocumentService: DocumentService
  ) {}
  private getUserRole(): string {
    if (this.authenticationService) {
      return this.authenticationService.getUserFromLocalCache()?.role || '';
    }
    return '';
  }
  public user: User = new User();
  public get isAdmin(): boolean {
    return (
      this.getUserRole() === Role.ADMIN ||
      this.getUserRole() === Role.SUPER_ADMIN
    );
  }

  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }
  public getDocuments(): void {
    this.DocumentService.getDocuments().subscribe(
      (response: Document[]) => {
        this.documents = response;
        console.log(this.documents);
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
      }
    );
  }

  selectedDocuments: number[] = [];

  onDocumentChange(event: any) {
    const documentId = parseInt(event.target.value, 10);

    if (event.target.checked) {
      // Ajouter le document sélectionné à la liste des documents sélectionnés
      this.selectedDocuments.push(documentId);
    } else {
      // Retirer le document décoché de la liste des documents sélectionnés
      this.selectedDocuments = this.selectedDocuments.filter(
        (id) => id !== documentId
      );
    }
  }

  isSelected(documentId: number): boolean {
    // Vérifier si le document est déjà dans la liste des documents sélectionnés
    return this.selectedDocuments.includes(documentId);
  }
  ngOnInit() {
    this.getCategories();
    this.getDocuments();
    this.getUsers();
    this.getDepartements();
    const cachedUser = this.authenticationService.getUserFromLocalCache();
    if (cachedUser !== null) {
      this.user = cachedUser;
    }
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
        this.refreshing = true;
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
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
        //alert(error.message);
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
        //alert(error.message);
        addForm.reset();
      }
    );
  }

  public selectedCategorieId: number = 5;

  public onUpdateCategorie(Categorie: Categorie): void {
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

  public onDeleteCategorie(CategorieId: number | undefined): void {
    if (CategorieId) {
      this.CategorieService.deleteCategorie(CategorieId).subscribe(
        (response: void) => {
          console.log(response);
          this.getCategories();
        },
        (error: HttpErrorResponse) => {
          //alert(error.message);
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
    const searchTerms = key
      .toLowerCase()
      .split(' ')
      .filter((term) => term !== '');

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
        const normalizedDescription = unidecode(
          categorie.description.toLowerCase()
        );

        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription =
          normalizedDescription.includes(normalizedTerm);

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

  public onOpenModal(Categorie: Categorie | null, mode: string): void {
    console.log('allo');
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCategorieModal');
    }
    if (mode === 'edit') {
      this.editCategorie = Categorie;
      console.log('HELLLOOOOOOOOOOOOOOOOOOOOO');
      button.setAttribute('data-target', '#updateCategorieModal');
    }
    if (mode === 'delete') {
      this.deleteCategorie = Categorie;
      button.setAttribute('data-target', '#deleteCategorieModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public searchItems(key: string): void {
    console.log(key);
    const searchTerms = key
      .toLowerCase()
      .split(' ')
      .filter((term) => term !== '');

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
        const normalizedDescription = unidecode(
          departement.description.toLowerCase()
        );

        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription =
          normalizedDescription.includes(normalizedTerm);

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
        const normalizedDescription = unidecode(
          categorie.description.toLowerCase()
        );

        const termFoundInNom = normalizedNom.includes(normalizedTerm);
        const termFoundInDescription =
          normalizedDescription.includes(normalizedTerm);

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
        //alert(error.message);
      }
    );
    const encodedString = 'Hello%20World%21';
    const decodedString = decodeURIComponent(encodedString);
    console.log(decodedString); // Output: "Hello World!"
  }
}
