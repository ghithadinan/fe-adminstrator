import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {AdministratorModel} from '../models/administrator.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdministratorService extends BaseApiService<AdministratorModel> {
}
