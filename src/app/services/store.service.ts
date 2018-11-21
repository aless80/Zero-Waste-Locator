import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  getStores() {
    return this.http.get(`${this.uri}/${this.collection}`);
  }

  // Fetches a single document by _id.
  getStoreById(id) {
    return this.http.get(`${this.uri}/${this.collection}/${id}`);
  }

  // Creates a new document.
  addStore(title, resposible, description, severity) {
    const issue = {
      title: title,
      responsible: resposible,
      description: description,
      severity: severity
    };
    return this.http.post(`${this.uri}/${this.collection}/add`, issue);
  }

  // Updates an existing document.
  updateStore(id, title, resposible, description, severity, status) {
    const issue = {
      title: title,
      responsible: resposible,
      description: description,
      severity: severity,
      status: status
    };
    return this.http.post(`${this.uri}/${this.collection}/update/${id}`, issue);
  }

  // Deletes an existing document.
  deleteStore(id) {
    return this.http.get(`${this.uri}/${this.collection}/delete/${id}`);
  }
}
