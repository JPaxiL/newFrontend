import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapServicesService {


  map !: L.Map;  //guardara el mapa
  nombreMap: string = '001';


  constructor() { }
}
