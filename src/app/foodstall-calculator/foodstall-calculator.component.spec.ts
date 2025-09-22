import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodstallCalculatorComponent } from './foodstall-calculator.component';

describe('FoodstallCalculatorComponent', () => {
  let component: FoodstallCalculatorComponent;
  let fixture: ComponentFixture<FoodstallCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodstallCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodstallCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
