import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RateService {
  // Backend Server URI
  // Set in /backend/server.js
  uri:string = environment.node_url;

  // The name of your MongoDB database collection.
  collection:string = "users";

  constructor(private http: HttpClient) {}

  // Reach out to backend API. Store or update user's rating of a store
  storeRate(username, ratedStoreId, rating) {
    return this.http.post(`${this.uri}/${this.collection}/rating`, {username: username, ratedStoreId: ratedStoreId, rating: rating})
  }
}