import { Sale } from "./sale.model";

export interface Client {
  id: number;
  name: string;
  location: string;
  contact: string;
  sales: Sale[];
}
