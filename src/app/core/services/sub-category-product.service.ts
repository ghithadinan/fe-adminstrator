import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {SubCategoryProductModel} from '../models/sub.category.product.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryProductService extends BaseApiService<SubCategoryProductModel> {
  pathUrl = 'sub-category-product';
}
