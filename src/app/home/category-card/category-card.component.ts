import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  @Input() category: any;

  constructor(private router: Router) {}
  goToShop(): void {
    console.log('clicked');
    this.router.navigate(['/shop'], {
      queryParams: { category: this.category.categoryName },
    });
  }
}
