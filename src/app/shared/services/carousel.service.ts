// carousel.service.ts
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  addItem = new EventEmitter<any>();

  add(component: any, data: any) {
    this.addItem.emit({ component, data });
  }
}
