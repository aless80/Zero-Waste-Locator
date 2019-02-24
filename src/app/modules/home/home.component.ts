import { Component} from "@angular/core";
import { ToMapService } from '../../shared/services/to-map.service'
//import { ViewChild } from '@angular/core';
//import { MapComponent } from './components/map/map.component';

@Component({
  selector: "app-home",
  templateUrl: "home.component.html",
  styles: [`
  body, html {
    height: 100%;
    width: 100%;
  }
  `]
})
export class HomeComponent {
  //@ViewChild(MapComponent) //inject the child Component
  //private mapComponent: MapComponent;

  constructor(
    //private toMapService: ToMapService
  ){
    /* I keep the following in map component
    toMapService.typeToggle$.subscribe(
      obj => this.mapComponent.searchType(obj)        
    );
    toMapService.formSubmit$.subscribe(
      obj => this.mapComponent.save()
    );
    toMapService.searchTab$.subscribe(
      tab => {
        this.mapComponent.sendChangeTab(tab)
      }
    );    */
  }
}