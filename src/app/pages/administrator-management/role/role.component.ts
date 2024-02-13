import {Component, OnInit} from '@angular/core';
import {SORT_DIRECTION, TableHead} from '../../../shared/ui/tables/table/table.component';
import {TableSort} from '../../../core/models/table.request.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ACTION_TILE} from '../../../helpers/constant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TableService} from '../../../shared/ui/tables/table/table.service';
import {RoleService} from '../../../core/services/role.service';
import {AdministratorModel} from '../../../core/models/administrator.model';
import {showConfirm} from '../../../helpers/helpers';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  title = 'Role';
  table = {
    id: 'role',
    url: 'role/datatable',
    head: [
      new TableHead('Name', 'name'),
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
  private modals: any;
  private id: any;

  constructor(private service: RoleService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private tableService: TableService) {

    this.fromGroup = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.service.models.subscribe(value => {
      this.id = value.id;
      this.f.name.setValue(value.name ?? '');
    });
  }

  ngOnInit(): void {
  }

  createOrUpdate(model: AdministratorModel, modals: any) {
    this.resetInput();

    this.actionTitle = ACTION_TILE.CREATE;
    if (model !== null) {
      this.loading = true;
      this.actionTitle = ACTION_TILE.UPDATE;
      this.service.detail(model.id, (_: any) => this.loading = false, (_: any) => {
        this.loading = false;
      });
    }
    this.modals = this.modalService.open(modals, {size: 'lg'});
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

  onDelete($event: AdministratorModel) {
    showConfirm(() => {
      this.service.delete($event.id, () => {
        this.tableService.reload(this.table.id);
      });
    });
  }

  doneChangeData() {
    this.modals.close();
    this.loading = false;
    this.tableService.reload(this.table.id);
  }

  resetInput() {
    this.submitted = false;
    this.fromGroup.reset();
  }

  get f() {
    return this.fromGroup.controls;
  }
}
