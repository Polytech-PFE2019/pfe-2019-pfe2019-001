import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDisplayComponent } from './stats-display.component';

describe('StatsDisplayComponent', () => {
  let component: StatsDisplayComponent;
  let fixture: ComponentFixture<StatsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
