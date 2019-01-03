import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { AuthService} from '../services/auth.service';
//import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService:ValidateService, 
    //private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    // console.log(123);
    // console.log(this.name);
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      // console.log('Please fill in all fields');
      //this.flashMessages.show('Please fill in all fields');
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      // console.log('Please use a valid email');
      //this.flashMessages.show('Please use a valid email');
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data => {
      // console.log(data);
      if(data.success){
        //this.flashMessages.show('You are now registered and can log in');
        this.router.navigate(['/login']);
      } else {

        //this.flashMessages.show('Something went wrong');
        this.router.navigate(['/register']);
      }
    });



  }



}
