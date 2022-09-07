import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopMenuComponent } from './shop-menu.component';

describe('ShopMenuComponent', () => {
  let component: ShopMenuComponent;
  let fixture: ComponentFixture<ShopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
