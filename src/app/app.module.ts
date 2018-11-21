import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { StoreService } from './services/store.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [StoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
