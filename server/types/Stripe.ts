export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Metadata {
  cart: CartItem[];
  userId: string;
}

 