import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {OwlOptions} from 'ngx-owl-carousel-o';
import {AuthenticationFirebaseService} from '../../../core/services/auth-firebase.service';
import {environment} from '../../../../environments/environment';
import {first} from 'rxjs/operators';
import {UserProfileService} from '../../../core/services/user.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit {

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  };

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationFirebaseService,
              private userService: UserProfileService) {
  }

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  // set the currenr year
  year: number = new Date().getFullYear();

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg');

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.register(this.f.email.value, this.f.password.value).then((_: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/dashboard']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            _ => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }
}
