import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../models/basket';
import { IProduct } from '../../models/product';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket = true;
  @Input() items: any;
  @Input() isOrder = false;

  productsWithImages: any[] = [];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.loadProductImages()
    console.log("items", this.items)
  }

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }

  loadProductImages() {
    this.items.forEach(item => {
      this.shopService.getProduct(item.catalogItemId).subscribe(
        product => {
          item.imageUrl = product.imageUrl;
          this.productsWithImages.push(item);
        },
        error => {
          console.log(error);
        }
      );
    });
  }
}