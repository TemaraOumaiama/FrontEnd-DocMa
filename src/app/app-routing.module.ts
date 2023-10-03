import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DepartementComponent } from './departement/departement.component';
import { CategorieComponent } from './categorie/categorie.component';
import { UserComponent } from './user/user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DocumentComponent } from './document/document.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SearchTermsComponent } from './search-terms/search-terms.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ContratComponent } from './contrat/contrat.component';
import { ContratSuiviComponent } from './contrat-suivi/contrat-suivi.component';
import { DossierComponent } from './dossier/dossier.component';
import { VeilleJuridiqueComponent } from './veille-juridique/veille-juridique.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationGuard } from './authentication/authentication.guard';

const routes: Routes = [
  {
    path: 'categorie',
    component: CategorieComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: 'departement', component: DepartementComponent },
  { path: 'departements/search/:searchTerm', component: DepartementComponent },
  { path: 'departement/hello', component: DepartementComponent },
  { path: 'user', component: UserComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'contratAdmin', component: LoginComponent },

  { path: 'document', component: DocumentComponent },
  { path: 'users/:userId', component: UserDetailsComponent },
  { path: 'search', component: SearchTermsComponent },
  { path: 'contrat', component: ContratComponent },
  { path: 'suivicontrat', component: ContratSuiviComponent },
  { path: 'dossier', component: DossierComponent },
  { path: 'veille', component: VeilleJuridiqueComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user/management',
    component: UserComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
