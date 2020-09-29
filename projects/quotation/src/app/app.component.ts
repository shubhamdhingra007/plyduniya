import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PROFILE_FORM_CONSTANTS } from './constants/forms.constants';
import { HttpApiService } from './services/http-api.service';


@Component({
  selector: 'quotation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  profileForm: FormGroup;
  formConstants = PROFILE_FORM_CONSTANTS;

  constructor(
    private fb: FormBuilder,
    private apiSvc: HttpApiService
  ) {
    this.profileForm = new FormGroup({
      [PROFILE_FORM_CONSTANTS.FIRST_NAME]: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9 ]+$')
      ]),
      [PROFILE_FORM_CONSTANTS.LAST_NAME]: new FormControl('', [
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9 ]+$')
      ]),
      [PROFILE_FORM_CONSTANTS.STREET_1]: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      [PROFILE_FORM_CONSTANTS.STREET_2]: new FormControl('', [Validators.minLength(10), Validators.maxLength(100)]),
      [PROFILE_FORM_CONSTANTS.CITY]: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      [PROFILE_FORM_CONSTANTS.STATE]: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      [PROFILE_FORM_CONSTANTS.ZIP_CODE]: new FormControl('', [Validators.required, Validators.pattern('^[5-6][1-9]{4}$')]),
      [PROFILE_FORM_CONSTANTS.PHONE]: new FormControl('', [Validators.required, Validators.pattern('(6|7|8|9)\d{9}')]),
      [PROFILE_FORM_CONSTANTS.EMAIL]: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%& * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
      [PROFILE_FORM_CONSTANTS.OTHER_LAMINATES]: new FormControl('', []),
      [PROFILE_FORM_CONSTANTS.OTHERS]: new FormControl('', []),
    });
  }

  ngOnInit() { }

  onSubmit(): void {
    console.log(this.profileForm.status);
  }
}
