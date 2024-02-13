import {Files} from './file.model';

export interface CategoryModel {
  id: string;
  name: string;
  description: string;
  imageId: string;
  image: Files;
}
