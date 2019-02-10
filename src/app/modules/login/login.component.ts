import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from "../../shared/services/alert.service";
import { FormGroup,FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs'; //to unsubscribe
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  private subscription: Subscription;
  public node_url:string = environment.node_protocol+'://'+environment.node_host+':'+environment.node_port+'/users/forgot_password';

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private router:Router,
    private alertService: AlertService,
  ) {
    this.form = formBuilder.group({
      username: '',
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

  onLoginSubmit() {
    const user = Object.assign({}, this.form.value);
    this.subscription = this.authService.authenticateUser(user)
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

