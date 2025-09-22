import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FoodstallCalculatorComponent } from './foodstall-calculator/foodstall-calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FoodstallCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'foodstall-calculator';
}
