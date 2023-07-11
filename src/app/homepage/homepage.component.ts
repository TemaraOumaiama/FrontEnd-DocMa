import { Component, ViewChild } from '@angular/core';
import { SearchTermsComponent } from '../search-terms/search-terms.component'; 
import { SearchService } from './SearchService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {


  searchTerm: string= '';

  constructor(private router: Router,private searchService: SearchService) {}


  searchItems1(key: string) {
    this.searchService.setSearchTerm(key);
    this.router.navigate(['/search']);
console.log('bdina'+key);
this.searchService.searchTriggered.next(this.searchTerm);


  }
  
  
  }










