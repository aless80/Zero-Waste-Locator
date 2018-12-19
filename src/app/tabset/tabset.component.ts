import { Component, Input } from '@angular/core';
import { Store } from "../models/store.model";

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.css']
})
export class TabsetComponent {
  @Input() storetypes: Store[];  
  @Input() formResult: Store;
  
  constructor() { }

}