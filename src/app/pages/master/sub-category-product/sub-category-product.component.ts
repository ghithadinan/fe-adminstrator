import {Component, OnInit} from '@angular/core';
import {SORT_DIRECTION, TableHead} from '../../../shared/ui/tables/table/table.component';
import {TableSort} from '../../../core/models/table.request.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ACTION_TILE} from '../../../helpers/constant';
import {CategoryModel} from '../../../core/models/category.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TableService} from '../../../shared/ui/tables/table/table.service';
import {CategoryService} from '../../../core/services/category.service';
import {SubCategoryProductService} from '../../../core/services/sub-category-product.service';
import {SubCategoryModel} from '../../../core/models/sub.category.model';
import {showConfirm, toOptions, toOptionSelected} from '../../../helpers/helpers';
import {OptionRequest, ParamSearch, TABLE_DATA_TYPE} from '../../../core/services/base-api.service';
import {SubCategoryService} from '../../../core/services/sub-category.service';

@Component({
  selector: 'app-sub-category-product',
  templateUrl: './sub-category-product.component.html',
  styleUrls: ['./sub-category-product.component.scss']
})
export class SubCategoryProductComponent implements OnInit {
  title = 'Sub Category Product';
  table = {
    id: 'sub-category-product',
    url: 'sub-category-product/datatable',
    head: [
      new TableHead('Name', 'name'),
      new TableHead('Category', 'category.name'),
      new TableHead('Sub Category', 'subCategory.name'),
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
  actionTitle = ACTION_TILE.CREATE;
  loading = {
    data: false,
    category: false,
    subCategory: false
  };
  categoryOptions: CategoryModel[] = [];
  category: any = null;
  subCategoryOptions: SubCategoryModel[] = [];
  subCategory: any = null;
  private modals: any;
  private id: any;

  constructor(private service: SubCategoryProductService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private tableService: TableService,
              private categoryService: CategoryService,
              private subCategoryService: SubCategoryService) {

    this.fromGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: [this.category, [Validators.required]],
      subCategory: [this.subCategory, [Validators.required]],
      description: ['']
    });

    this.service.models.subscribe(value => {
      this.id = value.id;
      this.f.name.setValue(value.name ?? '');
      this.f.description.setValue(value.description ?? '');
    });
  }

  get f() {
    return this.fromGroup.controls;
  }

  addCategory = (term: any) => ({id: null, name: term});
  addSubCategory = (term: any) => ({id: null, name: term});

  ngOnInit(): void {
    this.resetInput();
  }

  createOrUpdate(model: SubCategoryModel, modals: any) {
    this.resetInput();
    this.actionTitle = ACTION_TILE.CREATE;

    this.loading.data = true;
    this.category = null;
    this.subCategory = null;
    if (model !== null) {
      this.actionTitle = ACTION_TILE.UPDATE;
      this.service.detail(model.id, (dataR: { category: any; categoryId: any; subCategory: any; }) => {
        this.loadCategory(() => {
          const catValue = toOptionSelected(dataR.category);
          this.f.category.setValue(catValue);
          this.category = catValue;
          this.loadSubCategory(dataR.categoryId, () => {
            const subValue = toOptionSelected(dataR.subCategory);
            this.f.subCategory.setValue(subValue);
            this.subCategory = subValue;
            this.loading.data = false;
          });
        });
      }, (_: any) => {
        this.loading.data = false;
      });
    } else {
      this.loadCategory(() => {
        this.loading.data = false;
      });
    }
    this.modals = this.modalService.open(modals, {size: 'lg'});
  }

  onDelete($event: SubCategoryModel) {
    showConfirm(() => {
      this.service.delete($event.id, () => {
        this.tableService.reload(this.table.id);
      });
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.fromGroup.invalid) {
      return;
    }

    showConfirm(() => {
      this.loading.data = true;
      if (this.actionTitle === ACTION_TILE.CREATE) {
        this.service.create(this.fromGroup.value,
          () => {
            this.doneChangeData();
          },
          () => this.loading.data = false);
      } else {
        this.service.update(this.fromGroup.value, this.id,
          () => {
            this.doneChangeData();
          },
          () => this.loading.data = false);
      }
    });
  }

  onClearOptions(num: number) {
    if (num === 1) {
      this.category = null;
      this.subCategory = null;
      this.subCategoryOptions = [];
    }
    if (num === 2) {
      this.subCategory = null;
    }
  }

  loadCategory(onDone: any) {
    this.loading.category = true;
    this.categoryOptions = [];
    this.categoryService.options(new OptionRequest(), (data: any) => {
      this.categoryOptions = toOptions(data);
      this.loading.category = false;
      onDone();
    }, () => {
      this.loading.category = false;
      onDone();
    });
  }

  loadSubCategory(categoryId: any = null, onDone: any = null) {
    this.loading.subCategory = true;
    this.subCategoryOptions = [];
    const optionReq = new OptionRequest();
    if (categoryId) {
      optionReq.paramIs = [new ParamSearch('categoryId', TABLE_DATA_TYPE.STRING, categoryId)];
    }
    this.subCategoryService.options(optionReq, (dataC: any) => {
      this.subCategoryOptions = toOptions(dataC);
      this.loading.subCategory = false;
      if (onDone) {
        onDone();
      }
    }, () => {
      this.loading.subCategory = false;
    });
  }

  changeCategory(data: any) {
    if (data) {
      this.category = data;
      this.loadSubCategory(this.category.id);
    } else {
      this.category = null;
      this.subCategory = null;
      this.subCategoryOptions = [];
    }
  }

  changeSubCategory(data: any) {
    this.subCategory = data;
  }

  resetInput() {
    this.submitted = false;
    this.fromGroup.reset();
  }

  doneChangeData() {
    this.modals.close();
    this.loading.data = false;
    this.tableService.reload(this.table.id);
  }

}
