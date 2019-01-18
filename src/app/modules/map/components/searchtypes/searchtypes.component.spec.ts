import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchtypesComponent } from './searchtypes.component';

describe('SearchtypesComponent', () => {
  let component: SearchtypesComponent;
  let fixture: ComponentFixture<SearchtypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchtypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
