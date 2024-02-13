import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {Role} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseApiService<Role> {
  pathUrl = 'role';
}
