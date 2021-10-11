import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  nombreComponente: string = '';
  nombreCabecera: string = '';

  constructor() { }
}
