import {Files} from './file.model';
import {Role} from './auth.models';

export interface AdministratorModel {
  id: string;
  name: string;
  email: any;
  phoneNumber: any;
  roleId: string;
  role: Role;
  profilePictureId: string;
  profilePicture: Files;
}
