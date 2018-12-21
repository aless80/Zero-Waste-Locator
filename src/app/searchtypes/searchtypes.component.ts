import { Component, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { ToMapService } from '../services/to-map.service';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-searchtypes',
  templateUrl: './searchtypes.component.html',
  styleUrls: ['./searchtypes.component.css']
})
export class SearchtypesComponent implements OnInit, OnDestroy {
  @Input() storetypes: string[];
  @Output() typesEmit = new EventEmitter();
  subscription: Subscription;
  checked: string[]

  ngOnInit() {
    this.checked = this.storetypes.slice(0); //shallow copy
  }
  constructor(private toMapService: ToMapService) {
    this.subscription = toMapService.typeToggle$.subscribe();
   }

  sendAllToggle(selection: boolean) {
    //console.log('sendAllToggle this.checked=',this.checked, ' storetypes=',this.storetypes)
    if (selection) 
      this.checked = this.storetypes.slice(0); //shallow copy
    else 
      this.checked = new Array(this.storetypes.length).fill(undefined); 
    this.toMapService.sendTypeToggle(this.checked);
  }

  sendTypeToggle(event: any, ind: number) {
    //Tell Map parent to search on types
    if (event.target.checked) {      
      this.checked[ind] = event.target.name;
    } else if (!event.target.checked) {
      this.checked[ind] = undefined;
    }
    this.toMapService.sendTypeToggle(this.checked.filter(x => x != undefined));
  }

  ngOnDestroy() {
    // Prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
