import { Component, OnInit, OnDestroy } from "@angular/core";
import { ViewChild } from "@angular/core";
//import { FormComponent }  from '../form/form.component';
import { StoreService } from "../services/store.service";
import { Store } from "../models/store.model";
import { Subscription } from "rxjs"; //to unsubscribe
import { AlertService } from "../services/alert.service";
//TODO: do not run search when empty address
//TODO: decide many markers or only one. then probably clear form when second search

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
  componentRestrictions: string = "NO"; //restrict search to Norway. Used in Geocoder

  //Communication between Map and Form
  formResult: Store;
  storetypes: Store[];
  //formResultID: string = '';
  
  //Message component
  msgText: string = "";

  constructor(
    private storeService: StoreService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    //Some addresses that work
    //Sylvia Mølleren: Hegdehaugsveien 12, 0167 Oslo
    //Fretex: Ullevålsveien 12, 0171 Oslo
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
      username: "aless80"
    };*/
    //Load stores
    this.getStores();
    //Get all the distinct store types present in DB. Pass to Form component
    this.storeService.getDistinctValues('types')
      .subscribe(
        (data: Store[]) => this.storetypes = data,
        err => console.error(err)
      );
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
    });
    //Find current location
    this.findMe();
    //Default location for search
    //this.search_string = "Bjerregaards gate 60C, 0174 Oslo";
  }

  ngOnDestroy() {
    //Unsubscribe from service
    console.log("ngOnDestroy");
    this.storeListSub.unsubscribe();
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
      icon =
        "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png";
    if (title == undefined) title = "No title";

    //this.currentLat = position.coords.latitude;
    //this.currentLong = position.coords.longitude;

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
    this.formResult = store;
    //Handle search marker
    this.removeSearchMarkers();
    this.setTempMarker(store, undefined, "Search result");
    this.map.panTo(
      new google.maps.LatLng(store.coords[0], store.coords[1])
    );
  }
  //Create marker with InfoWindow. Push marker to this.markers
  setTempMarker(store_obj, icon?: string, title?: string) {
    //TODO: check if point already exists!
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        store_obj.coords[0],
        store_obj.coords[1]
      ),
      map: this.map,
      title: title,
      icon: icon
    });
    //Create markerinfo object
    /*var markerinfo = {
      //'markerind': this.markers.length,
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
    anchor.href = "#"; //this.removeMarker(store_obj._id)
    anchor.text = "Remove";
    this.selectedMarkerIndex = this.markers.length;
    //Click listener in "Remove" link of marker's InfoWindow
    anchor.addEventListener("click", () => {
      this.removeMarker(store_obj._id)      
    }); 
    //Build everything together in iwdiv element. Add text
    var div = document.createElement("div");
    div.appendChild(document.createElement("br"));
    div.appendChild(anchor);
    iwdiv.appendChild(h2);
    iwdiv.appendChild(document.createTextNode('Adress: '+store_obj.address+', '+store_obj.street_num+' '+store_obj.zip+', '+store_obj.locality));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(document.createTextNode('Store type: '+store_obj.types.join(', ')));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(document.createTextNode('Description: '+store_obj.descr));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(div);
    //Click listener to marker to set and open InfoWindow
    //marker.content = iwdiv; //pass whole node to marker
    marker.addListener("click", () => {
      this.infowindow.setContent(iwdiv);
      this.infowindow.open(this.map, marker);
      this.formResult = store_obj;
    });
    //Push marker to markers
    this.markers.push(marker);
    //Close InfoWindow
    this.hideInfoWindow();
  }
  hideInfoWindow() {
    this.infowindow.close();
  }
  removeMarker(_id) {
    if (this.markers[this.selectedMarkerIndex].title == 'Search result') {
      this.removeSearchMarkers();
      return
    }      
    this.storeService
      .deleteStore(_id)
      .subscribe(res => console.log, err => console.error(err));
    this.markers[this.selectedMarkerIndex].setMap(null);
    this.deleteMarker(this.selectedMarkerIndex);
  }
  removeSearchMarkers() {
    if (this.markers.length) {
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].title == 'Search result') {
          this.markers[i].setMap(null);
          this.deleteMarker(i);
        }
      }
    } else {
      console.log('No markers to remove')
    }
  }
  deleteMarker(markerind: number) {
    console.log("deleteMarker before: ", this.markers);
    this.markers.splice(markerind, 1);
    console.log("deleteMarker after: ", this.markers);
  }

  ///API calls through service
  //Get emitter to save form
  getEmitter(event:KeyboardEvent){
    if (event == undefined) return
    console.log('getEmitter',event.type,event)
    //if (event.type == "submit") 
    //Handle Update and Save

    console.log('getEmitter',this.formResult._id)

    if (this.formResult._id != undefined) {
      this.storeService.updateStore(this.formResult)
        .subscribe(
            res => this.afterUpdating(),
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
  afterUpdating(){
    //Close search marker
    this.removeSearchMarkers(); //not sure it is needed 
    this.success("Store updated in database",2500)
  }
  afterSaving(){
    //Close search marker
    this.removeSearchMarkers();
    //Pass to getStores callback 
    var callback = () => {
      //After stores have been loaded, open the store saved last
      google.maps.event.trigger(this.markers[this.markers.length-1], 'click')
      //Show message
      this.success("Store saved in database",2500)
    }
    //Reload stores from DB
    this.getStores(callback);    
  }

  
  // Fetch all documents.
  getStores(callback?) {
    //First delete all markers
    this.deleteAllMarkers()
    //Query DB, plot all stores
    this.storeListSub = this.storeService.getStores()
      .subscribe(
        (data: Store[]) => {
          this.updateMap(data);
          if (callback!= undefined) callback()
        },
        err => console.error(err)
    );
  }
  updateMap(data:Store[]) {
    data.forEach(element => {
      this.setTempMarker(
        element,
        "http://maps.gstatic.com/mapfiles/markers2/icon_green.png",
        element.descr
      );
    });
  }
  // Deletes the selected document and refreshes the document view.
  deleteStore(id) {
    this.storeService.deleteStore(id).subscribe(() => {
      this.getStores();
      this.success("Store deleted", 2500);
    });
  }


  ///Messages
  showAlert(text: string): void {
    if (this.msgText != "") return;
    this.msgText = text;
    setTimeout(() => {
      this.msgText = "";
    }, 2000);
  }
  success(message: string, timeout?: number) {
    this.alertService.success(message);
    setTimeout(() => this.clear(), timeout);
  }

  error(message: string, timeout?: number) {
    this.alertService.error(message);
    setTimeout(() => this.clear(), timeout);
  }

  info(message: string, timeout?: number) {
    this.alertService.info(message);
    setTimeout(() => this.clear(), timeout);
  }

  warn(message: string, timeout?: number) {
    this.alertService.warn(message);
    setTimeout(() => this.clear(), timeout);
  }

  clear() {
    this.alertService.clear();
  }

  /// Maybe useful later
  deleteAllMarkers() {
    // Sets the map on all markers in the array
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
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
        this.success("Geocoding successful", 2500);
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
    this.setTempMarker(this.formResult, undefined, "Search result");
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
    //this.setTempMarker(results[0], undefined, 'Search result');
    //Pass data to form component and set marker
    this.formResult = this.storeService.result2Store(results[0]);
    this.setTempMarker(this.formResult, undefined, "Search result");
  }
  */
}
