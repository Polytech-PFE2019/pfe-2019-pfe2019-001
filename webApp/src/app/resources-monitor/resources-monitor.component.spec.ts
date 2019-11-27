import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesMonitorComponent } from './resources-monitor.component';

describe('ResourcesMonitorComponent', () => {
  let component: ResourcesMonitorComponent;
  let fixture: ComponentFixture<ResourcesMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
