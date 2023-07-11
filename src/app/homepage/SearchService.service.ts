import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchTriggered: any;

  setSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }

  getSearchTerm() {
    return this.searchTermSubject.asObservable();
  }
}
