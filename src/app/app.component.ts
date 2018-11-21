//Credits
//https://medium.com/@balramchavan/integrating-google-maps-in-angular-5-ca5f68009f29
//https://github.com/ultrasonicsoft/googlemaps-angular6/tree/master/src
//npm install --save-dev @types/googlemap
//api key in index.html
import { Component } from '@angular/core';
///import { } from '@types/googlemaps'  //ng version < 6
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
