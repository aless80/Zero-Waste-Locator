import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router:Router) {}

  ngOnInit() {}

  onLogoutClick(){
    this.authService.logout();

    //this.flashMessages.show('You are now logged out')

    this.router.navigate(['/login']);
    return false;
  }
}
