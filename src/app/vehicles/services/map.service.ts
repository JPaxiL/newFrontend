import { Injectable, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  @Output() sendData = new EventEmitter<any>();

  constructor() { }

  sendDataMap(data:Vehicle[]){
    this.sendData.emit(data);
  }
}
