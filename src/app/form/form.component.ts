import { Component, OnInit, Input } from "@angular/core";
import { EventEmitter, Output } from "@angular/core";
import { OnChanges, SimpleChanges, SimpleChange } from "@angular/core";
import { Store } from "../models/store.model";
import { StoreService } from "../services/store.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"]
})
export class FormComponent implements OnInit, OnChanges {
  @Input("formResult") formResult: Store;
  @Output() submit = new EventEmitter<boolean>();
  storetypes: Store[];

  //Variables to handle the new store type (selecting it, editing it..)
  public static readonly NEWTYPE_PLACEHOLDER = "New store type";
  newType: string = FormComponent.NEWTYPE_PLACEHOLDER;
  checked_newType: boolean = false;
  show_newtype_editor: boolean = false;
  hide_edit: boolean = true;    

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.storeService.getDistinctTypes().subscribe(
      (data: Store[]) => {
        this.storetypes = data;
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("form - ngOnChanges", changes);
  }

  
  ///Handling the store types checkboxes
  //Check if store is of a certain store type
  hasType(type){
    //console.log('checked:',type)
    return this.formResult.types.includes(type)
  } 
  //Check/uncheck new type
  toggleType(event){
    //console.log('addToTypeArray', this.formResult.types, event.target.name, event.target.checked)
    if (event.target.checked)
      this.formResult.types.push(event.target.name)
    else {
      this.removeFromTypesArray(event.target.name)
    }
    //Sort types array alphabetically
    this.formResult.types.sort()
    console.log('addToTypeArray', this.formResult.types)
  }
  removeFromTypesArray(elem) {
    let ind = this.formResult.types.indexOf(elem);
      if (ind>=0)
        this.formResult.types.splice(ind,1);
      else 
        console.warn("Could not remove ", elem, " from formResult.types array")
  }
  
  ///Handling the new store type checkbox
  //User clicks on text of new type
  clickNewtypeText(event){
    //If the user clicks on the default placeholder for the new type, edit it
    if (this.newType==FormComponent.NEWTYPE_PLACEHOLDER)
      this.editNewStoreTypeInput(event);
  }
  //Edit the new type
  editNewStoreTypeInput(event:KeyboardEvent) {
    //Show the text input with the previous new type or empty if none
    this.show_newtype_editor = !this.show_newtype_editor;
    this.newType = '';
    //Remove previously inserted type
    this.removeFromTypesArray(this.newType);
    //Hide the "Edit" text
    this.hide_edit = true;
  }
  //User clicks on "Add" or press enter to confirm the new type
  confirmNewType(value: string, event:KeyboardEvent) {
    //console.log("confirmNewType", event.type,  "value=-", value,'-',  event);
    //Behavior depends on whether there is any text in the input box
    if (value) {
      //Hide new type editor
      this.show_newtype_editor = false;
      //Store the new type
      this.newType = value;
      this.formResult.types.push(this.newType);
      //Show the "Edit" text, checkmark is on
      this.hide_edit = false;
      this.checked_newType = true; //Sometimes needed (when checkbox off while editing)
      //Good stuff I was playing with:
      //(<HTMLInputElement>event.target)   this is the <input> element
      //event.stopPropagation();
    } else {  
      //Reset to default placeholder
      this.show_newtype_editor = false;
      this.newType=FormComponent.NEWTYPE_PLACEHOLDER;
      this.hide_edit = true;
      //Uncheck checkbox. Small bug: not working when editing the default new field
      this.checked_newType = false;
    }
  }


  goToGoogleMaps(event: KeyboardEvent) {
    console.log('goToGoogleMaps', event.type, event);
    if (event.type != "click") return;
    console.log("goToGoogleMaps");
    console.log(event);
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
  getDistinctTypes() {
    return this.storeService.getDistinctTypes();
  }
  //Use clicks Save to save the store in database
  saveForm() {
    //Let Map parent save the form to DB
    this.submit.emit(null)
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
