import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecontrolComponent } from './singlecontrol.component';

describe('SinglecontrolComponent', () => {
  let component: SinglecontrolComponent;
  let fixture: ComponentFixture<SinglecontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglecontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglecontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
