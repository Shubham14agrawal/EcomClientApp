import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryCardComponent } from './category-card/category-card.component';
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, CategoryCardComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
