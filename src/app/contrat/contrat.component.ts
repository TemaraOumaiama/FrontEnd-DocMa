import { Component } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Contrat } from './contrat';
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
import { ContratService } from './contrat.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as fuzzysort from 'fuzzysort';
import unidecode from 'unidecode';
import { Departement } from '../departement/departement';
import { DepartementService } from 'src/app/departement/departement.service';
import { Categorie } from '../categorie/categorie';
import { CategorieService } from 'src/app/categorie/categorie.service';

import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { NotificationService } from '../authentication/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CustomHttpRespone } from '../model/custom-http-response';
import { AuthenticationService } from '../authentication/authentication.service';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css'],
})
export class ContratComponent implements OnInit {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[] = [];
  public contrat: Contrat | undefined;
  public refreshing: boolean = false;
  public selectedUser: User = new User();
  public fileName!: string;
  public imageUrl: File | null | undefined;
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  public currentUsername: string | undefined;
  pageHtml: string = '';

  public Contrats: Contrat[] = [];
  public contrats: Contrat[] = [];

  public categories: Categorie[] = [];

  public departements: Departement[] = [];

  @ViewChild('ContratSelect') contratSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('departementSelect')
  departementSelect!: ElementRef<HTMLSelectElement>;

  @ViewChild('categorieSelect') categorieSelect!: ElementRef<HTMLSelectElement>;

  public editContrat: Contrat | undefined | null;
  public deleteContrat: Contrat | undefined | null;

  constructor(
    private router: Router,
    private UserService: UserService,
    private CategorieService: CategorieService,
    private ContratService: ContratService,
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
    const cachedUser = this.ContratService.getContratsFromLocalCache();

    this.getContrats(true);
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
        //   alert(error.message);
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

  public selectedContrat: Contrat | null = null;

  public getContrats(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.ContratService.getContrats().subscribe(
        (response: Contrat[]) => {
          this.ContratService.addContratsToLocalCache(response);
          this.contrats = response;
          this.refreshing = false;
          if (showNotification) {
            //  this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          // this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  public myString: string = '';

  public getDfetchUnreadContrats(): void {
    this.ContratService.getDfetchUnreadContrats().subscribe(
      (response: string) => {
        this.myString = response;
        console.log(this.myString);
      },
      (error: HttpErrorResponse) => {
        // alert(error.message);
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

  getContratClass(contrat: Contrat) {
    let dateDebut: Date;
    if (contrat.dateDebut instanceof Date) {
      dateDebut = contrat.dateDebut;
    } else {
      dateDebut = new Date(contrat.dateDebut);
    }

    let dateEchance: Date;
    if (contrat.dateEchance instanceof Date) {
      dateEchance = contrat.dateEchance;
    } else {
      dateEchance = new Date(contrat.dateEchance);
    }

    const diff = (dateEchance.getTime() - dateDebut.getTime()) / 86400000;
    const today = new Date();

    if (today >= dateEchance) {
      return 'red-class';
    } else if (diff <= contrat.delaiPreavis / 2 && diff >= 0) {
      return 'orange-class';
    } else if (diff > contrat.delaiPreavis / 2 && diff <= 90) {
      return 'yellow-class';
    } else {
      return 'green-class';
    }
  }

  @ViewChild('addForm') addForm!: NgForm; // Assurez-vous d'avoir un template reference variable 'addForm' dans votre formulaire

  public onAddContrat(addForm: NgForm, fileInput: HTMLInputElement): void {
    if (!addForm.valid) {
      console.log("Le formulaire n'est pas valide.");
      return;
    }
    const formData = new FormData();

    const contratData = addForm.value as Contrat;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      contratData.file = file;

      this.ContratService.addContrat(contratData).subscribe(
        (response: Contrat) => {
          console.log(response);
          this.getCategories();
          addForm.resetForm();
          document.getElementById('add-Contrat-form')?.click();
        },
        (error) => {
          console.error("Erreur lors de l'ajout du contrat :", error);
          addForm.resetForm();
        }
      );
    }
  }

  public selectedContratId: number = 5;

  public onUpdateContrat(Contrat: Contrat): void {
    this.ContratService.updateContrat(Contrat).subscribe(
      (response: Contrat) => {
        console.log(response);
        this.getContrats(true);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  public onDeleteContrat(ContratId: number | undefined): void {
    if (ContratId) {
      this.ContratService.deleteContrat(ContratId).subscribe(
        (response: void) => {
          console.log(response);
          this.getContrats(true);
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
    //this.getContrats(); // Empêche la soumission du formulaire par défaut
    this.searchContrats();
  }

  public searchContrats(): void {
    let results: Contrat[] = [];
    if (this.searchTerm !== '') {
      const searchTerms = this.searchTerm
        .toLowerCase()
        .split(' ')
        .filter((term) => term !== '');
      results = this.contrats.filter((contrat) => {
        const found = searchTerms.some(
          (term) =>
            contrat.nom.toLowerCase().includes(term) ||
            contrat.id.toString().includes(term)
        );
        if (found) {
          console.log('Contenu vérifié :', contrat);
        } else {
          console.log('Contenu non vérifié :', contrat);
        }
        return found;
      });
      this.contrats = results;
      console.log(this.contrats);
    } else {
      this.getContrats(true);
    }
  }

  onSearchInput(): void {
    // Add a small delay to allow the user to finish typing
    setTimeout(() => {
      // Call the search function whenever the input changes
      this.searchContrats();
    }, 300);
  }

  filteredContrats: Contrat[] = [];

  searchTermm: string = '';

  // Recherche Contrat

  public searchContratss(key: string): void {
    console.log(key);
    const searchTerms = key
      .toLowerCase()
      .split(' ')
      .filter((term) => term !== '');

    if (searchTerms.length === 0) {
      this.getContrats(true);
      return;
    }

    let results: Contrat[] = this.contrats;

    for (const term of searchTerms) {
      const normalizedTerm = unidecode(term);

      results = results.filter((contrat) => {
        const normalizedNom = unidecode(contrat.nom.toLowerCase());

        const termFoundInNom = normalizedNom.includes(normalizedTerm);

        return termFoundInNom;
      });
    }

    this.contrats = results;
  }

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public onOpenModal(Contrat: Contrat | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addContratModal');
    }
    if (mode === 'edit') {
      this.editContrat = Contrat;
      button.setAttribute('data-target', '#updateContratModal');
    }
    if (mode === 'delete') {
      this.deleteContrat = Contrat;
      button.setAttribute('data-target', '#deleteContratModal');
    }
    container?.appendChild(button);
    button.click();
  }

  // TELECHARGER DOCUMENT////////////////////////////////////

  public DownloadContrat(contratId: number) {
    this.ContratService.viewContrat(contratId).subscribe(
      (response: any) => {
        const contentDispositionHeader = response.headers.get(
          'Content-Disposition'
        );
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        const filename =
          matches && matches.length > 1 ? matches[1] : 'contrat.pdf';

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
        console.error('Error while viewing the contrat:', error);
      }
    );
  }

  viewContrat(contratId: number | null) {
    if (contratId)
      this.ContratService.viewContrat(contratId).subscribe(
        (response: any) => {
          const contentDispositionHeader = response.headers.get(
            'Content-Disposition'
          );
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDispositionHeader);
          const filename =
            matches && matches.length > 1 ? matches[1] : 'contrat.pdf';

          const blob = new Blob([response.body], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        (error: any) => {
          console.error('Error while viewing the contrat:', error);
        }
      );
  }

  public selectedDepartementId: number = 5;
  public selectedCategorieId: number = 1;

  public onUpdateDocucument(contrat: Contrat): void {
    const selectedDepartement = this.departements.find(
      (departement) => departement.id === this.selectedDepartementId
    );

    if (selectedDepartement) {
      contrat.departement = selectedDepartement;
    }

    const selectedCategorie = this.categories.find(
      (categorie) => categorie.id === this.selectedCategorieId
    );

    if (selectedCategorie) {
      contrat.categorie = selectedCategorie;
    }
  }
}
