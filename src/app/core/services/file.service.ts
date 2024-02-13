import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {Files} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseApiService<Files> {
  pathUrl = 'file';
  showNotification = false;
}
