import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMenuComponent } from './battle-menu.component';

describe('BattleMenuComponent', () => {
  let component: BattleMenuComponent;
  let fixture: ComponentFixture<BattleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
