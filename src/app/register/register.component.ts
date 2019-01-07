import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { AuthService} from '../services/auth.service';
import { AlertService } from "../services/alert.service";
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
    private authService:AuthService,
    private router:Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {}

  onRegisterSubmit(){
    console.log('onRegisterSubmit');
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.alertService.warn('Please fill in all fields', 2500);
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.alertService.warn('Please use a valid email', 2500);
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.alertService.success('You are now registered and can log in', 2500);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      } else {
        this.alertService.error('Something went wrong', 2500);
        this.router.navigate(['/register']);
      }
    });
  }
}
