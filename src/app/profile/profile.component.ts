import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from "../services/alert.service";
import { ValidateService} from '../services/validate.service';
import { Subscription } from 'rxjs'; //to unsubscribe

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  user: any = {
    "name": "",
    "email": "",
    "username": "",
    "password": ""
  };
  showChangePwd = false;
  showNewPwds = false;
  oldpassword: string;
  newpassword: string;
  newpassword2: string;
  subscription: Subscription;

  constructor(
    private authService:AuthService,
    private router:Router,
    private alertService: AlertService,
    private validateService:ValidateService
  ) { }

  // Need to load the user when initilize
  ngOnInit() {
    this.subscription = this.authService.getProfile().subscribe(
      profile => {
        this.user = profile.user;
        //Remove the password cause I do not need it (and otherwise trouble in server when update profile)
        this.user.password = '';
      },
      err => {
        console.error('Error in retrieving the profile: ',err);
        return false;
      });
  }
  
  //Unsubscribe
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
      
  onUpdateSubmit(onSuccessfulPwdChange?:Function){
    // Required Fields
    if(!this.validateService.validateRegister(this.user)){
      this.alertService.warn('Please fill in all fields', 2500);
      return false;
    }
    // Validate Email
    if(!this.validateService.validateEmail(this.user.email)){
      this.alertService.warn('Please use a valid email', 2500);
      return false;
    }
    // Update User
    this.subscription = this.authService.editUser(this.user)
      .subscribe(data => {
        if(data.success){
          if (onSuccessfulPwdChange != undefined) {
            onSuccessfulPwdChange()
          } else {
            this.alertService.success('You have successfully updated your profile', 2500);          }
        } else {
          this.alertService.error('Something went wrong', 2500);
        }
      });
  }

  //This is similar to onUpdateSubmit in register component
  authenticate() {
    const user = {
      username: this.user.username,
      password: this.oldpassword
    }
    //Test authentication
    this.subscription = this.authService.authenticateUser(user)
      .subscribe(data => {
        if(data.success){
          this.showNewPwds = true;
        } else {
          this.alertService.error(data.msg, 2500);
        }
      });
  }

  //Check if new passwords match
  onChangePassword() {
    if (this.newpassword !== this.newpassword2) {
      this.alertService.error('Passwords do not match', 2500);
    } else {
      //Pass the password 
      this.user.password = this.newpassword;
      var callback = () => {
        this.alertService.success('You have successfully changed your password', 2500);
        this.authService.logout()
        setTimeout(() => this.router.navigate(['/login']), 1500);
      }
      var success = this.onUpdateSubmit(callback);
      }
    } 
}