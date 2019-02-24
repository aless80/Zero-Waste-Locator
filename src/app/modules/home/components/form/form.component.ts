import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Store } from "../../../../shared/models/store.model";
import { OnChanges, SimpleChanges } from "@angular/core";
import { ToMapService } from '../../../../shared/services/to-map.service'
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"]
})
export class FormComponent implements OnChanges {
  @Input() formResult: Store;
  @Input() storetypes: string[];
  @Input() storeId: string;
  @Output() submit = new EventEmitter<boolean>();
  user_rating: number;
  
  //Variables to handle the new store type (selecting it, editing it..)
  public static readonly NEWTYPE_PLACEHOLDER = "New store type";
  newType: string = FormComponent.NEWTYPE_PLACEHOLDER;
  checked_newType: boolean = false;
  show_newtype_editor: boolean = false;
  hide_edit: boolean = true;

  subscription: Subscription;
    
  constructor(
    private toMapService: ToMapService,
    private authService: AuthService) {
    this.subscription = toMapService.formSubmit$.subscribe(
      obj => console.log(obj)
    );
  }
  
  ngOnChanges(changes: SimpleChanges) {
    //console.log("form - ngOnChanges", changes);
    //Uncheck new type cause there is a new form
    this.checked_newType = false;
    this.user_rating = undefined;
    this.user_rating = undefined;
  }

  /// Handling the store types checkboxes
  // Check if store is of a certain store type
  hasType(type: string){
    return this.formResult.types.includes(type)
  } 
  // Check/uncheck new type
  toggleType(event: any){
    if (event.target.checked)
      this.formResult.types.push(event.target.name)
    else {
      this.removeFromTypesArray(event.target.name)
    }
    //Sort types array alphabetically
    this.formResult.types.sort()
  }
  removeFromTypesArray(type: string) {
    let ind = this.formResult.types.indexOf(type);
      if (ind>=0)
        this.formResult.types.splice(ind,1);
  }
  
  /// Handling the new store type checkbox
  // User clicks on text of new type
  clickNewtypeText(event: any){
    //If the user clicks on the default placeholder for the new type, edit it
    if (this.authService.isTokenExp()) return
    if (this.newType==FormComponent.NEWTYPE_PLACEHOLDER)
      this.editNewStoreTypeInput(event);
    if (event.target == 'input')
      this.checked_newType = event.target.checked;
  }
  // Edit the new type
  editNewStoreTypeInput(event: KeyboardEvent) {
    //Remove previously inserted type
    this.removeFromTypesArray(this.newType);
    //Show the text input with the previous new type or empty if none
    this.show_newtype_editor = !this.show_newtype_editor;
    this.newType = '';
    //Hide the "Edit" text
    this.hide_edit = true;
  }
  // User clicks on "Add" or press enter to confirm the new type
  confirmNewType(value: string, event:KeyboardEvent) {
    //Behavior depends on whether there is any text in the input box
    if (value) {
      //Hide new type editor
      this.show_newtype_editor = false;
      //Store the new type
      this.newType = value;
      this.formResult.types.push(this.newType);
      //Show the "Edit" text, checkmark is on
      this.hide_edit = false;
      //Checking the checkbox is prob not necessary, maybe needed when checkbox off while editing
      this.checked_newType = true;
      //Good stuff I was playing with:
      //(<HTMLInputElement>event.target)   this is the <input> element
      //event.preventDefault()
      //event.stopPropagation();
    } else {  
      //Reset to default placeholder
      this.show_newtype_editor = false;
      this.newType=FormComponent.NEWTYPE_PLACEHOLDER;
      this.hide_edit = true;
      //Unchecking the checkbox is prob not necessary but does not hurt
      this.checked_newType = false;
    }
  }

  // Callback for links to google maps
  goToGoogleMaps(event: KeyboardEvent) {
    //console.log('goToGoogleMaps', event.type, event);
    if (event.type != "click") return;
    var url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURI(this.formResult.address) +
      encodeURI(
        "," +
          [
            this.formResult.street_num,
            this.formResult.zip,
            this.formResult.locality,
            this.formResult.country
          ].join(" ")
      );
    var win = window.open(url, "_blank");
    win.focus();
  }
  
  submitForm() {
    //Uncheck the new type cause it is going to be saved
    this.checked_newType = false
    //Update formResult.rating with user_rating
    if (this.user_rating !== undefined) {
      if(typeof this.formResult.rating.count == 'undefined') {
        this.formResult.rating.count = 0;
        this.formResult.rating.total = 0;
      }
      this.formResult.rating.total += this.user_rating;
      this.formResult.rating.count += 1;
    }    
    //Let Map parent save the form to DB
    this.toMapService.sendFormSubmit(null)
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  countries = [
    "USA",
    "Canada",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "American Samoa",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bangladesh",
    "Barbados",
    "Burundi",
    "Belgium",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bosnia and Herzegovina",
    "Belize",
    "Belarus",
    "Bolivia",
    "Botswana",
    "Brazil",
    "Bahrain",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Central African Republic",
    "Cambodia",
    "Canada",
    "Cayman Islands",
    "Congo",
    "Chad",
    "Chile",
    "China",
    "Cote d'Ivoire",
    "Cameroon",
    "DR Congo",
    "Cook Islands",
    "Colombia",
    "Comoros",
    "Cape Verde",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "Eritrea",
    "El Salvador",
    "Spain",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Micronesia",
    "Gabon",
    "Gambia",
    "Great Britain",
    "Guinea-Bissau",
    "Georgia",
    "Equatorial Guinea",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guam",
    "Guyana",
    "Haiti",
    "Hong Kong",
    "Honduras",
    "Hungary",
    "Indonesia",
    "India",
    "Iran",
    "Ireland",
    "Iraq",
    "Iceland",
    "Israel",
    "Virgin Islands",
    "Italy",
    "British Virgin Islands",
    "Jamaica",
    "Jordan",
    "Japan",
    "Kazakhstan",
    "Kenya",
    "Kyrgyzstan",
    "Kiribati",
    "South Korea",
    "Saudi Arabia",
    "Kuwait",
    "Laos",
    "Latvia",
    "Libya",
    "Liberia",
    "Saint Lucia",
    "Lesotho",
    "Lebanon",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Morocco",
    "Malaysia",
    "Malawi",
    "Moldova",
    "Maldives",
    "Mexico",
    "Mongolia",
    "Marshall Islands",
    "Macedonia",
    "Mali",
    "Malta",
    "Montenegro",
    "Monaco",
    "Mozambique",
    "Mauritius",
    "Mauritania",
    "Myanmar",
    "Namibia",
    "Nicaragua",
    "Netherlands",
    "Nepal",
    "Nigeria",
    "Niger",
    "Norway",
    "Nauru",
    "New Zealand",
    "Oman",
    "Pakistan",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Palestine",
    "Palau",
    "Papua New Guinea",
    "Poland",
    "Portugal",
    "North Korea",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "South Africa",
    "Russia",
    "Rwanda",
    "Samoa",
    "Senegal",
    "Seychelles",
    "Singapore",
    "Saint Kitts and Nevis",
    "Sierra Leone",
    "Slovenia",
    "San Marino",
    "Solomon Islands",
    "Somalia",
    "Serbia",
    "Sri Lanka",
    "Sao Tome and Principe",
    "Sudan",
    "Switzerland",
    "Suriname",
    "Slovakia",
    "Sweden",
    "Swaziland",
    "Syria",
    "Tanzania",
    "Tonga",
    "Thailand",
    "Tajikistan",
    "Turkmenistan",
    "Timor-Leste",
    "Togo",
    "Chinese Taipei",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Tuvalu",
    "United Arab Emirates",
    "Uganda",
    "Uk",
    "Ukraine",
    "Uruguay",
    "United States",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Saint Vincent and the Grenadines",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];
}
