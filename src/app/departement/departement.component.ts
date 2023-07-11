import { Component } from '@angular/core';
import { HostListener, OnInit, ViewChild } from '@angular/core';
import { Departement } from './departement';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importer le module FormsModule;
import { ElementRef } from '@angular/core';
import { DepartementService } from './departement.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as fuzzysort from 'fuzzysort';
import unidecode from 'unidecode';





@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.css']
})
export class DepartementComponent {

 


 

pageHtml: string = '';

public Departements: Departement[] = [];
publicdeptNames: string[] = [];
public departements: Departement[] = [];

public users: User[] = [];

@ViewChild('departmentSelect') departmentSelect!: ElementRef<HTMLSelectElement>;



public editDepartement: Departement | undefined|null;
public deleteDepartement: Departement | undefined|null;

constructor(private router: Router,private UserService:UserService, private DepartementService: DepartementService ){}


ngOnInit() {
  this.getDepartements();
  this.getUsers();

}






public selectedDepartement: Departement | null = null; 


clearSearchInput() {
  this.searchTerm = '';
  this.getDepartements();
  
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
const encodedString = 'Hello%20World%21';
const decodedString = decodeURIComponent(encodedString);
console.log(decodedString); // Output: "Hello World!"

  
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




public onAddDepartement(addForm: NgForm): void {
  this.DepartementService.adddepartement(addForm.value).subscribe(
    (response: Departement) => {
      console.log(response);
      this.getDepartements();
      addForm.reset();
      document.getElementById('add-Departement-form')!.click();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
      addForm.reset();
    }
  );
}




public selectedDepartementId: number=5;

public   onUpdateDepartement(Departement: Departement): void {

  this.DepartementService.updatedepartement(Departement).subscribe(
    (response: Departement) => {
      console.log(response);
      this.getDepartements();
    },
    (error: any) => {
      console.error(error);
    }
  );
}




public onDeleteDepartement(DepartementId: number|undefined): void {
  if (DepartementId){
    this.DepartementService.deletedepartement(DepartementId).subscribe(
    (response: void) => {
      console.log(response);
      this.getDepartements();
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
  //this.getDepartements(); // Empêche la soumission du formulaire par défaut
  this.searchDepartements();

}


public searchDepartements(): void {
  let results: Departement[] = [];
  if (this.searchTerm !== '') {
    const searchTerms = this.searchTerm.toLowerCase().split(' ').filter(term => term !== '');
    results = this.departements.filter((departement) => {
      const found = searchTerms.some((term) =>
        departement.nom.toLowerCase().includes(term) ||
        departement.description.toLowerCase().includes(term) ||
        departement.id.toString().includes(term)
      );
      if (found) {
        console.log("Contenu vérifié :", departement);
      }
      else{
        console.log("Contenu non vérifié :", departement);
      }
      return found;
    });
    this.departements = results;
    console.log(this.departements);
  } else {
    this.getDepartements();
  }
  
}



onSearchInput(): void {
  // Add a small delay to allow the user to finish typing
  setTimeout(() => {
    // Call the search function whenever the input changes
    this.searchDepartements();
  }, 300);
}


filteredDepartments: Departement[] = [];








searchTermm: string = '';





// Recherche Departement




public searchDepartementss(key: string): void {
  console.log(key);
  const searchTerms = key.toLowerCase().split(' ').filter(term => term !== '');

  if (searchTerms.length === 0) {
    this.getDepartements();
    return;
  }

  let results: Departement[] = this.departements;

  for (const term of searchTerms) {
    const normalizedTerm = unidecode(term);

    results = results.filter(departement => {
      const normalizedNom = unidecode(departement.nom.toLowerCase());
      const normalizedDescription = unidecode(departement.description.toLowerCase());

      const termFoundInNom = normalizedNom.includes(normalizedTerm);
      const termFoundInDescription = normalizedDescription.includes(normalizedTerm);

      return termFoundInNom || termFoundInDescription;
    });
  }

  this.departements = results;
}






















public onOpenModal(Departement: Departement|null, mode: string): void {
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');
  if (mode === 'add') {
    button.setAttribute('data-target', '#addDepartementModal');
  }
  if (mode === 'edit') {
    this.editDepartement = Departement;
    button.setAttribute('data-target', '#updateDepartementModal');
  }
  if (mode === 'delete') {
    this.deleteDepartement = Departement;
    button.setAttribute('data-target', '#deleteDepartementModal');
  }
  container?.appendChild(button);
  button.click();
}



























}

