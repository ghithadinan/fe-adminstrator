import {Injectable} from '@angular/core';
import {AdministratorModel} from '../models/administrator.model';
import {BaseApiService} from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService extends BaseApiService<AdministratorModel> {
  pathUrl = 'administrator';
}
