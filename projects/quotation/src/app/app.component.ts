import { Component, OnInit } from '@angular/core';
import { HttpApiService } from './services/http-api.service';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'quotation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private apiSvc: HttpApiService
  ) { }

  ngOnInit() { }
}
