import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { StoreService } from './services/store.service';
//import { SaveComponent } from './save/save.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
import { TabsetComponent } from './tabset/tabset.component';
import { GeocoderComponent } from './geocoder/geocoder.component';
import { RatingComponent } from './rating/rating.component';
import { SearchtypesComponent } from './searchtypes/searchtypes.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http'; //this is old but whatever..
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { CardComponent } from './card/card.component';
import { SinglecontrolComponent } from './singlecontrol/singlecontrol.component';

const appRoutes: Routes = [
  {path: '', component: MapComponent},
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  //{path: 'map', component: MapComponent, canActivate:[AuthGuard]},
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
    //SaveComponent,
    NavbarComponent,
    AlertComponent,
    GeocoderComponent,
    SearchtypesComponent,
    RatingComponent,
    TabsetComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AboutComponent,
    CardComponent,
    SinglecontrolComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
