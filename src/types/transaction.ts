export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
}