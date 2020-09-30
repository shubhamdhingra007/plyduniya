import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PROFILE_FORM_CONSTANTS } from './constants/forms.constants';
import { IAvailableOption, IOrder, IPriceList } from './models/pricing.model';
import { HttpApiService } from './services/http-api.service';


@Component({
  selector: 'quotation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  profileForm: FormGroup;
  queryFeedback: string;
  formConstants = PROFILE_FORM_CONSTANTS;
  orderList: {
    availableOption: IAvailableOption;
    order: IOrder
  }[] = [];
  pricingData: IPriceList;
  errorInFile = false;
  errorNoOrderData = false;
  uploadingStatus: 'INIT' | 'DONE' | 'LOADING' | 'ERROR' = 'INIT';
  fileData: File;

  constructor(
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
      [PROFILE_FORM_CONSTANTS.CITY]: new FormControl('Bangalore', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      [PROFILE_FORM_CONSTANTS.STATE]: new FormControl('Karnataka', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      [PROFILE_FORM_CONSTANTS.ZIP_CODE]: new FormControl('', [Validators.required, Validators.pattern('^[5-6]{1}[0-9]{5}$')]),
      [PROFILE_FORM_CONSTANTS.PHONE]: new FormControl('', [Validators.required, Validators.pattern('^[0]?[6-9]{1}[0-9]{9}$')]),
      [PROFILE_FORM_CONSTANTS.EMAIL]: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%& * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
    });
  }

  ngOnInit() {
    this.fetchPriceList();
  }

  private fetchPriceList(): void {
    this.apiSvc.getPriceList().subscribe(
      data => {
        console.log(data);
        this.pricingData = data;
        this.addRows();
      }
    );
  }

  addRows(): void {
    const brands = Object.keys(this.pricingData);
    for (let i = 0; i < 3; i++) {
      this.orderList.push({
        availableOption: {
          brands,
          grades: [],
          particularDetails: [],
          sizes: []
        },
        order: {
          brand: null,
          grade: null,
          particulars: null,
          quantity: null,
          size: null,
          isSizingApplicable: false,
          rate: 0,
        }
      });
    }
  }

  brandChange(index: number) {
    this.errorNoOrderData = false;
    this.orderList[index].order.grade = null;
    this.orderList[index].order.particulars = null;
    this.orderList[index].order.size = null;
    this.orderList[index].availableOption.grades = Object.keys(this.pricingData[this.orderList[index].order.brand]);
  }

  gradeChange(index: number) {
    this.errorNoOrderData = false;
    this.orderList[index].order.particulars = null;
    this.orderList[index].order.size = null;
    const gradeData = this.pricingData[this.orderList[index].order.brand][this.orderList[index].order.grade];
    if (gradeData.every(u => u.isSizingApplicable)) {
      this.orderList[index].availableOption.sizes = [...new Set(gradeData.map(u => u.size))];
    }
    this.orderList[index].availableOption.particularDetails = [...new Set(gradeData.map(u => u.particulars))];
  }

  sizeChange(index: number) {
    this.errorNoOrderData = false;
    this.orderList[index].order.particulars = null;
    const gradeData = this.pricingData[this.orderList[index].order.brand][this.orderList[index].order.grade]
      .filter(u => u.size === this.orderList[index].order.size);
    this.orderList[index].availableOption.particularDetails = [...new Set(gradeData.map(u => u.particulars))];
  }

  particularsChange(index: number) {
    const item = this.pricingData[this.orderList[index].order.brand][this.orderList[index].order.grade]
      .find(u => u.particulars === this.orderList[index].order.particulars);
    this.orderList[index].order.rate = item.rate;
    this.orderList[index].order.size = item.size;
    this.orderList[index].order.isSizingApplicable = item.isSizingApplicable;
  }

  onFileUpload(event: Event) {
    this.errorNoOrderData = false;
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) {
      this.errorInFile = false;
      const file = files[0];
      this.fileData = file;
      if (Math.ceil(file.size / 1024) > 1024) {
        this.errorInFile = true;
      }
    }
  }

  onSubmit(): void {
    if (this.errorInFile) {
      return;
    }
    if (
      !this.orderList.some(u => Boolean(
        u.order.brand &&
        u.order.grade &&
        u.order.particulars &&
        u.order.quantity &&
        u.order.size
      )) &&
      !this.fileData
    ) {
      this.errorNoOrderData = true;
    } else {
      this.errorNoOrderData = false;
      const data = {
        profile: {
          firstName: this.profileForm.get(this.formConstants.FIRST_NAME).value,
          lastName: this.profileForm.get(this.formConstants.FIRST_NAME).value,
          address1: this.profileForm.get(this.formConstants.STREET_1).value,
          address2: this.profileForm.get(this.formConstants.LAST_NAME).value,
          city: this.profileForm.get(this.formConstants.CITY).value,
          state: this.profileForm.get(this.formConstants.STATE).value,
          zip: this.profileForm.get(this.formConstants.ZIP_CODE).value,
          phone: this.profileForm.get(this.formConstants.PHONE).value,
          email: this.profileForm.get(this.formConstants.EMAIL).value,
        },
        order: this.orderList.map(u => u.order).filter(u => Boolean(
          u.brand && u.grade && u.particulars && u.quantity && u.size
        )),
        otherQuery: this.queryFeedback
      };
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('uploadFile', this.fileData);
      this.uploadingStatus = 'LOADING';
      this.apiSvc.uploadFile(formData).subscribe(
        _ => {
          this.uploadingStatus = 'DONE';
          this.profileForm.reset();
        },
        _ => {
          this.uploadingStatus = 'ERROR';
        }
      );
    }
  }
}
