import { Component } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Contrat } from './contrat';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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





@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css']
})
export class ContratComponent {

pageHtml: string = '';

public Contrats: Contrat[] = [];
public contrats: Contrat[] = [];

public categories: Categorie[] = [];

public departements: Departement[] = [];

public users: User[] = [];

@ViewChild('ContratSelect') contratSelect!: ElementRef<HTMLSelectElement>;
@ViewChild('departementSelect') departementSelect!: ElementRef<HTMLSelectElement>;

@ViewChild('categorieSelect') categorieSelect!: ElementRef<HTMLSelectElement>;


public editContrat: Contrat | undefined|null;
public deleteContrat: Contrat | undefined|null;

constructor(private router: Router,private UserService:UserService,private CategorieService: CategorieService, private ContratService: ContratService,private DepartementService: DepartementService ){}


ngOnInit() {
  this.getContrats();
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
      alert(error.message);
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
      alert(error.message);
    }
  );
}




public selectedContrat: Contrat | null = null; 


clearSearchInput() {
  this.searchTerm = '';
  this.getContrats();
  
}



public getContrats(): void {
  this.ContratService.getContrats().subscribe(
    (response: Contrat[]) => {
      this.contrats = response;
      console.log('Hello'+this.contrats);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );

}
public myString: string='';

public getDfetchUnreadContrats(): void{

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
      alert(error.message);
    }
  );
}





onAddContrat(addForm: NgForm, departementSelect: HTMLSelectElement, categorieSelect: HTMLSelectElement, fileInput: HTMLInputElement) {
  const formData = new FormData();

  if (fileInput.files && fileInput.files.length > 0) {
    formData.append('file', fileInput.files[0]);
  }

  formData.append('categorieId', categorieSelect.value);
  formData.append('userId', '2');
  formData.append('departementId', departementSelect.value);

  this.ContratService.addContrat(formData).subscribe(
    response => {
      console.log('Contrat ajouté avec succès !', response);
      // Faire quelque chose avec la réponse du serveur si nécessaire
    },
    error => {
      console.error('Erreur lors de l\'ajout du contrat !', error);
      // Gérer l'erreur si nécessaire
    }
  );
}














public selectedContratId: number=5;

public   onUpdateContrat(Contrat: Contrat): void {

  this.ContratService.updateContrat(Contrat).subscribe(
    (response: Contrat) => {
      console.log(response);
      this.getContrats();
    },
    (error: any) => {
      console.error(error);
    }
  );
}




public onDeleteContrat(ContratId: number|undefined): void {
  if (ContratId){
    this.ContratService.deleteContrat(ContratId).subscribe(
    (response: void) => {
      console.log(response);
      this.getContrats();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
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
    const searchTerms = this.searchTerm.toLowerCase().split(' ').filter(term => term !== '');
    results = this.contrats.filter((contrat) => {
      const found = searchTerms.some((term) =>
        contrat.nom.toLowerCase().includes(term) ||
        contrat.id.toString().includes(term)
      );
      if (found) {
        console.log("Contenu vérifié :", contrat);
      }
      else{
        console.log("Contenu non vérifié :", contrat);
      }
      return found;
    });
    this.contrats = results;
    console.log(this.contrats);
  } else {
    this.getContrats();
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
  const searchTerms = key.toLowerCase().split(' ').filter(term => term !== '');

  if (searchTerms.length === 0) {
    this.getContrats();
    return;
  }

  let results: Contrat[] = this.contrats;

  for (const term of searchTerms) {
    const normalizedTerm = unidecode(term);

    results = results.filter(contrat => {
      const normalizedNom = unidecode(contrat.nom.toLowerCase());
     

      const termFoundInNom = normalizedNom.includes(normalizedTerm);

      return termFoundInNom 
    });
  }

  this.contrats = results;
}






















public onOpenModal(Contrat: Contrat|null, mode: string): void {
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
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'contrat.pdf';

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







viewContrat(contratId: number|null) {
  if (contratId)
  this.ContratService.viewContrat(contratId).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'contrat.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    (error: any) => {
      console.error('Error while viewing the contrat:', error);
    }
  );
}








public selectedDepartementId: number=5;
public selectedCategorieId: number=1;


public   onUpdateDocucument(contrat: Contrat): void {
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

