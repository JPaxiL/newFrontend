import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor() { }

  add(e:any){
    // //console.log("e",e);
    // this.
    this.callback.emit(e)
  }
}
