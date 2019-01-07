import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from "../services/alert.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router:Router,
    private alertService: AlertService,) {}

  ngOnInit() {}

  onLogoutClick(){
    this.authService.logout();
    this.alertService.info("You are now logged out", 2500);
    this.router.navigate(['/']);
    return false;
  }
}
