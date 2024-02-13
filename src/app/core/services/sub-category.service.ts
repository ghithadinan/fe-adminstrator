import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {SubCategoryModel} from '../models/sub.category.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService extends BaseApiService<SubCategoryModel> {
  pathUrl = 'sub-category';
}
