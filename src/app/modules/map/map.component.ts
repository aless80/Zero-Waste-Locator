import { Component, OnInit, OnDestroy } from "@angular/core";
import { ViewChild } from "@angular/core";
import { StoreService } from "../../shared/services/store.service";
import { Store } from "../../shared/models/store.model";
import { Subscription } from "rxjs"; //to unsubscribe
import { AlertService } from "../../shared/services/alert.service";
import { ToMapService } from '../../shared/services/to-map.service'
import { ValidateService } from '../../shared/services/validate.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  @ViewChild("gmap") gmapElement: any;
  map: google.maps.Map;
  infowindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  curr_marker: google.maps.Marker;
  markers: any[] = [];
  selectedMarkerIndex: number;  
  storeListSub: Subscription; //to unsubscribe

  //Default settings for map and search. They can be removed
  public static readonly DEFAULT_LAT = 49.935;
  public static readonly DEFAULT_LNG = 10.79;
  componentRestrictions: string = "NO"; //Restrict search to Norway. Used in Geocoder
  regionBias: string = "no"; //region bias to Norway

  //Communication between Map and Form
  formResult: Store;    //Location of the searched location or clicked marker
  searchResult: Store;  //The searched location
  storetypes: string[]; //All types of store present in DB
  storeId: string;      //Reference to the store ID. used for the rating component

  //Message component
  //msgText: string = "";

  constructor(
    private storeService: StoreService,
    private alertService: AlertService,
    private toMapService: ToMapService,
    private validateService: ValidateService,
    private authService: AuthService
  ) {
    toMapService.typeToggle$.subscribe(
      obj => this.searchType(obj)        
    );
    toMapService.formSubmit$.subscribe(
      obj => this.save()
    );
    toMapService.searchTab$.subscribe(
      tab => {
        //User changed tabs
        if (tab == 'search') {
          //If search was used, show it
          var callback;
          if (this.searchResult) {
            callback = () => {
              this.process_results(this.searchResult)
              //Open marker's InfoWindow not working
              this.openInfoWindow(this.markers.length-1)
            }
          }
          this.showAllStores(callback);          
        } else if (tab == 'filter') {
          this.removeSearchMarkers();
        }
      }
    );      
  }
  ngOnInit() {
    //Some addresses that work
    //Sylvia Mølleren: Hegdehaugsveien 12, 0167 Oslo
    //Fretex: Ullevålsveien 12, 0171 Oslo
    //Default location for search string: see geolocation.component.ts
    //Uncomment to populate form at startup
    /*this.formResult = {
      coords: [Number(59.9267819), Number(10.748087599999963)],
      address: "Slottsplassen",
      street_num: "1",
      locality: "Oslo",
      zip: "0010",
      country: "Norway",
      descr: "This is just an example to populate the form component",
      types: ["Charity shop"],
      username: "aless80",
      rating: {total: 10, count: 3}
    };*/
    //Load stores
    this.showAllStores();
    //Get all the distinct store types present in DB. Pass to Form component
    this.loadDistinctTypes();
    //Create the map
    var mapProp = {
      center: new google.maps.LatLng(
        MapComponent.DEFAULT_LAT,
        MapComponent.DEFAULT_LNG
      ),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    //Listener to InfoWindow
    google.maps.event.addListener(this.infowindow, "closeclick", () => {
      this.formResult = undefined;
      this.searchResult = undefined;
    });
    //Find current location
    this.findMe();
  }

  ngOnDestroy() {
    //Unsubscribe from service
    if (typeof this.storeListSub !== 'undefined') {
      this.storeListSub.unsubscribe();
    }
  }
  ///Get position of client
  //https://medium.com/@balramchavan/display-and-track-users-current-location-using-google-map-geolocation-in-angular-5-c259ec801d58
  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.showCurrentPosition(
          position,
          "http://maps.google.com/mapfiles/kml/pal3/icon28.png"
        );
        this.map.setZoom(12);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  showCurrentPosition(position, icon?: string, title?: string) {
    if (icon == undefined)
      icon = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png";
    if (title == undefined) title = "No title";
    let location = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    this.map.panTo(location);
    //this.map.setZoom(zoom)
    this.setCurrentMarker(location, icon, "Current location");
  }
  setCurrentMarker(location, icon?: string, title?: string) {
    if (!this.curr_marker) {
      this.curr_marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: title,
        icon: icon
      });
    } else {
      this.curr_marker.setPosition(location);
      this.curr_marker.setTitle(title);
      this.curr_marker.setIcon(icon);
    }
  }

  ///Handle markers of stores from geocoding search or from DB
  process_results(store) {
    //Pass data to form component and set marker
    store.username = JSON.parse(localStorage.getItem('user')).username
    this.formResult = store;
    this.storeId = store._id;
    //Handle search marker
    this.removeSearchMarkers();
    this.setMarker(store, undefined, "Search result");
    this.map.panTo(
      new google.maps.LatLng(store.coords[0], store.coords[1])
    );
  }
  //Create marker with InfoWindow. Push marker to this.markers
  setMarker(store, icon?: string, title?: string) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        store.coords[0],
        store.coords[1]
      ),
      map: this.map,
      title: title,
      icon: icon
    });
    //Create markerinfo object
    /*var markerinfo = {
      'markertype': 'some type',
      'formatted_address': result.formatted_address
    }*/
    //Add InfoWindow with listeners to marker
    //https://stackoverflow.com/questions/31494380/google-maps-change-content-of-infowindow
    //Create the node shown in marker's InfoWindow
    var iwdiv = document.createElement("div");
    iwdiv.id = "node";
    var h2 = document.createElement("h2");
    h2.textContent = marker.getTitle();
    var anchor = document.createElement("a");
    anchor.href = "#"; //this.removeMarker(store._id)
    anchor.text = "Remove";
    //Click listener in "Remove" link of marker's InfoWindow
    anchor.addEventListener("click", () => {
      this.removeMarker(store._id)      
    }); 
    //Build everything together in iwdiv element. Add text
    var div = document.createElement("div");
    div.appendChild(document.createElement("br"));
    div.appendChild(anchor);
    iwdiv.appendChild(h2);
    iwdiv.appendChild(document.createTextNode('Address: '+store.address+' '+store.street_num+', '+store.zip+', '+store.locality));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(document.createTextNode('Store type: '+store.types.join(', ')));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(document.createTextNode('Description: '+store.descr));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(div);
    //Click listener to marker to set and open InfoWindow
    //marker.content = iwdiv; //pass whole node to marker
    marker.addListener("click", () => {
      this.infowindow.setContent(iwdiv);
      this.infowindow.open(this.map, marker);
      this.selectedMarkerIndex = this.markers.indexOf(marker);
      this.formResult = store;
      this.storeId = store._id;
    });
    //Push marker to markers
    this.markers.push(marker);
    this.selectedMarkerIndex = this.markers.length;
    //Close InfoWindow
    this.hideInfoWindow();
  }
  //User closes a marker's InfoWindow
  hideInfoWindow() {
    this.infowindow.close();
  }
  //Opens a marker's InfoWindow
  openInfoWindow(marker_ind: number){
    google.maps.event.trigger(this.markers[marker_ind], 'click');
  }
  //User clicked on "Remove" in marker's InfoWindow. 
  //Delete from map and from storage, if applicable
  removeMarker(_id) {
    //Close the form
    this.formResult = undefined;
    this.storeId = undefined;
    //If search marker, remove it and return
    if (this.markers[this.selectedMarkerIndex].title == 'Search result') {
      this.removeSearchMarkers();
      //Remove the searched location searchResult
      this.searchResult = undefined;
      return
    }
    //Delete a store from DB
    this.markers[this.selectedMarkerIndex].setMap(null);
    this.markers.splice(this.selectedMarkerIndex, 1);
    this.deleteStore(_id, () => this.showAllStores()); //TODO: review
  }
  removeSearchMarkers() {
    if (this.markers.length) {
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].title == 'Search result') {
          this.markers[i].setMap(null);
          this.markers.splice(i, 1);
        }
      }
    } else console.log('No markers to remove')
  }
  
    
  ///Process emitters: OBSOLETE
  /*//Get emitter to save form
  getSaveEmitter(event:KeyboardEvent){
    if (event == undefined) return
    console.log('getSaveEmitter:',event.type)
    //Handle Update and Save
    if (this.formResult._id != undefined) {
      this.storeService.updateStore(this.formResult)
        .subscribe(
            res => {
              //Close search marker
              this.removeSearchMarkers(); //not sure it is needed 
              this.alertService.success("Store updated in database",2500)
            },
            err => this.error(err, 2500)
        );
    } else {
      this.storeService.addStore(this.formResult)
        .subscribe(
            res => this.afterSaving(),
            err => this.error(err, 2500)
        );
    }
  }
  //OBSOLETE Get emitter to search on types
  getEventToggleEmitter(event:any){
    if (event == undefined) return
    //console.log('getEventToggleEmitter:',event)
    if (event.checked) {
      this.searchtypes.push(event.name);
    } else if (!event.checked) {
      this.searchtypes.splice(this.searchtypes.indexOf(event.name), 1);
    }    
    //Query DB, plot all stores
    this.fetchField((data: Store[]) => {
      //Delete all markers
      this.deleteAllMarkers()
      console.log(data)
      this.updateMap(data);
    })
  }*/

  ///Communication from family components via service
  //User clicked on save or update button in the form
  save(){
    //Handle Update and Save
    if (this.formResult._id != undefined) {
      this.storeService.updateStore(this.formResult)
        .subscribe(
            res => {
              //Close search marker
              this.removeSearchMarkers(); //not sure it is needed 
              //Remove the searched location searchResult
              this.searchResult = undefined;
              //Refresh distinct types
              this.loadDistinctTypes();
              //Refresh Filter tab: refresh stores and current types
              this.searchType(this.storetypes)
              this.alertService.success("Store updated in database", 2500)
            },
            err => this.alertService.error(err, 2500)
        );

    } else {
      //Handle adding a new searched store
      this.storeService.addStore(this.formResult)
        .subscribe(          
            res => this.afterSavingNewStore(),
            err => this.alertService.error(err, 2500)
        );
    }
  }

  afterSavingNewStore(){
    //Close search marker
    this.removeSearchMarkers();
    //Remove the searched location searchResult
    this.searchResult = undefined;
    //Pass to showAllStores callback 
    var callback = () => {
      //After stores have been loaded, open the store saved last
      this.openInfoWindow(this.markers.length-1)
      //Show message
      this.alertService.success("Store saved in database", 2500)
      //Refresh Filter tab: refresh stores and current types
      this.searchType(this.storetypes)
    }
    //Reload stores from DB
    this.showAllStores(callback);    
  }
  
  //Get emitter to search on types
  searchType(array: string[]){
    //console.log('map searchType:',array)
    //Query DB, plot all stores
    this.fetchField('types', array, (data: Store[]) => {
      //Delete all markers
      this.deleteAllMarkers()
      //console.log('map searchType data:',data)
      this.updateMap(data);
    })
  }
  
  /*Other implementation of tabs
  searchType(obj: any){
    if (obj == undefined) return
    console.log('map searchType obj:',obj)
    if (obj.name == "*") {
      if (obj.checked) {
        this.searchtypes = ["*"];
      } else {
        this.searchtypes = obj.name;
      }
    } else {
      if (obj.checked) {
        this.searchtypes.push(obj.name);
      } else if (!obj.checked) {
        this.searchtypes.splice(this.searchtypes.indexOf(obj.name), 1);
      }
    }    
    //Query DB, plot all stores
    this.fetchField('types', this.searchtypes, (data: Store[]) => {
      //Delete all markers
      this.deleteAllMarkers()
      console.log('map searchType data:',data)
      this.updateMap(data);
    })
  }
  */
  
  ///Methods using API calls through service
  // Fetch all documents.
  showAllStores(callback?:Function) {
    //Delete all markers
    //Query DB, plot all stores
    this.storeListSub = this.storeService.getAllStores()
      .subscribe(
        (data: Store[]) => {
          this.deleteAllMarkers();
          this.updateMap(data);
          if (callback != undefined) callback()
        },
        err => console.error(err)
    );
  }
  // Get all store types present in all documents in DB
  loadDistinctTypes() {
    this.storeService.getDistinctValues('types')
      .subscribe(
        (data: string[]) => this.storetypes = data,
        err => console.error(err)
      );
  }
  // Fetch documents of certain types
  fetchField(field: string, array: any[], callback?:Function) {
    this.storeListSub = this.storeService.fetchField(field, array)
      .subscribe(
        (data: Store[]) => {
          if (callback!= undefined) callback(data)
        },
        err => console.error(err)
    );
    
  }

  // Delete the selected document from storage
  deleteStore(id:string, callback?:Function) {
    this.storeService.deleteStore(id)
      .subscribe(() => {
      if (callback!= undefined) callback()
      this.alertService.success("Store deleted", 2500);
    });
  }


  //Plot the given Store data
  updateMap(data:Store[]) {
    data.forEach(element => {
      this.setMarker(
        element,
        "http://maps.gstatic.com/mapfiles/markers2/icon_green.png",
        element.address+' '+element.street_num+', '+element.locality
      );
    });
  }

  ///Messages
  showAlert(text: string): void {
    /*if (this.msgText != "") return;
    this.msgText = text;
    setTimeout(() => {
      this.msgText = "";
    }, 2000);*/
    this.alertService.warn(text)
  }

  //
  deleteAllMarkers() {
    // Sets the map on all markers in the array
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }
  
  
  ///This is for periodic tracking. Useful for mobiles
  /*trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!'
      });
    }
    else {
      this.marker.setPosition(location);
    }
  }*/

    /*Moved to geocoder component
  //Geocoding using in node-geocoder in backend
  geocode() {
    console.log("map geocode clicked");
    var out = this.storeService.geocode(this.search_string).subscribe(
      res => {
        console.log("map geocode.subscribe res:", res);
        this.process_results_backend(res);
        this.alertService.success("Geocoding successful", 2500);
      },
      err => console.error("Geocoding err:", err),
      () => console.log("Completed")
    );
  }
  process_results_backend(results) {
    //TODO:review when more than one search result
    //Move map to searched location
    this.map.panTo(
      new google.maps.LatLng(results[0].latitude, results[0].longitude)
    );
    //Pass data to form component and set marker
    this.formResult = this.storeService.result2Store_backend(results[0]);
    this.setMarker(this.formResult, undefined, "Search result");
  }

  run_geocoding() {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode(
      {
        address: this.search_string,
        region: "no", //region bias to Norway
        componentRestrictions: { country: this.componentRestrictions } //country restriction to Norway
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
    this.removeSearchMarkers();
    //TODO:review when more than one search result. Use Place API:
    //https://developers.google.com/maps/documentation/geocoding/best-practices
    //Move map to searched location
    this.map.panTo(results[0].geometry.location);
    //this.setMarker(results[0], undefined, 'Search result');
    //Pass data to form component and set marker
    this.formResult = this.storeService.result2Store(results[0]);
    this.setMarker(this.formResult, undefined, "Search result");
  }
  */
}
