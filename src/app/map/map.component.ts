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
  geocoder: any;
  curr_marker: google.maps.Marker;
  markers: any[] = [];
  selectedMarkerIndex: number;
  infowindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  //Default settings for map and search. They can be removed
  default_latitude: number = 49.935;
  default_longitude: number = 10.79;
  search_string: string;
  componentRestrictions: string = "NO"; //restrict search to Norway

  //Location tracker
  currentLat: any;
  currentLong: any;
  //isTracking: true;

  //marker_types: string[];
  stores: Store[];
  storeListSub: Subscription; //to unsubscribe

  //data passed between map and form
  formResult: Store;

  //message component
  msgText: string = "";

  constructor(
    private storeService: StoreService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.formResult = {
      coords: [Number(59.9267819), Number(10.748087599999963)],
      address: "Bjerregaards gate",
      street_num: "1",
      locality: "Oslo",
      zip: "0174",
      country: "Norway",
      descr: "some descr",
      type: "some type",
      username: "aless80"
    };

    //Load stores
    this.getStores();
    //Create the map
    var mapProp = {
      center: new google.maps.LatLng(
        this.default_latitude,
        this.default_longitude
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
    this.search_string = "Bjerregaards gate 60C, 0174 Oslo";
  }

  ngOnDestroy() {
    //Unsubscribe from service
    console.log("ngOnDestroy");
    this.storeListSub.unsubscribe();
  }

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

    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

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
        console.log("run_geocoding status:", status, " results[0]:", results[0]);
        if (status == google.maps.GeocoderStatus.OK) {
          this.process_results(results);
        }
      }
    );
  }
  process_results(results) {
    //TODO:review when more than one search result
    //Move map to searched location
    this.map.panTo(results[0].geometry.location);
    //this.setTempMarker(results[0], undefined, 'Search result');
    //Pass data to form component and set marker
    this.formResult = this.storeService.result2Store(results[0]);
    this.setTempMarker(this.formResult, undefined, "Search result");
  }

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
    var div = document.createElement("div");
    /*var input1 = document.createElement("input");
    input1.id = "input1";
    input1.type = "text";
    input1.value = "some type";
    input1.style.width = "200px";
    var input2 = document.createElement("input");
    input2.id = "input2";
    input2.type = "submit";
    */
    var anchor = document.createElement("a");
    anchor.href = "#"; //this.removeMarker(store_obj._id)
    anchor.text = "Remove";
    this.selectedMarkerIndex = this.markers.length;
    //Click listeners in elements of marker's InfoWindow
    /*input2.addEventListener("click", () =>
      this.submitForm(this.selectedMarkerIndex)
    );*/
    anchor.addEventListener("click", () => this.removeMarker(store_obj._id)); //this.selectedMarkerIndex
    //Build everything together in iwdiv element
    //div.appendChild(input1);
    //div.appendChild(input2);
    div.appendChild(document.createElement("br"));
    div.appendChild(anchor);
    iwdiv.appendChild(h2);
    iwdiv.appendChild(document.createTextNode(store_obj.descr));
    iwdiv.appendChild(document.createElement("br"));
    iwdiv.appendChild(div);
    //Click listener to marker to set and open InfoWindow
    //marker.content = iwdiv; //pass whole node to marker
    marker.addListener("click", () => {
      this.infowindow.setContent(iwdiv);
      this.infowindow.open(this.map, marker);
    });
    //Push marker to markers
    this.markers.push(marker);
    //Close InfoWindow
    this.hideInfoWindow();
    //TODO: probably I want one single temp marker
  }
  hideInfoWindow() {
    //useful?
    this.infowindow.close();
  }
  submitForm(markerind) {
    //TODO Problem: edited string stays even when I do not submit
    console.log("submitForm: ", markerind);
    console.log("this: ", this);
    console.log("this.markers: ", this.markers);
    console.log(
      "this.markers[markerind].content: ",
      this.markers[markerind].content
    );
  }
  removeMarker(_id) {
    var markerind = this.selectedMarkerIndex;
    this.storeService
      .deleteStore(_id)
      .subscribe(res => console.log, err => console.error(err));
    this.markers[markerind].setMap(null);
  }
  editMarkerInfo(markerind) {
    console.log("editMarkerInfo: ", markerind);
  }
  deleteMarker(markerind) {
    console.log("deleteMarker before: ", this.markers);
    this.markers.splice(markerind, 1);
    console.log("deleteMarker after: ", this.markers);
  }

  ///API calls through service
  // Fetches all documents.
  getStoresV1() {
    this.storeService.getStores().subscribe(
      (data: Store[]) => {
        this.stores = data;
        this.updateMap();
      },
      err => console.error(err)
    );
  }
  getStores() {
    this.storeListSub = this.storeService.getStores().subscribe(
      (data: Store[]) => {
        this.stores = data;
        console.log("data", data);
        this.updateMap();
      },
      err => console.error(err)
    );
  }
  updateMap() {
    this.stores.forEach(element => {
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

  //Messages
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
  /*setMapOnAll(map) {
    // Sets the map on all markers in the array
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
    }
  }
  showMarkers() {
    // Shows any markers currently in the array
    this.setMapOnAll(this.map);
  }
  removeMarkers() {
    if (this.markers.length) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      //Clear markers array
      this.markers = [];
    } else {
      console.log('No markers to remove')
    }
  }*/

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
}
