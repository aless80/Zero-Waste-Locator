import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // Backend Server URI
  // Set in /backend/server.js
  uri = 'http://localhost:4000';

  // The name of your MongoDB database collection.
  collection = 'stores';

  constructor(private http: HttpClient) { }


   // Fetches all documents.
  geocodeCallback() {
    var url = `${this.uri}/${this.collection}/geocallback`
    console.log('service geocodeCallback: ',url)
    var out = this.http.get(url);
    return out
  }

  geocodePromise() {
    var url = `${this.uri}/${this.collection}/geopromise`
    console.log('service geocodePromise: ',url)
    var out = this.http.get(url);
    console.log('service out: ',out) //promise
    return out
  }
  
  


  // Fetches all documents.
  getStores() {
    var stores = this.http.get(`${this.uri}/${this.collection}`);
    return stores
  }

  // Fetches a single document by _id.
  getStoreById(id) {
    return this.http.get(`${this.uri}/${this.collection}/${id}`);
  }

  // Creates a new document.
  addStore(store) {
    const newstore = {
      lat: store.lat,
      lng: store.lng,
      location: store.location,  // [Long; Lat]
      address: store.address,
      street_num: store.street_num,
      zip: store.zip,
      country: store.country,
      descr: store.descr,
      type: store.type,
      username: store.username
    };
    return this.http.post(`${this.uri}/${this.collection}/add`, newstore);
  }

  // Updates an existing document.
  updateStore(id, store) {
    const newstore = {
      lat: store.lat,
      lng: store.lng,
      location: store.location,  // [Long; Lat]
      address: store.address,
      street_num: store.street_num,
      zip: store.zip,
      country: store.country,
      descr: store.descr,
      type: store.type,
      username: store.username
    };
    return this.http.post(`${this.uri}/${this.collection}/update/${id}`, newstore);
  }

  // Deletes an existing document.
  deleteStore(id) {
    return this.http.get(`${this.uri}/${this.collection}/delete/${id}`);
  }

  // Get the distinct values of a field
  getDistinctValues(field) {
    return this.http.get(`${this.uri}/${this.collection}distinct/${field}`);
    
  }

  //Utility method to convert result to store type
  result2Store(result){
    const store: Store = {
      coords: [
        Number(result.geometry.location.lat()), 
        Number(result.geometry.location.lng())],
      address: '',
      street_num: '',
      locality: '',
      zip: '',
      country: '',
      descr: '',
      type: '',
      username: ''
    };
    for (var i = 0; i < result.address_components.length; i++) {
      if (result.address_components[i].types.includes("route")) {
        store.address = result.address_components[i].long_name
      }
      if (result.address_components[i].types.includes("street_number")) {
        store.street_num = result.address_components[i].short_name
        store.address += ', ' + store.street_num;
      }
      if (result.address_components[i].types.includes("locality"))
        store.locality = result.address_components[i].long_name
      if (result.address_components[i].types.includes("administrative_area_level_1"))
        store.locality = result.address_components[i].long_name
      if (result.address_components[i].types.includes("postal_code"))
        store.zip = result.address_components[i].short_name
      if (result.address_components[i].types.includes("country"))
        store.country = result.address_components[i].long_name
    };
    return store;
  }
}
