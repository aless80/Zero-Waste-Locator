import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class ToMapService {

  constructor() { }
  
  // Observable string sources
  private typeToggleSource = new Subject<any>();
  private formSubmitSource = new Subject<boolean>();
  private searchTabSource = new Subject<string>();
  private processGeocodingResultsSource = new Subject<Store>();

  // Observable string streams
  typeToggle$ = this.typeToggleSource.asObservable();
  formSubmit$ = this.formSubmitSource.asObservable();
  searchTab$ = this.searchTabSource.asObservable();
  processGeocodingResults$ = this.processGeocodingResultsSource.asObservable();

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
  processGeocodingResults(input: Store){
    this.processGeocodingResultsSource.next(input);
  }
}
