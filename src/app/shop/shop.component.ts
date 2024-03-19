import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: false }) searchTerm: ElementRef;
  @Input() category: string = 'all';
  products: IProduct[];
  visibleProducts: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams: ShopParams;
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];

  constructor(
    private shopService: ShopService,
    private oidcSecurityService: OidcSecurityService,
  ) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
    this.oidcSecurityService.getAccessToken().subscribe((response) => {
      console.log(response);
    });
    // this.getBrands();
    // this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.category).subscribe(
      (response) => {
        this.products = response;
        this.visibleProducts = this.products;
        console.log('res:', this.products);
        // this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  // getBrands() {
  //   this.shopService.getBrands().subscribe(response => {
  //     this.brands = [{id: 0, name: 'All'}, ...response];
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  // getTypes() {
  //   this.shopService.getTypes().subscribe(response => {
  //     this.types = [{id: 0, name: 'All'}, ...response];
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts();
    }
  }

  onSearch() {
    console.log('Start search');
    const searchWord = <string>this.searchTerm.nativeElement.value;
    searchWord.toLowerCase();
    searchWord.trim();
    if (searchWord === '') {
      this.visibleProducts = this.products;
    } else {
      this.visibleProducts = this.products.filter((product) => {
        return (
          product.name?.toLowerCase().includes(searchWord) ||
          product.description?.toLowerCase().includes(searchWord) ||
          product.type?.toLowerCase().includes(searchWord) ||
          product.category?.toLowerCase().includes(searchWord)
        );
      });
    }
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
