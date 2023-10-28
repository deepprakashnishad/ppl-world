import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          ValidatorFn, ValidationErrors} from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import {AuthResponse} from './../auth-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

const MismatchPasswordValidator: ValidatorFn = (fg: FormGroup): ValidationErrors | null => {
  const pass = fg.get('materialFormCardPasswordEx');
  const confirmPass = fg.get('materialFormCardConfirmPass');

  return pass && confirmPass && pass.value === confirmPass.value ? null : {passwordMismatched: true};
};


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{

    errors: Array<string> = [];
    resetForm: FormGroup;
    isPassword = true;
    passwordOrText = 'password';
    hide=true;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private notifier: NotifierService) {

    this.resetForm = fb.group({
      materialFormCardOldPasswordEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardNewPasswordEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardConfirmPass: ['', Validators.required],
    }, {validator: MismatchPasswordValidator});
    
  }

  ngOnInit(){
  }

  submit(){
    const oldPassword = this.resetForm.get("materialFormCardOldPasswordEx").value;
    const newPassword = this.resetForm.get("materialFormCardNewPasswordEx").value;

    this.authService.resetPasswordWithOldPassword(oldPassword, newPassword).subscribe((response) =>  {
        if (response.success) {
          this.notifier.notify("success", "Password reset successfull");
          this.router.navigate(['profile']);
        }else{
          this.notifier.notify("error", "Failed to reset password");  
        }
      }, error => {
        this.notifier.notify("error", error.error.msg);
          this.errors.push(error.error.raw.msg);
      });

  }
}