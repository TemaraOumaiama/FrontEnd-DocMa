import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserService } from './user/user.service';
import { HttpClientModule } from '@angular/common/http';import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild, isDevMode } from '@angular/core';
import { DepartementComponent } from './departement/departement.component';
import { CategorieComponent } from './categorie/categorie.component';
import { AppRoutingModule } from './app-routing.module'; // CLI imports AppRoutingModule
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DocumentComponent } from './document/document.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SearchTermsComponent } from './search-terms/search-terms.component';	
import { SearchService } from './homepage/SearchService.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { ContratComponent } from './contrat/contrat.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContratSuiviComponent } from './contrat-suivi/contrat-suivi.component';
import { DossierComponent } from './dossier/dossier.component';
import { VeilleJuridiqueComponent } from './veille-juridique/veille-juridique.component';
import { AuthenticationComponent } from './authentication/authentication.component';



import {  HTTP_INTERCEPTORS } from '@angular/common/http';


import { AuthenticationService } from './authentication/authentication.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './authentication/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DossiertestComponent } from './dossiertest/dossiertest.component';
import { ContratjComponent } from './contratj/contratj.component';



@NgModule({
  declarations: [
    AppComponent,
    DepartementComponent,
    CategorieComponent,
    UserComponent,
    HomepageComponent,
    DocumentComponent,
    UserDetailsComponent,
    SearchTermsComponent,
    LoginPageComponent,
    ContratComponent,
    NavBarComponent,
    ContratSuiviComponent,
    DossierComponent,
    VeilleJuridiqueComponent,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    DossiertestComponent,
    ContratjComponent,  
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,




  ],
  providers: [NotificationService,UserService,  SearchService,AuthenticationGuard, AuthenticationService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }

