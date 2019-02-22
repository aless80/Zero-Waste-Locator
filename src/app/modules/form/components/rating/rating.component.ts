import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { AuthService } from '../../../../shared/services/auth.service';
import { RateService } from '../../../../shared/services/rate.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  constructor(
    private authService: AuthService,
    private rateService: RateService) { }

  @Input() rating;
  @Input() user_rating: number;
  @Input() storeId: string = '';
  @Output() user_ratingChange = new EventEmitter<string>();
  
  hovered = 0;
  
  setRating(value) {
    if (this.authService.isTokenExp() || this.storeId == '' || this.user_rating == value) return
    //Send change in rating to form component. It will be stored on Save
    this.user_rating = value;
    this.user_ratingChange.emit(value);
    //Store rating in user's DB
    this.storeRating(value)
  }

  storeRating(value) {
    let username = this.authService.getLoggedUsername()
    this.rateService.storeRate(username, this.storeId, value)
      .subscribe(res => console.log(res))
  }
}
