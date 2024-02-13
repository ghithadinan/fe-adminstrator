import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {CategoryModel} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService<CategoryModel> {
  pathUrl = 'category';
}
