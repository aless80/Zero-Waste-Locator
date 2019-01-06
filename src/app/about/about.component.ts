import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public active1 = false;
  public active2 = false;
  public active3 = false;
  public active4 = false;
  public active5 = false;

  constructor() { }

  ngOnInit() {
  }

}
