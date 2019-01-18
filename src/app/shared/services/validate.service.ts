import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user: any){
    if(user.name == undefined || user.email == undefined || user.username == undefined)
      return false;
    else
      return true;
  }

  validatePassword(password: string){
    if(password == undefined || password == '')
      return false;
    else 
      return true;
  }
  validateEmail(email: string){
    // From https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Return true if email, or false if not email
    return re.test(String(email).toLowerCase());
  }

}
