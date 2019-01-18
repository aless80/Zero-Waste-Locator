import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  public active = false;
  @Input() label: string;
  @Input() text: string;
  @Input() img: string;
  constructor() { }
}
