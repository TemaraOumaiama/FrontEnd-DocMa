import { Component } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Document } from './document';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importer le module FormsModule;
import { ElementRef } from '@angular/core';
import { DocumentService } from './document.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as fuzzysort from 'fuzzysort';
import unidecode from 'unidecode';
import { Departement } from '../departement/departement';
import { DepartementService } from 'src/app/departement/departement.service';
import { Categorie } from '../categorie/categorie';
import { CategorieService } from 'src/app/categorie/categorie.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Role } from '../enum/role.enum';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent {
  pageHtml: string = '';

  public Documents: Document[] = [];
  public documents: Document[] = [];

  public categories: Categorie[] = [];

  public departements: Departement[] = [];

  public users: User[] = [];

  @ViewChild('DocumentSelect') documentSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('departementSelect')
  departementSelect!: ElementRef<HTMLSelectElement>;

  @ViewChild('categorieSelect') categorieSelect!: ElementRef<HTMLSelectElement>;

  public editDocument: Document | undefined | null;
  public deleteDocument: Document | undefined | null;

  constructor(
    private router: Router,
    private UserService: UserService,
    private CategorieService: CategorieService,
    private DocumentService: DocumentService,
    private DepartementService: DepartementService,
    private authenticationService: AuthenticationService
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

  ngOnInit() {
    this.getDocuments();
    this.getUsers();
    this.getDepartements();
    this.getCategories();
  }

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
  }

  public getCategories(): void {
    this.CategorieService.getCategories().subscribe(
      (response: Categorie[]) => {
        this.categories = response;
        console.log(this.categories);
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
      }
    );
  }

  public selectedDocument: Document | null = null;

  clearSearchInput() {
    this.searchTerm = '';
    this.getDocuments();
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
  public myString: string = '';

  public getDfetchUnreadDocuments(): void {
    this.DocumentService.getDfetchUnreadDocuments().subscribe(
      (response: string) => {
        this.myString = response;
        console.log(this.myString);
        //  alert("Documents non lus récupérés avec succès.");
      },
      (error: HttpErrorResponse) => {
        // alert("Documents non lus récupérés avec succès.");
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

  onAddDocument(
    addForm: NgForm,
    departementSelect: HTMLSelectElement,
    categorieSelect: HTMLSelectElement,
    fileInput: HTMLInputElement
  ) {
    const formData = new FormData();

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    formData.append('categorieId', categorieSelect.value);
    formData.append('departementId', departementSelect.value);

    this.DocumentService.addDocument(formData).subscribe(
      (response) => {
        console.log('Document ajouté avec succès !', response);
        alert('Document ajouté avec succès !');
        //location.reload();
      },
      (error) => {
        console.error("Erreur lors de l'ajout du document !", error);
        // Gérer l'erreur si nécessaire
        alert('Document ajouté avec succès !');
      }
    );
  }

  public selectedDocumentId: number = 5;

  public onUpdateDocument(Document: Document): void {
    if (this.editDocument) {
      this.DocumentService.updateDocument(this.editDocument).subscribe(
        (response: Document) => {
          console.log(response);
          this.getDocuments();
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  public onDeleteDocument(DocumentId: number | undefined): void {
    if (DocumentId) {
      this.DocumentService.deleteDocument(DocumentId).subscribe(
        (response: void) => {
          console.log(response);
          this.getDocuments();
        },
        (error: HttpErrorResponse) => {
          //alert(error.message);
        }
      );
    }
  }

  public searchTerm: string = '';

  public onSearchSubmit(event: Event): void {
    event.preventDefault();
    //this.getDocuments(); // Empêche la soumission du formulaire par défaut
    this.searchDocuments();
  }

  public searchDocuments(): void {
    let results: Document[] = [];
    if (this.searchTerm !== '') {
      const searchTerms = this.searchTerm
        .toLowerCase()
        .split(' ')
        .filter((term) => term !== '');
      results = this.documents.filter((document) => {
        const found = searchTerms.some(
          (term) =>
            document.nom.toLowerCase().includes(term) ||
            document.id.toString().includes(term)
        );
        if (found) {
          console.log('Contenu vérifié :', document);
        } else {
          console.log('Contenu non vérifié :', document);
        }
        return found;
      });
      this.documents = results;
      console.log(this.documents);
    } else {
      this.getDocuments();
    }
  }

  onSearchInput(): void {
    // Add a small delay to allow the user to finish typing
    setTimeout(() => {
      // Call the search function whenever the input changes
      this.searchDocuments();
    }, 300);
  }

  filteredDocuments: Document[] = [];

  searchTermm: string = '';

  // Recherche Document

  public searchDocumentss(key: string): void {
    console.log(key);
    const searchTerms = key
      .toLowerCase()
      .split(' ')
      .filter((term) => term !== '');

    if (searchTerms.length === 0) {
      this.getDocuments();
      return;
    }

    let results: Document[] = this.documents;

    for (const term of searchTerms) {
      const normalizedTerm = unidecode(term);

      results = results.filter((document) => {
        const normalizedNom = unidecode(document.nom.toLowerCase());

        const termFoundInNom = normalizedNom.includes(normalizedTerm);

        return termFoundInNom;
      });
    }

    this.documents = results;
  }

  public onOpenModal(Document: Document | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addDocumentModal');
    }
    if (mode === 'edit') {
      this.editDocument = Document;
      console.log(this.editDocument);
      button.setAttribute('data-target', '#updateDocumentModal');
    }
    if (mode === 'delete') {
      this.deleteDocument = Document;
      button.setAttribute('data-target', '#deleteDocumentModal');
    }
    container?.appendChild(button);
    button.click();
  }

  // TELECHARGER DOCUMENT////////////////////////////////////

  public DownloadDocument(documentId: number) {
    this.DocumentService.viewDocument(documentId).subscribe(
      (response: any) => {
        const contentDispositionHeader = response.headers.get(
          'Content-Disposition'
        );
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        const filename =
          matches && matches.length > 1 ? matches[1] : 'document.pdf';

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

  public getSortedDocuments(): void {
    const userId = 123; // Remplacez par l'ID de l'utilisateur actuel
    this.UserService.getDocumentsCreatedByUser(userId).subscribe(
      (documents) => (this.documents = documents)
    );
  }

  viewDocument(documentId: number | null) {
    if (documentId)
      this.DocumentService.viewDocument(documentId).subscribe(
        (response: any) => {
          const contentDispositionHeader = response.headers.get(
            'Content-Disposition'
          );
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDispositionHeader);
          const filename =
            matches && matches.length > 1 ? matches[1] : 'document.pdf';

          const blob = new Blob([response.body], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        (error: any) => {
          console.error('Error while viewing the document:', error);
        }
      );
  }

  public selectedDepartementId: number = 5;
  public selectedCategorieId: number = 1;

  public onUpdateDocucument(document: Document): void {
    const selectedDepartement = this.departements.find(
      (departement) => departement.id === this.selectedDepartementId
    );

    if (selectedDepartement) {
      document.departement = selectedDepartement;
    }

    const selectedCategorie = this.categories.find(
      (categorie) => categorie.id === this.selectedCategorieId
    );

    if (selectedCategorie) {
      document.categorie = selectedCategorie;
    }
  }
}
