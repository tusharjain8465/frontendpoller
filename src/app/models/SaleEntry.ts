interface SaleEntry {
  id?: number;
  accessoryName: string;
  quantity: number;
  totalPrice: number;
  profit: number;
  saleDateTime: string;
  returnFlag: boolean;
  clientName: string;
  isEditing?: boolean;
}
