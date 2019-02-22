import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from "../../models/store.model";
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToMapService } from '../../services/to-map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.css']
})
export class TabsetComponent implements OnDestroy {
  @Input() storetypes: string[];  
  @Input() formResult: Store;
  @Input() storeId: string;
  subscription: Subscription;

  constructor(private toMapService: ToMapService) { }

  public onTabChange($event: NgbTabChangeEvent) {
    //Send notification of tab change to map component
    this.toMapService.sendSearchTab($event.nextId);
  }
  ngOnDestroy() {
    // Prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}