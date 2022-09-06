import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemSpendingMenuComponent } from './gem-spending-menu.component';

describe('GemSpendingMenuComponent', () => {
  let component: GemSpendingMenuComponent;
  let fixture: ComponentFixture<GemSpendingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemSpendingMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GemSpendingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
