import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
//import { FormComponent }  from '../form/form.component';

//TODO: do not run search when empty address
//TODO: decide many markers or only one. then probably clear form when second search

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  geocoder: any;
  latitude:number = 59.935;
  longitude:number = 10.79;
  address_string: string;
  componentRestrictions: string = "NO"; //restrict search to Norway

  //isTracking: true;
  currentLat: any;
  currentLong: any;

  curr_marker: google.maps.Marker;
  markers: any[] = [];
  selectedMarkerIndex: number;
  //marker_types: string[];
  infowindow: google.maps.InfoWindow = new google.maps.InfoWindow;

  formResult: any;

  ngOnInit() {}

  ngAfterContentInit() {
    //Create the map
    var mapProp = {
      center: new google.maps.LatLng(49.935, 10.79),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    //Listener to InfoWindow
    google.maps.event.addListener(this.infowindow,'closeclick',() => {
      this.formResult = undefined;
    });
    //Find current location
    this.findMe()
    //Default location for search
    this.address_string = 'Bjerregaards gate 60C, 0174 Oslo';
    //Default form
    this.formResult = {
      address: 'Bjerregaards gate 60C, 0174 Oslo, Norway',
      url: 'https://www.google.com/maps/search/?api=1&query='+ encodeURI('Bjerregaards gate 60C, 0174 Oslo'),
      locality: 'Oslo',
      route: 'Bjerregaards gate',
      street_number: '60C',
      postal_code: '0174',
      country: 'Norway',
      lat:'59.9267819',
      lng: '10.748087599999963'
    };
  }

  //https://medium.com/@balramchavan/display-and-track-users-current-location-using-google-map-geolocation-in-angular-5-c259ec801d58
  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showCurrentPosition(position, 'http://maps.google.com/mapfiles/kml/pal3/icon28.png');
        this.map.setZoom(12);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  showCurrentPosition(position, icon?: string, title?: string) {
    if (icon == undefined) icon = 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png';
    if (title == undefined) title = 'No title';

    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);
    //this.map.setZoom(zoom)
    this.setCurrentMarker(location, icon, 'Current location')
  }
  setCurrentMarker(location, icon?: string, title?: string){
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
      this.curr_marker.setIcon(icon)  
    }
  }


  findLocation() {  
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    //TODO: do not run if no address
    this.geocoder.geocode({
      'address': this.address_string,
      'region': 'no', //region bias to Norway
      'componentRestrictions': {country: this.componentRestrictions} //country restriction to Norway
    }, (results, status) => {
      console.log('findLocation results[0]:',results[0]);
      if (status == google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);
        this.setTempMarker(results[0], undefined, 'Search result')
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })
  }
 
  setTempMarker(result, icon?: string, title?: string){
    //TODO: check if point already exists!
    var marker = new google.maps.Marker({
      position: result.geometry.location,
      map: this.map,
      title: title,
      icon: icon,
      //content: undefined
    })
    //Create markerinfo object
    /*var markerinfo = {
      //'markerind': this.markers.length,
      'markertype': 'some type',
      'formatted_address': result.formatted_address
    }*/
    //Add InfoWindow with listeners to marker
    //https://stackoverflow.com/questions/31494380/google-maps-change-content-of-infowindow    
    //Create the node shown in marker's InfoWindow
    var iwdiv = document.createElement('div');
    iwdiv.id='node';
    var h2 = document.createElement('h2');
    h2.textContent = marker.getTitle();
    var div = document.createElement('div');
    var input1 = document.createElement('input');
    input1.id = 'input1';
    input1.type = 'text';
    //input1.value = markerinfo.markertype;
    input1.value = 'some type';
    input1.style.width = '200px';
    var input2 = document.createElement('input');
    input2.id = 'input2';
    input2.type = 'submit';
    var anchor = document.createElement('a');
    anchor.href = '#';
    anchor.text='Remove';
    this.selectedMarkerIndex = this.markers.length;
    //Click listeners in elements of marker's InfoWindow
    input2.addEventListener('click',() => this.submitForm(this.selectedMarkerIndex));
    anchor.addEventListener('click',() => this.removeMarker(this.selectedMarkerIndex));
    //Build everything together in iwdiv element
    div.appendChild(input1);
    div.appendChild(input2);
    div.appendChild(document.createElement('br'));
    div.appendChild(anchor);
    iwdiv.appendChild(h2);
    //iwdiv.appendChild(document.createTextNode(markerinfo.formatted_address));
    iwdiv.appendChild(document.createTextNode(result.formatted_address));
    iwdiv.appendChild(document.createElement('br'));
    iwdiv.appendChild(div);
    //Click listener to marker to set and open InfoWindow
    //marker.content = iwdiv; //pass whole node to marker
    marker.addListener('click', () => {
      //this.infowindow.setContent(marker.content);
      this.infowindow.setContent(iwdiv);
      this.infowindow.open(this.map, marker);
      console.log('marker: ',marker)
      console.log('this.infowindow: ',this.infowindow)
      console.log('result: ',result)
      console.log('this: ',this)
      console.log('this.selectedMarkerIndex: ',this.selectedMarkerIndex)
      
      
      //Pass data to form component
      //this.formResult =  {address: markerinfo.formatted_address};
      this.formResult = {
        formatted_address: result.formatted_address,
        url: 'https://www.google.com/maps/search/?api=1&query='+ encodeURI(result.formatted_address),
        locality: '',
        route: '',
        street_number: '',
        postal_code: '',
        country: '',
        lat:result.geometry.location.lat(),
        lng:result.geometry.location.lng()        
      };
      for (var i = 0; i < result.address_components.length; i++) {
        if (result.address_components[i].types.includes("route")) {
          this.formResult.route = result.address_components[i].long_name
          this.formResult.address = this.formResult.route
        }
        if (result.address_components[i].types.includes("street_number")) {
          this.formResult.street_number = result.address_components[i].short_name
          this.formResult.address += ', ' + this.formResult.street_number;
        }
        if (result.address_components[i].types.includes("locality"))
          this.formResult.locality = result.address_components[i].long_name
        if (result.address_components[i].types.includes("administrative_area_level_1"))
          this.formResult.adm_area_level_1 = result.address_components[i].long_name
        if (result.address_components[i].types.includes("postal_code"))
          this.formResult.postal_code = result.address_components[i].short_name
        if (result.address_components[i].types.includes("country"))
          this.formResult.country = result.address_components[i].long_name
      };
      console.log('this.formResult: ', this.formResult)
    });    
    console.log('marker: ', marker)

    //Push marker to markers
    this.markers.push(marker);
    //Close InfoWindow
    this.hideInfoWindow();
    //TODO: probably I want one single temp marker
  }  
  hideInfoWindow() { //useful?
    this.infowindow.close();
  }
  submitForm(markerind) {
    //TODO Problem: edited string stays even when I do not submit
    console.log('submitForm: ',markerind);
    console.log('this: ',this);
    console.log('this.markers: ',this.markers);
    console.log('this.markers[markerind].content: ',this.markers[markerind].content);
  }
  removeMarker(markerind) {
    console.log('removeCoordinate: ',markerind);
    this.markers[markerind].setMap(null);
    console.log('this.markers: ',this.markers);
    console.log('this.markers[markerind]: ',this.markers[markerind]);
  }
  
  editMarkerInfo(markerind) {
    console.log('editMarkerInfo: ',markerind);
  }
  deleteMarker(markerind) {
    console.log('deleteMarker before: ',this.markers)
    this.markers.splice(markerind,1)
    console.log('deleteMarker after: ',this.markers)
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
