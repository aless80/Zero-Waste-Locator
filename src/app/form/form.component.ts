import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input('formResult') formResult: any;
  @Input('formHidden') hidden: boolean;

  constructor() { }

  ngOnInit() { }

  goToGoogleMaps(){
    var win = window.open(this.formResult.url, '_blank');
    win.focus();
  }


countries = ["Norway", "USA", "Canada", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "American Samoa", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bangladesh", "Barbados", "Burundi", "Belgium", "Benin", "Bermuda", "Bhutan", "Bosnia and Herzegovina", "Belize", "Belarus", "Bolivia", "Botswana", "Brazil", "Bahrain", "Brunei", "Bulgaria", "Burkina Faso", "Central African Republic", "Cambodia", "Canada", "Cayman Islands", "Congo", "Chad", "Chile", "China", "Cote d'Ivoire", "Cameroon", "DR Congo", "Cook Islands", "Colombia", "Comoros", "Cape Verde", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "Eritrea", "El Salvador", "Spain", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Micronesia", "Gabon", "Gambia", "Great Britain", "Guinea-Bissau", "Georgia", "Equatorial Guinea", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guam", "Guyana", "Haiti", "Hong Kong", "Honduras", "Hungary", "Indonesia", "India", "Iran", "Ireland", "Iraq", "Iceland", "Israel", "Virgin Islands", "Italy", "British Virgin Islands", "Jamaica", "Jordan", "Japan", "Kazakhstan", "Kenya", "Kyrgyzstan", "Kiribati", "South Korea", "Saudi Arabia", "Kuwait", "Laos", "Latvia", "Libya", "Liberia", "Saint Lucia", "Lesotho", "Lebanon", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Morocco", "Malaysia", "Malawi", "Moldova", "Maldives", "Mexico", "Mongolia", "Marshall Islands", "Macedonia", "Mali", "Malta", "Montenegro", "Monaco", "Mozambique", "Mauritius", "Mauritania", "Myanmar", "Namibia", "Nicaragua", "Netherlands", "Nepal", "Nigeria", "Niger", "Norway", "Nauru", "New Zealand", "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Palestine", "Palau", "Papua New Guinea", "Poland", "Portugal", "North Korea", "Puerto Rico", "Qatar", "Romania", "South Africa", "Russia", "Rwanda", "Samoa", "Senegal", "Seychelles", "Singapore", "Saint Kitts and Nevis", "Sierra Leone", "Slovenia", "San Marino","Solomon Islands", "Somalia", "Serbia", "Sri Lanka", "Sao Tome and Principe", "Sudan", "Switzerland", "Suriname", "Slovakia", "Sweden", "Swaziland", "Syria", "Tanzania", "Tonga", "Thailand", "Tajikistan", "Turkmenistan", "Timor-Leste", "Togo", "Chinese Taipei", "Trinidad and Tobago", "Tunisia", "Turkey", "Tuvalu", "United Arab Emirates", "Uganda", "Uk", "Ukraine","Uruguay", "United States", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Saint Vincent and the Grenadines", "Yemen", "Zambia", "Zimbabwe"]
}
