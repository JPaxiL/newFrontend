import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  @Output() showReport: EventEmitter<any> = new EventEmitter();

  constructor() { }



}
