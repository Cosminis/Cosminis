import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCosminisComponent } from './all-cosminis.component';

describe('AllCosminisComponent', () => {
  let component: AllCosminisComponent;
  let fixture: ComponentFixture<AllCosminisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCosminisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCosminisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
