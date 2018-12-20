import { Component, Input } from '@angular/core';
import { Store } from "../models/store.model";
import { OnChanges, SimpleChanges, SimpleChange } from "@angular/core";

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.css']
})
export class TabsetComponent {
  @Input() storetypes: string[];  
  @Input() formResult: Store;
  

  ngOnChanges(changes: SimpleChanges) {
    console.log("tabset - ngOnChanges", changes);
  }

  constructor() { }

}