import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  constructor(private authService: AuthService) { }
  @Input() rating;
  @Input() user_rating: number;
  @Output() user_ratingChange = new EventEmitter<string>();
  
  hovered = 0;
  readonly = this.authService.isTokenExp();

  setRating(value) {
    if (!this.readonly) {
      this.user_rating = value;
      this.user_ratingChange.emit(value);
    }
  }
}
