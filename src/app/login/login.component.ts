import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from "../services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService:AuthService,
    private router:Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {}

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }
    this.authService.authenticateUser(user)
      .subscribe(data => {
        if(data.success){
          this.authService.storeUserData(data.token, data.user);
          this.alertService.success('You are now logged in', 2500);
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.alertService.error(data.msg, 2500);
          this.router.navigate(['/login']);
        }
      });
  }
}

