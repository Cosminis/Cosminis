import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBattleComponent } from './select-battle.component';

describe('SelectBattleComponent', () => {
  let component: SelectBattleComponent;
  let fixture: ComponentFixture<SelectBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBattleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
