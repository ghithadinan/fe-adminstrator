import {Component, OnInit} from '@angular/core';
import {SORT_DIRECTION, TableHead} from '../../../shared/ui/tables/table/table.component';
import {TableSort} from '../../../core/models/table.request.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TableService} from '../../../shared/ui/tables/table/table.service';
import {SubCategoryService} from '../../../core/services/sub-category.service';
import {showConfirm, toOptions, toOptionSelected} from '../../../helpers/helpers';
import {SubCategoryModel} from '../../../core/models/sub.category.model';
import {ACTION_TILE} from '../../../helpers/constant';
import {CategoryModel} from '../../../core/models/category.model';
import {CategoryService} from '../../../core/services/category.service';
import {OptionRequest} from '../../../core/services/base-api.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  title = 'Sub Category';
  table = {
    id: 'sub-category',
    url: 'sub-category/datatable',
    head: [
      new TableHead('Name', 'name'),
      new TableHead('Category', 'category.name'),
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
  loadingCategory = false;
  actionTitle = ACTION_TILE.CREATE;
  private modals: any;
  private id: any;
  categoryOptions: CategoryModel[] = [];
  category: any = null;

  constructor(private service: SubCategoryService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private tableService: TableService,
              private categoryService: CategoryService) {

    this.fromGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: [this.category, [Validators.required]],
      description: ['']
    });

    this.service.models.subscribe(value => {
      this.id = value.id;
      this.f.name.setValue(value.name ?? '');
      this.f.description.setValue(value.description ?? '');
    });
  }

  addCategory = (term: any) => ({id: null, name: term});

  ngOnInit(): void {
    this.resetInput();
  }

  get f() {
    return this.fromGroup.controls;
  }

  onDelete($event: SubCategoryModel) {
    showConfirm(() => {
      this.service.delete($event.id, () => {
        this.tableService.reload(this.table.id);
      });
    });
  }

  createOrUpdate(model: SubCategoryModel, modals: any) {
    this.resetInput();
    this.actionTitle = ACTION_TILE.CREATE;

    this.loading = true;
    if (model !== null) {
      this.actionTitle = ACTION_TILE.UPDATE;
      this.service.detail(model.id, (data: { category: any; }) => {
        this.loadCategory(() => {
          const catValue = toOptionSelected(data.category);
          this.category = catValue;
          this.f.category.setValue(catValue);
          this.loading = false;
        });
      }, (_: any) => {
        this.loading = false;
      });
    } else {
      this.loadCategory(() => {
        this.loading = false;
      });
    }
    this.modals = this.modalService.open(modals, {size: 'lg'});
  }

  loadCategory(onDone: any) {
    this.loadingCategory = true;
    this.categoryService.options(new OptionRequest(), (data: any) => {
      this.categoryOptions = toOptions(data);
      this.loadingCategory = false;
      onDone();
    }, () => {
      this.loadingCategory = false;
      onDone();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.fromGroup.invalid) {
      return;
    }

    showConfirm(() => {
      this.loading = true;

      if (this.actionTitle === ACTION_TILE.CREATE) {
        this.service.create(this.fromGroup.value,
          () => {
            this.doneChangeData();
          },
          () => this.loading = false);
      } else {
        this.service.update(this.fromGroup.value, this.id,
          () => {
            this.doneChangeData();
          },
          () => this.loading = false);
      }
    });
  }

  onCategoryClear() {
    this.fromGroup.get('category').setValue(null);
    this.category = null;
  }

  changeCategory(data: any) {
    this.category = data;
  }

  resetInput() {
    this.submitted = false;
    this.fromGroup.reset();
  }

  doneChangeData() {
    this.modals.close();
    this.loading = false;
    this.tableService.reload(this.table.id);
  }
}
