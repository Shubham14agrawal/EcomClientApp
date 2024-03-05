import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';
import { ICart } from 'src/app/shared/models/cart';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService, private basketService: BasketService, private oidcSecurityService: OidcSecurityService) {
    this.bcService.set('@productDetails', ' ')
  }

  ngOnInit(): void {
    this.loadProduct();
    this.oidcSecurityService.getAccessToken().subscribe(response => {
      console.log(response)
    })
  }

  loadProduct() {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.shopService.getProduct(productId).subscribe(
      product => {
        this.product = product;
        this.bcService.set('@productDetails', product.name);
      },
      error => {
        console.log(error);
      }
    );
  }
  

  addItemToBasket(catalogItemId: string, quantity: number) {
    this.basketService.addItemToBasket({catalogItemId, quantity});
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

}
