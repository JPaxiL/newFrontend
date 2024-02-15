import { EventEmitter, Injectable } from '@angular/core';
import { Message } from 'primeng-lts/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toastMessageCallback = new EventEmitter<Message>();
  toastClearCallback = new EventEmitter<string>();

  public emitToastMessage(message: Message){
    this.toastMessageCallback.emit(message);
  }
  public clearToastMessage(key: string){
    this.toastClearCallback.emit(key);
  }
}
