# Zero Waste Locator

## What this App is about

I try to live a [Zero Waste](https://www.goingzerowaste.com/zero-waste-1/) lifestyle. In brief, Zero Waste for me is about reducing consumption, in particular plastic products. 
I moved to Oslo in Norway, I realized it takes time to learn where plastic-free products are sold. 

For this reason I am implementing this app where users can search and log stores selling Zero Waste or Less Waste products. This app uses Google Maps to search for stores, and will allow you to save them together with their products so that you or other users can look them up. 

### Technical description

This is a [MEAN](https://www.mongodb.com/) app (
[MongoDB]](href=https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular CLI 7.0.6](https://angular.io/ ), [Node.js](https://nodejs.org)) using the [Google Maps API](https://cloud.google.com/maps-platform/) to show store locations on an embedded Google map. 

On the back-end a server is based on Node.js/Express server. The [Mongoose ODM](https://mongoosejs.com/) is used to connect Node.js and the MongoDB database. It provides a schema based solution to organize models and running CRUD operations. [JSON web tokens](https://jwt.io/) [JWT] handle user authentication and identity management. The front-end is built with Angular-CLI 7, [Bootstrap](https://getbootstrap.com/), and [Angular Bootstrap](https://ng-bootstrap.github.io). Of course, the app uses RxJS for asynchronous or callback-based code.  

Through the frontend users can search an address using Google Maps' geolocation. The results are displayed as markers on the Google map.  
I implemented a "caching" system that checks whether the searched address is already present in the MongoDB database [DB]. This allows the app to call Google Maps less often, and to load a store/location already present in the DB.  

The user has a personal quota for the number of geolocation searches they can run. The quota can be set in three environment variables (see below) as an integer for the maximum number of queries per hour, day, and total maximum. This was done to limit my bill with the Google Maps API. 

A form appears when you click on a marker. This form contains user editable information on the store such as the store type, store description, etc. This form allows the user to save or update the store/location to the DB. 

To use the Google Map functionality a user is required to register and login. JWT is used to transmit sensitive information (e.g. passwords, access tokens) between front-end and back-end. A password reset functionality is implemented in the back-end using [express-nodemailer](https://nodemailer.com/about/), [handlebars](https://www.npmjs.com/package/nodemailer-express-handlebars) for express and express-nodemailer, and AJAX requests.

NB: This app does not use agm-core for Google Maps as described in many tutorials. IMO documentation is insufficient to extend the agm-core component and implement functionalities such as InfoWindow or callbacks from markers.

## Installation

#### node, npm, mongoDB, Angular
Install node, npm, mongoDB, Angular CLI, and see the standard [generated README](#Generated-README) below. Install the node and Angular dependencies with:

```
npm install
ng build
```

For deploying the front end check the [Build](#Build) section below and the Angular [deployment documentation](https://angular.io/guide/deployment)

#### dotenv
Create a .env file with environment variables for the Node.js back-end. Use a template in .env_example. 

```
cp .env_example .env
vi .env
```

#### environment*.ts
Similarly to dotenv, set up environment variables for the Angular frontend in the ./environment.ts and ./environment.prod.ts files, which are used for development and production, respectively. 

#### Google Maps
Get a Google Maps API key [here](https://developers.google.com/maps/documentation/javascript/get-api-key) to use Google's geolocation service. Place the API key in the ./src/index_INSERTKEY.html file, then rename that file to index.html. This allows you to use it for geocoding from the front end (see [src/app/modules/map/map.component.ts](src/app/modules/map/map.component.ts)). 

The code still includes my implementation of geocoding from the server back-end. This implementation uses [npm-geocoder](https://www.npmjs.com/package/node-geocoder) but I commented it out in the code. To use it set up a Google Maps API key for using it on a server and see the [backend/server.js](backend/server.js) file. 

## Launching the app

Launch the MongoDB database:

```mongod --dbpath <path to data directory>```

Launch the Node.js back-end in the ./backend directory. As an example, use one of these three commands below:

```
cd backend
npm start       //using npm
node start.js   //using node
nodemon         //using nodemon
```

Launch Angular for the frontend:

```ng serve```

Open your browser at [http://localhost:4200/](http://localhost:4200/). The backend API is by default at [http://localhost:4000/](http://localhost:4000/), and you can for instance check the /users or /stores endpoints.

## How it looks like

![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/gmaps-ng7.gif)
<!--![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/02 - map search.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/03 - map saved.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/04 - profile.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/05 - form.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/06 - form.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/07 - about.png)
![Alt Text](https://github.com/aless80/Zero-Waste-Locator/blob/master/img/08 - register.png)
-->
## Some references

Here are some references I am using to develop MEAN applications:  

[Building a MEAN Application](https://navakos.slab.com/public/building-a-mean-application-c9369d11?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more#step-nine-adding-the-gitignore)

[MEAN App tutorial with Angular 4](https://medium.com/netscape/mean-app-tutorial-with-angular-4-part-1-18691663ea96)

[Google Maps API](https://developers.google.com/maps/documentation)

[Integrating Google Maps in Angular 6](https://medium.com/@balramchavan/integrating-google-maps-in-angular-5-ca5f68009f29)

[Display and Track User's current location using Google Map Geolocation in Angular 5](https://medium.com/@balramchavan/display-and-track-users-current-location-using-google-map-geolocation-in-angular-5-c259ec801d58)

[Post on stackoverflow about Google Maps' infowindow](https://stackoverflow.com/a/31496676/3592827)

[Create a MEAN Stack Google Map App](https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i)

[How To Implement Password Reset In Node.js](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/)

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