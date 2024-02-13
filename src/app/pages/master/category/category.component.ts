import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SORT_DIRECTION, TableHead} from '../../../shared/ui/tables/table/table.component';
import {TableSort} from '../../../core/models/table.request.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ACTION_TILE, ATTACHMENT_TYPE} from '../../../helpers/constant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TableService} from '../../../shared/ui/tables/table/table.service';
import {showConfirm} from '../../../helpers/helpers';
import {FileService} from '../../../core/services/file.service';
import {CategoryService} from '../../../core/services/category.service';
import {environment} from '../../../../environments/environment';
import {CategoryModel} from '../../../core/models/category.model';
import {Files} from '../../../core/models/file.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  title = 'Category';
  table = {
    id: 'category',
    url: 'category/datatable',
    head: [
      new TableHead('Name', 'name'),
      new TableHead('Description', 'description'),
      new TableHead('Created At', 'createdAt', false),
      new TableHead('Updated At', 'updatedAt', false),
      new TableHead('Created By', 'createdByUser.name', false, false),
      new TableHead('Updated By', 'updatedByUser.name', false, false)
    ],
    sort: [new TableSort('createdAt', SORT_DIRECTION.DESC)]
  };
  fromGroup: FormGroup;
  submitted = false;
  loading = false;
  actionTitle = ACTION_TILE.CREATE;
  category: CategoryModel = null;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  env = environment;
  private modals: any;
  private id: any;
  uploadedImage: Files = null;
  selectedImage = null;
  ACTION_TILE = ACTION_TILE;

  constructor(private service: CategoryService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private tableService: TableService,
              private fileService: FileService) {

    this.fromGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      imageId: [null]
    });

    this.service.models.subscribe(value => {
      this.id = value.id;
      this.f.name.setValue(value.name ?? '');
      this.f.description.setValue(value.description ?? '');
      this.f.imageId.setValue(value.imageId ?? '');
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.fromGroup.controls;
  }

  onDelete($event: CategoryModel) {
    showConfirm(() => {
      this.service.delete($event.id, () => {
        this.tableService.reload(this.table.id);
      });
    });
  }

  createOrUpdate(model: CategoryModel, modals: any) {
    this.resetInput();

    this.actionTitle = ACTION_TILE.CREATE;
    if (model !== null) {
      this.loading = true;
      this.actionTitle = ACTION_TILE.UPDATE;
      this.service.detail(model.id, (data: { image: Files; }) => {
        this.uploadedImage = data.image;
        this.loading = false;
      }, (_: any) => {
        this.loading = false;
      });
    }
    this.modals = this.modalService.open(modals, {size: 'lg'});
  }

  formDataImage(): FormData {
    const formData = new FormData();
    formData.append('files', this.selectedImage);
    formData.append('attachmentType', ATTACHMENT_TYPE.CATEGORY_PICTURE);
    return formData;
  }

  onFileSelected(target: any) {
    this.selectedImage = target.files[0];
  }

  doneChangeData() {
    this.modals.close();
    this.loading = false;
    this.tableService.reload(this.table.id);
  }

  onSubmit() {
    this.submitted = true;
    if (this.fromGroup.invalid || (this.actionTitle === ACTION_TILE.CREATE && this.selectedImage == null)) {
      return;
    }

    showConfirm(() => {
      this.loading = true;
      if (this.actionTitle === ACTION_TILE.CREATE) {
        this.fileService.create(this.formDataImage(), (data: { id: any; }[]) => {
          this.f.imageId.setValue(data[0].id);
          this.service.create(this.fromGroup.value,
            () => this.doneChangeData(),
            () => this.loading = false);
        }, () => this.loading = false);
      } else {
        if (this.selectedImage != null) {
          this.fileService.create(this.formDataImage(), (data: { id: any; }[]) => {
            this.f.imageId.setValue(data[0].id);
            this.service.update(this.fromGroup.value, this.id,
              () => {
                this.fileService.delete(this.uploadedImage.id,
                  () => this.doneChangeData(),
                  () => this.loading = false);
              }, () => this.loading = false);
          }, () => this.loading = false);
        } else {
          this.service.update(this.fromGroup.value, this.id,
            () => this.doneChangeData(),
            () => this.loading = false);
        }
      }
    });
  }

  resetInput() {
    this.submitted = false;
    this.uploadedImage = null;
    this.selectedImage = null;
    this.fromGroup.reset();
  }
}
