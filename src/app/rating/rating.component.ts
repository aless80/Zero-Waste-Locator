import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  constructor() { }
  @Input() rating;
  @Input() user_rating = 0;
  hovered = 0;
  readonly = false;

  setRating(user_rating){
    console.log('setRating',user_rating)
    this.user_rating = user_rating
  }

}
