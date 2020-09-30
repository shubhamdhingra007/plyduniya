import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPriceList } from '../models/pricing.model';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(
    private http: HttpClient
  ) { }

  getPriceList(): Observable<IPriceList> {
    return this.http.get<IPriceList>('assets/data-new.json');
  }

  uploadFile(formData: FormData) {
    return this.http.post(`${environment.apiHost}/email`, formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    });
  }

}
