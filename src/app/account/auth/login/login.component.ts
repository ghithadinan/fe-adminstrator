import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthenticationFirebaseService} from '../../../core/services/auth-firebase.service';
import {AuthfakeauthenticationService} from '../../../core/services/authfake.service';

import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  loading = false;
  @ViewChild('inputPassword') inputPassword: ElementRef;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationFirebaseService,
              private authFackservice: AuthfakeauthenticationService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['ghithadinanhs@gmail.com', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((_: any) => {
          this.router.navigate([this.returnUrl]);
        }).catch(error => {
          this.error = error ? error : '';
        });
      } else {
        this.authService.login(this.f.email.value, this.f.password.value, () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        }, (error) => {
          this.loading = false;
          this.error = error ? error : '';
        });
      }
    }
  }

  showPassword() {
    this.inputPassword.nativeElement.setAttribute('type', 'text');
  }

  hidePassword() {
    this.inputPassword.nativeElement.setAttribute('type', 'password');
  }
}
