import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router, private appComponent: AppComponent) {}

  ngOnInit() {}

  login() {
    // Effectuez les actions nécessaires pour la connexion, puis appelez la méthode login() de AppComponent
    // pour définir le statut de connexion sur true
    // Par exemple :
    // Vérifiez les informations d'identification ici et effectuez les actions nécessaires
    // Après une connexion réussie, appelez la méthode login() de AppComponent
    this.appComponent.login();

    // Redirigez vers la page d'accueil après une connexion réussie
    this.router.navigate(['/homepage']);
  }
}
