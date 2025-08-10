export interface Sale {
  saleDateTime: string; // ✅ Must be exactly this
  accessoryName: string;
  totalPrice: number;
  id?: number;
}
