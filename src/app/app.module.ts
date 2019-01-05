import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { StoreService } from './services/store.service';
import { SaveComponent } from './save/save.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
import { GeocoderComponent } from './geocoder/geocoder.component';
//import { TabsComponent } from './tabs/tabs.component';
//import { TabComponent } from './tabs/tab.component';
import { SearchtypesComponent } from './searchtypes/searchtypes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingComponent } from './rating/rating.component';
import { TabsetComponent } from './tabset/tabset.component';


import { HttpModule } from '@angular/http'; //this is old but whatever..
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  {path: '', component: MapComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  //{path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]}
]

// id_token is from storeUserData(token, user) in auth.service.ts
export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent,
    SaveComponent,
    NavbarComponent,
    AlertComponent,
    GeocoderComponent,
    //TabsComponent,
    //TabComponent,
    SearchtypesComponent,
    RatingComponent,
    TabsetComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,

    RouterModule.forRoot(appRoutes),
    HttpModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })

  ],
  providers: [
    StoreService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
