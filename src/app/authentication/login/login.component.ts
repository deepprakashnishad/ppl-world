import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          ValidatorFn, ValidationErrors} from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import {AuthResponse} from './../auth-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TNCComponent } from 'src/app/static-page/tnc/tnc.component';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';

const MismatchPasswordValidator: ValidatorFn = (fg: FormGroup): ValidationErrors | null => {
  const pass = fg.get('materialFormCardPasswordEx');
  const confirmPass = fg.get('materialFormCardConfirmPass');

  if (pass.pristine || confirmPass.pristine) {
    return null;
  }
  var result = pass && confirmPass && pass.value === confirmPass.value ? null : {passwordMismatched: true};

  confirmPass.setErrors(result);
  return result;
};


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    errors: Array<string> = [];
    cardForm: FormGroup;
    loginForm: FormGroup;
    authResponse: AuthResponse;
    isPassword = true;
    passwordOrText = 'password';
    hide=true;
    private rememberMe=false;
    referrer: any;

    referrerMobile: string;

    selectedTab: number = 0;

    otpSent: boolean = false;

    isOTPVerified: boolean = false;

  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public snackBar: MatSnackBar,
    private router: Router,
    private notifier: NotifierService,
    private dialog: MatDialog,
    private route: ActivatedRoute) {
    this.cardForm = fb.group({
      materialFormCardNameEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardEmailEx: ['', [Validators.email]],
      materialFormCardMobile: ['', [Validators.maxLength(10), Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]],
      materialFormCardPasswordEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardOTP: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      materialFormCardConfirmPass: ['', Validators.required],
    }, {validator: MismatchPasswordValidator});

    this.loginForm = fb.group({
      inputUsername: ['', Validators.required],
      inputPassword: ['', Validators.required],
      inputRememberMe: [false]
    });
  }

  ngOnInit(){
      const errors = this.route.paramMap.pipe(
        map((params)=>params.get('error'))
      );
      this.route.queryParams.subscribe(params=>{
        if(params['referrer'] && params['referrer'].length>10){
          this.referrerMobile = params['referrer'].slice(-10);  
          this.selectedTab = 1;
        }else if(params['referrer']){
          this.referrerMobile = params['referrer'];
          this.selectedTab = 1;
        }
      });

      errors.subscribe(val=>{
        if (val !== null) {
          this.errors.push(val)
          this.notifier.notify("error", val);
        }
      });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.errors = [];
      const name = this.cardForm.get('materialFormCardNameEx').value.trim();
      const password = this.cardForm.get('materialFormCardPasswordEx').value;
      const email = this.cardForm.get('materialFormCardEmailEx').value?.trim();
      const otp = this.cardForm.get('materialFormCardOTP').value?.trim();
      var mobile = "+91" + this.cardForm.get('materialFormCardMobile').value.trim();

      /*if(!this.referrer){
        return this.notifier.notify("error", "Referrer missing");
      }*/

      this.authService.signup(
        {name: name, password: password, email: email, mobile: mobile, parent: this.referrer, "otp": otp}
        ).subscribe((authResponse) =>  {
          this.authResponse = authResponse;
          if (authResponse) {
            this.openSnackBar('User successfully created', 'Dismiss');
            this.storeData(this.authResponse);
            this.clearForm();
            let redirectUrl = this.authService.redirectUrl && this.authService.redirectUrl.indexOf("login")===-1 ? this.authService.redirectUrl : '/profile';
            this.router.navigate([redirectUrl]);
          }
        }, error => {
          this.notifier.notify("error", error.error.msg);
            this.errors.push(error.error.raw.msg);
        });
    }
  }

  clearForm(): void {
    this.cardForm.reset()
    this.cardForm.markAsPristine()
    this.cardForm.markAsUntouched()
    this.cardForm.updateValueAndValidity()
    this.loginForm.reset()
    this.loginForm.markAsPristine()
    this.loginForm.markAsUntouched()
    this.loginForm.updateValueAndValidity()
  }

  login(): void {
    if (this.loginForm.valid) {
      this.errors = [];
      var username = this.loginForm.get('inputUsername').value.trim();
      const password = this.loginForm.get('inputPassword').value;
      this.rememberMe = this.loginForm.controls['inputRememberMe'].value;
      if(username.indexOf("@")<0 && username.length===10){
        username = "+91"+username;
      }
      this.authService.login(
        { username: username, password: password }
      ).subscribe((authResponse) => {
        this.authResponse = authResponse;
        if (this.authResponse) {
          this.notifier.notify("success", "Login successful");
          this.storeData(this.authResponse);
          this.clearForm();
          if(authResponse.iprr && authResponse.iprr===1){
            this.notifier.notify("warning", "Please reset your password from profile page");
            this.router.navigate(["reset-password"]);  
          }
          let redirectUrl = this.authService.redirectUrl && this.authService.redirectUrl.indexOf("login")===-1 ? this.authService.redirectUrl : '/profile';
          this.router.navigate([redirectUrl]);
        }
      }, (error) => {
        this.notifier.notify("error", "Login failed");
        this.errors.push(error.error.msg);
      });
    } else {
      this.notifier.notify("error",  "Username and password required");
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  onToggleShowPassword() {
    this.isPassword = !this.isPassword;
    if (this.isPassword) {
      this.passwordOrText = 'password';
    } else {
      this.passwordOrText = 'text';
    }
  }

  storeData(authResponse){
    var data = authResponse;
    data.permissions = this.getPermissionList(authResponse.permissions);
    data.role = authResponse.r.name
    if (this.rememberMe) { 
      this.authService.storeLocalData(data, "LOCAL_STORAGE")
    } 
    this.authService.storeLocalData(data, "SESSION_STORAGE")
  }

  getPermissionList(permissions){
    const permissionList = [];
    for (let i = permissions.length - 1; i >= 0; i--) {
      permissionList.push(permissions[i].permission);
    }
    return permissionList.join(',');
  }

  navigateTo(path) {
    console.log("Navigation called");
    //this.router.navigate([path]);
  }

  referrerSelected(event){
    this.referrer = event;
  }

  openTnC(){
    const dialogRef = this.dialog.open(TNCComponent, {height: "100%", width: "100%"});
  }

  generateOTP(){
    var mobile = "+91" + this.cardForm.get('materialFormCardMobile').value.trim();
    if(mobile.length != 13){
      this.notifier.notify("error", "Invalid mobile number");
      return;
    }
    this.authService.requestOTP(mobile).subscribe((result)=>{
      if(result.success){
        this.otpSent = true;
        this.notifier.notify("success", "OTP sent to mobile number provided");
      }else{
        this.notifier.notify("error", "Failed to send OTP message. Please try again later.");
      }
    });
  }
}

