import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuboConBordiComponent } from './cubo-con-bordi.component';

describe('CuboConBordiComponent', () => {
  let component: CuboConBordiComponent;
  let fixture: ComponentFixture<CuboConBordiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuboConBordiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuboConBordiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
