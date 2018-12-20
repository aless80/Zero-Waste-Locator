import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from "@angular/core";
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  constructor() { }
  @Input() rating;
  @Input() user_rating: number;
  @Output() user_ratingChange = new EventEmitter<string>();
  
  hovered = 0;
  readonly = false;

  setRating(value) {
    this.user_rating = value;
    this.user_ratingChange.emit(value);
  }
}
