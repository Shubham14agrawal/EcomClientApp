import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from './orders.service';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[];

  constructor(private orderService: OrdersService, private shopService: ShopService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
      this.loadProductImages();
    }, error => {
      console.log(error);
    })
  }

  loadProductImages() {
    this.orders.forEach(order => {
      this.shopService.getProduct(order.catalogItemId).subscribe(
        product => {
          order.imageUrl = product.imageUrl;
        },
        error => {
          console.log(error);
        }
      );
    });
  }
}
