import {Files} from './file.model';

export interface User {
  id: string;
  name: string;
  email: any;
  phoneNumber: any;
  roleId: string;
  role: Role;
  profilePictureId: string;
  profilePicture: Files;
}

export interface Role {
  id: string;
  name: string;
}
