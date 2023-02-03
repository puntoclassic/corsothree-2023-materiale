import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MareFasulloComponent } from './mare-fasullo.component';

describe('MareFasulloComponent', () => {
  let component: MareFasulloComponent;
  let fixture: ComponentFixture<MareFasulloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MareFasulloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MareFasulloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
