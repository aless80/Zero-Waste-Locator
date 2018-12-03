# GmapsNg7

## What this App is about

I try to live a [Zero Waste](https://www.goingzerowaste.com/zero-waste-1/) lifestyle. In brief, Zero Waste for me is about reducing consumption, in particular plastic products. 
I moved to Oslo in Norway, I realized it takes time to learn where plastic-free products are sold. 

For this reason I am implementing this app where users can search and log stores selling Zero Waste or Less Waste products. This app uses Google Maps to search for stores, and will allow you to save them together with their products so that you or other users can look them up. 

### Progress report

This is a MEAN app () and it is still under development. The frontend using Google Maps API is not complete but it works. When you click on a marker two components appear with information on the store and some dummy products. I am setting up the NodeJS backened, MongoDB database, service layer, so that The idea is to store results searched in the embedded Google Maps to the MongoDB database.  

This project usesthe Google Maps API in Angular CLI 7.0.6, NodeJS 8.10.0, Angular: 7.0.4. I am developing in Linux using MongoDB v3.4.17. 

NB: This app does not use agm-core for Google Maps as described in many tutorials. I initially took that approach but I could not find enough documentation to extend it and implement functionalities such as InfoWindow or callbacks from markers.

## Installation

Install node, npm, mongoDB, Angular CLI, and see the standard [generated README](#Generated-README) below. Install the node and Angular dependencies with:

```npm install
ng build```

Get a Google Maps API key [here](https://developers.google.com/maps/documentation/javascript/get-api-key) to use Google's geolocation service. Place the API key in the ./src/index_INSERTKEY.html file, then rename that file to index.html. This allows you to use it for geocoding from the front end (see [src/app/map/map.component.ts](src/app/map/map.component.ts)). 

Set up a Google Maps API key for using it on a server. This can be used for geocoding from the server backend through [npm-geocoder](https://www.npmjs.com/package/node-geocoder). See the [backend/server.js](backend/server.js) file. 

I will soon clean up things and give both options to the user. 

<!--
npm i --save-dev babel-cli babel-preset-env
npm i cors --save
npm i mongoose --save
npm i express --save
-->


## Launching the app

Launch the MongoDB database:

```mongod --dbpath <path to data directory>```

Launch NodeJS for the backend:

```npm run dev```

Launch Angular for the frontend:

```ng serve```

Open your browser at http://localhost:4200/

## Some references

Here are some references I am using to develop MEAN applications: 
[Building a MEAN Application](https://navakos.slab.com/public/building-a-mean-application-c9369d11?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more#step-nine-adding-the-gitignore)

[MEAN App tutorial with Angular 4](https://medium.com/netscape/mean-app-tutorial-with-angular-4-part-1-18691663ea96)

[Google Maps API](https://developers.google.com/maps/documentation)

[Integrating Google Maps in Angular 6](https://medium.com/@balramchavan/integrating-google-maps-in-angular-5-ca5f68009f29)

[Display and Track User's current location using Google Map Geolocation in Angular 5](https://medium.com/@balramchavan/display-and-track-users-current-location-using-google-map-geolocation-in-angular-5-c259ec801d58)

[Post on stackoverflow about Google Maps' infowindow](https://stackoverflow.com/a/31496676/3592827)

[Create a MEAN Stack Google Map App](https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i)

## Generated README

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).