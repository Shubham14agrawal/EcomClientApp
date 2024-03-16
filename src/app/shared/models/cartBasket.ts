export interface CartBasket {
    items : CartItem[];
    totalAmount: number;
}


export interface CartItem {
    acquiredDate: Date;
    catalogItemId: string;
    description: string;
    name: string;
    price: number;
    quantity: number;
}