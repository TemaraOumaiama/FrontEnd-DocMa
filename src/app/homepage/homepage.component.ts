import { Component, ViewChild } from '@angular/core';
import { SearchTermsComponent } from '../search-terms/search-terms.component';
import { SearchService } from './SearchService.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../user/user';
import { Role } from '../enum/role.enum';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  searchTerm: string = '';

  constructor(
    private router: Router,
    private searchService: SearchService,
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
    const cachedUser = this.authenticationService.getUserFromLocalCache();
    if (cachedUser !== null) {
      this.user = cachedUser;
    }
  }
  searchItems1(key: string) {
    this.searchService.setSearchTerm(key);
    this.router.navigate(['/search']);
    console.log('bdina' + key);
    this.searchService.searchTriggered.next(this.searchTerm);
  }
}
