import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from "../../../shared/services/alert.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router:Router,
    private alertService: AlertService,) {}
    public username:string = this.authService.getLoggedUsername();
    
  ngOnInit() { }

  onLogoutClick(){
    this.authService.logout();
    this.alertService.info("You are now logged out", 2500);
    this.router.navigate(['/']);
    return false;
  }
}
