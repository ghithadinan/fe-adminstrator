import {CategoryModel} from './category.model';

export interface SubCategoryModel {
  id: string;
  name: string;
  categoryId: string;
  category: CategoryModel;
  description: string;
}
