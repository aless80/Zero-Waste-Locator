import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  msgText: string = '';

  constructor() { }
  
  showAlert(text: string) : void {
    if (this.msgText != '') return;
    this.msgText = text;
    setTimeout(() => {
      this.msgText = '';
    }, 2000
    )
  }
}
