import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-singlecontrol',
  templateUrl: './singlecontrol.component.html',
  styleUrls: ['./singlecontrol.component.css']
})
export class SinglecontrolComponent  {
  @Input() label: string;
  @Input() type: string;
  @Input() name: string;
  //@Input() control: AbstractControl;
  //@Input() control = new FormControl('');
  @Input() value: string = '';

  constructor() { }

}
