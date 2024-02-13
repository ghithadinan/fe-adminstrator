import {CategoryModel} from './category.model';
import {SubCategoryModel} from './sub.category.model';

export interface SubCategoryProductModel {
  id: string;
  name: string;
  subCategoryId: string;
  subcategory: SubCategoryModel;
  categoryId: string;
  category: CategoryModel;
  description: string;
}
