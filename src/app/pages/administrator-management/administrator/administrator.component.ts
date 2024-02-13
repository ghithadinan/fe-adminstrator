import {Component, OnInit} from '@angular/core';
import {AdministratorModel} from '../../../core/models/administrator.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ACTION_TILE} from '../../../helpers/constant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdministratorService} from '../../../core/services/administrator.service';
import {TableService} from '../../../shared/ui/tables/table/table.service';
import {isNullOrEmpty, showConfirm} from '../../../helpers/helpers';
import {SORT_DIRECTION, TableHead} from '../../../shared/ui/tables/table/table.component';
import {TableSort} from '../../../core/models/table.request.model';
import {RoleService} from '../../../core/services/role.service';
import {OptionRequest} from '../../../core/services/base-api.service';
import {Role} from '../../../core/models/auth.models';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {
  title = 'Administrator';
  table = {
    id: 'administrator',
    url: 'administrator/datatable',
    head: [
      new TableHead('Name', 'name'),
      new TableHead('Email', 'email'),
      new TableHead('Phone Number', 'phoneNumber'),
      new TableHead('Role', 'role.name'),
      new TableHead('Created At', 'createdAt', false),
      new TableHead('Last Login', 'lastLogin', false),
      new TableHead('Updated At', 'updatedAt', false),
      new TableHead('Created By', 'createdByUser.name', false, false),
      new TableHead('Updated By', 'updatedByUser.name', false, false)
    ],
    sort: [new TableSort('createdAt', SORT_DIRECTION.DESC)]
  };
  private modals: any;
  private id: any;
  fromGroup: FormGroup;
  submitted = false;
  loading = false;
  actionTitle = ACTION_TILE.CREATE;
  roleOptions: Role[] = [];

  private passwordFormControl = new FormControl();
  private confirmPasswordFormControl = new FormControl();

  constructor(private service: AdministratorService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private tableService: TableService,
              private roleService: RoleService) {

    this.fromGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      password: this.passwordFormControl,
      confirmPassword: this.confirmPasswordFormControl
    });

    this.service.models.subscribe(value => {
      this.id = value.id;
      this.f.name.setValue(value.name ?? '');
      this.f.email.setValue(value?.email ?? '');
      this.f.phoneNumber.setValue(value?.phoneNumber ?? '');
      this.f.roleId.setValue(value?.role?.id ?? '');
    });
  }

  ngOnInit(): void {
  }

  createOrUpdate(model: AdministratorModel, modals: any) {
    this.loading = true;
    this.resetInput();

    this.actionTitle = ACTION_TILE.CREATE;
    if (model !== null) {
      this.actionTitle = ACTION_TILE.UPDATE;
      this.roleService.options(new OptionRequest(), (data: Role[]) => {
        this.roleOptions = data;
        this.service.detail(model.id, (_: any) => this.loading = false, (_: any) => {
          this.loading = false;
        });
      }, () => this.loading = false);
    } else {
      this.roleService.options(new OptionRequest(), (data: Role[]) => {
        this.roleOptions = data;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    }
    this.modals = this.modalService.open(modals, {size: 'lg'});
  }

  onSubmit() {
    this.submitted = true;
    this.passwordValidation();
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

  passwordValidation() {
    if (this.actionTitle === ACTION_TILE.CREATE) {
      if (isNullOrEmpty(this.passwordFormControl.value)) {
        this.passwordFormControl.setErrors({required: true});
      }
      if (isNullOrEmpty(this.confirmPasswordFormControl.value)) {
        this.confirmPasswordFormControl.setErrors({required: true});
      }
      if (!isNullOrEmpty(this.passwordFormControl.value) && !isNullOrEmpty(this.confirmPasswordFormControl.value)) {
        if (this.passwordFormControl.value !== this.confirmPasswordFormControl.value) {
          this.confirmPasswordFormControl.setErrors({notMatched: true});
        }
      }
    } else {
      if (!isNullOrEmpty(this.passwordFormControl.value)) {
        if (isNullOrEmpty(this.confirmPasswordFormControl.value)) {
          this.confirmPasswordFormControl.setErrors({required: true});
        }
      } else {
        this.confirmPasswordFormControl.setErrors(null);
      }
    }
  }

  doneChangeData() {
    this.modals.close();
    this.loading = false;
    this.tableService.reload(this.table.id);
  }

  resetInput() {
    this.submitted = false;
    this.fromGroup.reset();
    this.f.roleId.setValue('');
  }

  get f() {
    return this.fromGroup.controls;
  }
}


