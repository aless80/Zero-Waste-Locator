import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MapComponent } from './modules/map/map.component';
import { FormComponent } from './modules/form/form.component';
import { StoreService } from './shared/services/store.service';
import { RateService } from './shared/services/rate.service';
//import { SaveComponent } from './modules/map/components/save/save.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AlertService } from './shared/services/alert.service';
import { TabsetComponent } from './shared/components/tabset/tabset.component';
import { GeocoderComponent } from './modules/map/components/geocoder/geocoder.component';
import { RatingComponent } from './modules/form/components/rating/rating.component';
import { SearchtypesComponent } from './modules/map/components/searchtypes/searchtypes.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http'; //this is old but whatever..
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { AboutComponent } from './modules/about/pages/about.component';
import { CardComponent } from './modules/about/components/card/card.component'

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
    RateService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
