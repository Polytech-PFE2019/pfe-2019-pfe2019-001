import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdComparatorComponent } from './bird-comparator.component';

describe('BirdComparatorComponent', () => {
  let component: BirdComparatorComponent;
  let fixture: ComponentFixture<BirdComparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirdComparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
