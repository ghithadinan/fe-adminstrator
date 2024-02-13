import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {User} from '../../core/models/auth.models';
import {AuthService} from '../../core/services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {isNullOrEmpty, showConfirm} from '../../helpers/helpers';
import {UserAdministratorService} from '../../core/services/user-administrator.service';
import {environment} from '../../../environments/environment';
import {FileService} from '../../core/services/file.service';
import {ATTACHMENT_TYPE} from '../../helpers/constant';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title = 'Profile';
  user: User = null;
  breadCrumbItems: Array<{}>;
  formGroupProfile: FormGroup;
  formGroupPassword: FormGroup;
  submitedPassword = false;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  submitedProfile = false;
  @ViewChild('inputOldPassword') inputOldPassword: ElementRef;
  @ViewChild('inputNewPassword') inputNewPassword: ElementRef;
  @ViewChild('inputConfirmPassword') inputConfirmPassword: ElementRef;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private service: UserAdministratorService,
              private fileService: FileService
  ) {
    this.user = this.authService.currentUserValue;
    this.formGroupProfile = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      profilePictureId: [null]
    });
    this.formGroupPassword = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: this.confirmPasswordFormControl
    });
  }

  loading = false;
  env = environment;
  protected readonly environment = environment;
  private confirmPasswordFormControl = new FormControl();

  ngOnInit(): void {
    this.breadCrumbItems = [{label: this.title, active: true}];
    this.resetInputProfile();
    this.resetInputPassword();
  }

  resetInputProfile() {
    this.submitedProfile = false;
    this.formGroupProfile.reset();
    this.fProfile.name.setValue(this.user.name);
    this.fProfile.email.setValue(this.user.email);
    this.fProfile.phoneNumber.setValue(this.user.phoneNumber);
    this.fProfile.profilePictureId.setValue(this.user.profilePictureId);
  }

  updateProfile() {
    this.submitedProfile = true;
    if (this.formGroupProfile.invalid) {
      return;
    }
    showConfirm(() => {
      this.loading = true;
      const changeEmail = this.fProfile.email.value !== this.user.email;
      this.service.putByPath('user-administrator/update-profile', this.formGroupProfile.value, (data: User) => {
        if (!changeEmail) {
          this.authService.setCurrentUser(data);
          this.loading = false;
        } else {
          this.authService.logout();
          this.loading = false;
          window.location.reload();
        }
      });
    }, () => {
      this.resetInputProfile();
    });
  }

  updatePassword() {
    this.submitedPassword = true;
    if (isNullOrEmpty(this.confirmPasswordFormControl.value)) {
      this.confirmPasswordFormControl.setErrors({required: true});
    } else {
      if (this.fPassword.newPassword.value !== this.fPassword.confirmPassword.value) {
        this.confirmPasswordFormControl.setErrors({notMatched: true});
      }
    }

    if (this.formGroupPassword.invalid) {
      return;
    }

    showConfirm(() => {
      this.loading = true;
      this.service.putByPath('user-administrator/update-password', this.formGroupPassword.value, () => {
        this.authService.logout();
        this.loading = false;
        window.location.reload();
      });
    }, () => {
      this.resetInputPassword();
    });
  }

  resetInputPassword() {
    this.submitedPassword = false;
    this.formGroupPassword.reset();
  }

  selectFile() {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected(target: any) {
    const file = target.files[0];
    if (file) {
      showConfirm(() => {
        this.loading = true;
        const profileIdBefore = this.user.profilePictureId;
        const formData = new FormData();
        formData.append('files', file);
        formData.append('attachmentType', ATTACHMENT_TYPE.administrator_PROFILE_PICTURE);
        this.fileService.create(formData, (data: { id: any; }[]) => {
          this.fProfile.profilePictureId.setValue(data[0]?.id);
          this.service.putByPath('user-administrator/update-profile', this.formGroupProfile.value, (dataP: User) => {
            this.authService.setCurrentUser(dataP);
            if (profileIdBefore !== null) {
              this.fileService.delete(profileIdBefore, () => {
                this.loading = false;
                window.location.reload();
              });
            } else {
              this.authService.logout();
              this.loading = false;
              window.location.reload();
            }
          });
          this.fileUpload.nativeElement.value = '';
        }, () => {
          this.fileUpload.nativeElement.value = '';
        });
      }, () => {
        this.fileUpload.nativeElement.value = '';
      });
    }
  }

  showPassword(num: number) {
    switch (num) {
      case 1 : {
        this.showHidePassword(true, this.inputOldPassword);
        break;
      }
      case 2 : {
        this.showHidePassword(true, this.inputNewPassword);
        break;
      }
      case 3 : {
        this.showHidePassword(true, this.inputConfirmPassword);
        break;
      }
    }
  }

  hidePassword(num: number) {
    switch (num) {
      case 1 : {
        this.showHidePassword(false, this.inputOldPassword);
        break;
      }
      case 2 : {
        this.showHidePassword(false, this.inputNewPassword);
        break;
      }
      case 3 : {
        this.showHidePassword(false, this.inputConfirmPassword);
        break;
      }
    }
  }

  showHidePassword(show: boolean, elem: ElementRef) {
    const element = elem.nativeElement;
    if (show) {
      element.setAttribute('type', 'text');
    } else {
      element.setAttribute('type', 'password');
    }
  }

  get fProfile() {
    return this.formGroupProfile.controls;
  }

  get fPassword() {
    return this.formGroupPassword.controls;
  }
}
