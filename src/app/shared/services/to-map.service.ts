import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToMapService {

  constructor() { }
  
  // Observable string sources
  private typeToggleSource = new Subject<any>();
  private formSubmitSource = new Subject<boolean>();
  private searchTabSource = new Subject<string>();

  // Observable string streams
  typeToggle$ = this.typeToggleSource.asObservable();
  formSubmit$ = this.formSubmitSource.asObservable();
  searchTab$ = this.searchTabSource.asObservable();

  // Service message commands
  sendTypeToggle(checked: string[]) {
    this.typeToggleSource.next(checked);
  }
  sendFormSubmit(input: boolean) {
    this.formSubmitSource.next(input);
  }
  sendSearchTab(input: string) {
    this.searchTabSource.next(input);
  }
}
