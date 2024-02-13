import {AttachmentType} from './attachment.type';

export interface Files {
  id: string;
  name: string;
  ext: string;
  path: string;
  mimeType: string;
  attachmentTypeId: string;
  attachmentType: AttachmentType;
}
