import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend Server URI
  // Set in /backend/server.js
  uri:string = environment.node_url;

  // The name of your MongoDB database collection.
  collection:string = "users";
    
  authToken: any;
  user: any;

  constructor(
    private http:Http,
    public jwtHelper:JwtHelperService
  ) { }

  // Reach out to backend API
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(`${this.uri}/${this.collection}/register`, user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  editUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(`${this.uri}/${this.collection}/update`, user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(`${this.uri}/${this.collection}/authenticate`, user, {headers: headers})
    .pipe(map(res => res.json()));
  }

  // Log that the logged-in user did a geolocation search
  logUserSearch(username:string){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(`${this.uri}/${this.collection}/logsearch`, {username: username}, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getSearchFrequency(username:string){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(`${this.uri}/${this.collection}/searchstats`, {username: username}, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    // Use the token here
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get(`${this.uri}/${this.collection}/profile`, {headers: headers})
      .pipe(map(res => res.json()));
  }

  // Save in LocalStorage
  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  //Get username from LocalStorage
  getLoggedUsername() {
    let userjson = JSON.parse(localStorage.getItem('user'));
    if (userjson == null) return ''
    return userjson['username']
  }

  // Fetch from LocalStorage
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  isTokenExp(){
    return this.jwtHelper.isTokenExpired();
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
