import { Component, OnInit } from '@angular/core';
import { StoreService } from "../services/store.service";
import { MapComponent } from '../map/map.component'

//Not sure forwaredRef is needed to inject parent (Map) in child (Geocoder) class
import {Inject, forwardRef} from '@angular/core';
/*
Instead of injecting parent Map in child (Geocoder, the other option is to use an emitter in child
import { EventEmitter, Output } from "@angular/core";
..
export class SaveComponent implements OnInit {
  @Output() search = new EventEmitter<boolean>();
  findLocationTest() {
    this.search.emit(null);
  }
}
//parent:
<app-save (search)="run_geocoding($event)"></app-save>
//child
<button type="submit" class="btn btn-primary" (click)="findLocationTest()">Search</button>
*/

@Component({
  selector: 'app-geocoder',
  templateUrl: './geocoder.component.html',
  styleUrls: ['./geocoder.component.css']
})
export class GeocoderComponent implements OnInit {
  search_string: string;

  constructor(
    private storeService: StoreService,
    @Inject(forwardRef(() => MapComponent)) private _parent:MapComponent
    ) { }

  ngOnInit() {
    //this.search_string = this._parent.search_string;
    this.search_string = "Bjerregaards gate 60C, 0174 Oslo";
  }

  //Geocoding using in node-geocoder in backend
  geocode() {
    console.log("map geocode clicked");
    var out = this.storeService.geocode(this.search_string).subscribe(
      res => {
        console.log("map geocode.subscribe res:", res);
        this.process_results_backend(res);
        this._parent.success("Geocoding successful", 2500);
      },
      err => console.error("Geocoding err:", err),
      () => console.log("Completed")
    );
  }
  process_results_backend(results) {
    //TODO:review when more than one search result
    //Move map to searched location
    this._parent.map.panTo(
      new google.maps.LatLng(results[0].latitude, results[0].longitude)
    );
    //Pass data to form component and set marker
    this._parent.formResult = this.storeService.result2Store_backend(results[0]);
    this._parent.setTempMarker(this._parent.formResult, undefined, "Search result");
  }

  run_geocoding() {
    if (!this._parent.geocoder) this._parent.geocoder = new google.maps.Geocoder();
    this._parent.geocoder.geocode(
      {
        address: this.search_string,
        region: "no", //region bias to Norway
        componentRestrictions: { country: this._parent.componentRestrictions } //country restriction to Norway
      },
      (results, status) => {
        console.log("run_geocoding status:", status, " results:", results);
        if (status == google.maps.GeocoderStatus.OK) {
          this.process_results(results);
        }
      }
    );
  }
  process_results(results) {
    //Clear any other previous searches
    this._parent.removeMarkers();
    //TODO:review when more than one search result. Use Place API:
    //https://developers.google.com/maps/documentation/geocoding/best-practices
    //Move map to searched location
    this._parent.map.panTo(results[0].geometry.location);
    //this.setTempMarker(results[0], undefined, 'Search result');
    //Pass data to form component and set marker
    this._parent.formResult = this.storeService.result2Store(results[0]);
    this._parent.setTempMarker(this._parent.formResult, undefined, "Search result");
  }
}
