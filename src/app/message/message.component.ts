import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input('msgText') msgText: string;
  
  constructor() { }

  ngOnInit() { } //console.log(this.isHidden, '-'+this.msgText+'-') }

  /*showAlert(text: string) : void {
    if (this.msgText != '') return;
    this.msgText = text;
    setTimeout(() => {
      this.msgText = '';
    }, 2000
    )
  }*/
}
