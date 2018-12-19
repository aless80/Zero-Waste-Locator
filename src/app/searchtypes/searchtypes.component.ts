import { Component, Input, Output, OnDestroy } from '@angular/core';
import { Store } from "../models/store.model";
import { EventEmitter } from "@angular/core";
import { OnChanges, SimpleChanges, SimpleChange } from "@angular/core";

import { ToMapService } from '../services/to-map.service';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-searchtypes',
  templateUrl: './searchtypes.component.html',
  styleUrls: ['./searchtypes.component.css']
})
export class SearchtypesComponent implements OnDestroy {
  @Input() storetypes: Store[];
  @Output() typesEmit = new EventEmitter();
  subscription: Subscription;

  constructor(private toMapService: ToMapService) {
    this.subscription = toMapService.typeToggle$.subscribe(
      obj => {
       console.log(obj)
    });
   }

  ngOnChanges(changes: SimpleChanges) {
    console.log("searchtypes - ngOnChanges", changes);
  }

  sendTypeToggle(event: any) {
    //Tell Map parent to search on types
    console.log('searchtypes.component sendTypeToggle:', event)
    this.toMapService.sendTypeToggle({ name: event.target.name, checked: event.target.checked })
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
