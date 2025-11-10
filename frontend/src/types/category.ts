export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}
