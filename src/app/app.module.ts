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
    TabsetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    StoreService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
