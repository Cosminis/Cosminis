import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcformComponent } from './ccform.component';

describe('CcformComponent', () => {
  let component: CcformComponent;
  let fixture: ComponentFixture<CcformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
