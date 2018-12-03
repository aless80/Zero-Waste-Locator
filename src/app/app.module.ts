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
import { MessageComponent } from './message/message.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent,
    SaveComponent,
    NavbarComponent,
    MessageComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StoreService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
