import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(formData: FormData) {
    return this.http.post(`${environment.apiHost}/email`, formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    });
  }

}
