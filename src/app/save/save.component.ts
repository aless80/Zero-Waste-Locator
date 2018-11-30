import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {
  @Output() search = new EventEmitter<boolean>()
  
  constructor() { }

  ngOnInit() {
  }

  findLocationTest() {
    console.log('findLocationTest: ',this.search)
    this.search.emit(null);
    //[search]="search"
  }
}
