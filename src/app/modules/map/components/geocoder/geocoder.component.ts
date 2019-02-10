import { Component, OnInit } from '@angular/core';
import { StoreService } from "../../../../shared/services/store.service";
import { MapComponent } from '../../map.component'
import { Store } from "../../../../shared/models/store.model";
//Not sure forwaredRef is needed to inject parent (Map) in child (Geocoder) class
import {Inject, forwardRef} from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment';

/*
Note for myself
Instead of injecting parent Map in child (Geocoder), the other option is to use an emitter in child
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
<button type="submit" class="btn btn-dark" (click)="findLocationTest()">Search</button>
*/

@Component({
  selector: 'app-geocoder',
  templateUrl: './geocoder.component.html',
  styleUrls: ['./geocoder.component.css']
})
export class GeocoderComponent implements OnInit {
  public static readonly DEFAULT_SEARCH = "";//Bjerregaards gate 60C, 0174 Oslo";
  search_string: string;
  geocoder: any;
  searchQuota: string = '';

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    @Inject(forwardRef(
      () => MapComponent)) private _parent:MapComponent
      ) { }

  ngOnInit() {
    this.search_string = GeocoderComponent.DEFAULT_SEARCH;
  }

  //Check if address to be searched is already in DB
  search(){
    //Verify whether cleaned searched string is in DB
    this.storeService.address_exists(this.search_string)
      .subscribe(
        (store: [any]) => {
          //No need for geocoding when address to be searched is stored in DB
          if (!store.length) {
            //See if the user did not exceed their geocoding quota and is allowed to search
            this.allowGeocodingSearch(this.geocoding.bind(this)) //need to either bind this
          } else {
            console.log(store.length + " match"+(store.length != 1 ? 'es' : '') + ". Loading address from database", store);
            this._parent.searchResult = store[0];
            this._parent.process_results(store[0]);
          }
        },
        err => console.error("Search err:", err)
    );
  }

  geocoding() {
    //TODO: consider to use Place API:
    //https://developers.google.com/maps/documentation/geocoding/best-practices
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode(
      {
        address: this.search_string,
        region: this._parent.regionBias,
        componentRestrictions: { country: this._parent .componentRestrictions } 
      },
      (results, status) => {
        console.log("Geocoding status:", status, " results:", results);
        if (status == google.maps.GeocoderStatus.OK) {
          //Transform google maps result to Store type
          var store:Store = this.storeService.result2Store(results[0]);
          //Send to parent Map component
          this._parent.searchResult = store;
          this._parent.process_results(store);
          //Log that the user carried out a search
          this.logUserSearch();
        }
      }
    );
  }

  //Return object with how many queries the user run
  allowGeocodingSearch(callback) {
    //Get the username from localStorage
    let userJSON = localStorage.getItem('user')
    let username = JSON.parse(userJSON)['username']
    //Call service to interact with the backend
    this.authService.getSearchFrequency(username).subscribe(res => {
        if(res.success) {
          // Check if the user is allowed to run a geolocation search
          //You get eg res.data: { total: 0, lasthour: 0, today: 0 } or { lasthour: 0, today: 7, total: 7}          
          if (this.allowGeocodingSearchLogic(res.data)) {
            callback()
          } else {
            console.log(this.searchQuota)
          }
        }
      },
      err => {
        //You get: res: Object { success: false, msg: <err> }
        console.error('Error when retrieving number of geolocation searches:', err);
      }
    );
  }

  allowGeocodingSearchLogic(stats){
    this.searchQuota = '';
    if (stats['total'] > environment.geolocation_quota) {
      this.searchQuota = 'Sorry, you exceeded your search quota ('+environment.geolocation_quota+' geolocation searches).'
      return false
    }
    if (stats['today'] > environment.geolocation_daily_quota) {
      this.searchQuota = 'Sorry, you exceeded your search quota for today ('+environment.geolocation_daily_quota+' geolocation searches).'
      return false
    }
    if (stats['lasthour'] > environment.geolocation_hourly_quota) {
      this.searchQuota = 'Sorry, you exceeded your search quota for the last hour ('+environment.geolocation_hourly_quota+' geolocation searches).'
      return false
    }
    return true
  }
  
  //Log in DB that the user carried out a search
  logUserSearch() {
    //Get the username from localStorage
    let userJSON = localStorage.getItem('user')
    let username = JSON.parse(userJSON)['username']
    //Call service to interact with the backend
    this.authService.logUserSearch(username).subscribe(data => {
      if(data.success){
        console.log('Successfully pushed date of geolocation search');
      } else {
        console.log('Error when pushing date of geolocation search: ', data.msg);
      }
    });
  }
  
  //Not used and obsolete but good stuff
  //Geocoding using in node-geocoder in backend
  node_geocode() {
    var out = this.storeService.geocode(this.search_string).subscribe(
      res => {
        console.log("Geocoder geocode.subscribe res:", res);
        //Move map to searched location
        this._parent.map.panTo(
          new google.maps.LatLng(res[0].latitude, res[0].longitude)
        );
        //Pass data to form component and set marker
        this._parent.formResult = this.storeService.result2Store_backend(res[0]);
        this._parent.setMarker(this._parent.formResult, undefined, "Search result");
      },
      err => console.error("Geocoding err:", err),
      () => console.log("Completed")
    );
  }  
}
