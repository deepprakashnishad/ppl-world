import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormBuilder, Validators, FormControl, 
          ValidatorFn, ValidationErrors} from '@angular/forms';
import { GeneralService } from './../../general.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  cardForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private generalService: GeneralService,
    private notifier: NotifierService,
  ){

  }

	ngOnInit(){
    this.cardForm = this.fb.group({
      inputName: ['', Validators.required],
      inputMobile: ['', Validators.required],
      inputEmail: [''],
      inputDescription: ['', Validators.required]
    });
	}

  submit(){
    if (this.cardForm.valid) {
      const name = this.cardForm.get('inputName').value;
      const email = this.cardForm.get('inputEmail').value;
      var mobile = "+91" + this.cardForm.get('inputMobile').value;
      var description = this.cardForm.get('inputDescription').value;

      this.generalService.saveContactDetails(
        {name: name, email: email, mobile: mobile, description: description}
      ).subscribe((response) =>  {
        this.clearForm();
        this.notifier.notify("success", "Your message has been posted to community. One of the member will contact you soon.")
      }, error => {
        this.notifier.notify("error", error.error.msg);
      });
    }
  }

  clearForm(): void {
    this.cardForm.reset()
    this.cardForm.markAsPristine()
    this.cardForm.markAsUntouched()
    this.cardForm.updateValueAndValidity()
  }
}