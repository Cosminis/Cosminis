import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosminisGoComponent } from './cosminis-go.component';

describe('CosminisGoComponent', () => {
  let component: CosminisGoComponent;
  let fixture: ComponentFixture<CosminisGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CosminisGoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosminisGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
