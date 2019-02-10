import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../shared/services/validate.service';
import { AuthService} from '../../shared/services/auth.service';
import { AlertService } from "../../shared/services/alert.service";
import { Router } from '@angular/router';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs'; //to unsubscribe

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private validateService:ValidateService, 
    private authService:AuthService,
    private router:Router,
    private alertService: AlertService
  ) {
    this.form = formBuilder.group({
      username: 'user',
      name: 'user',
      email: 'defaul@email.com',
      password: '',
    });
  }

  //Unsubscribe
  ngOnDestroy() {
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }
  
  ngOnInit() {}

  onRegisterSubmit(){
    const user = Object.assign({}, this.form.value);
    // Required Fields (password checked later)
    if(!this.validateService.validateRegister(user)){
      this.alertService.warn('Please fill in all fields', 2500);
      return false;
    }

    // Required Password
    if(!this.validateService.validatePassword(user.password)){
      this.alertService.warn('Please fill in all fields', 2500);
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.alertService.warn('Please use a valid email', 2500);
      return false;
    }

    // Register User
    this.subscription = this.authService.registerUser(user)
      .subscribe(data => {
        if(data['success']){
          this.alertService.success('You are now registered and can log in', 2500);
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.alertService.error(data['msg'], 2500);
          this.router.navigate(['/register']);
        }
      });
  }
}
