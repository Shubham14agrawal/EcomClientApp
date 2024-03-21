import { IAddress } from "./address";

export interface IOrderToCreate {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: IAddress;
}

export interface IOrder {
  orderId: string,
  userId: string,
  catalogItemId: string,
  name: string,
  price: number,
  quantity: number,
  orderDate: Date,
  imageUrl: string
  }
  
  export interface IOrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }