import { Component, OnInit } from '@angular/core';
import {DialogModule} from 'primeng-lts/dialog';

import { VehicleConfigService } from '../../services/vehicle-config.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  params: any;

  constructor(private vehicleConfigService : VehicleConfigService) { }

  ngOnInit(): void {
  }
  agInit(params: any){
    this.params = params;
  }
  onClickConfig(e: any):void{
    //console.log("config...vehicle ");
    this.vehicleConfigService.displayOn.emit(e.data);
    // this.config = e.data;
    // this.display = true;
    // //console.log("display-->",this.display);

  }
  // onChangeDisplay(res : boolean){
  //   this.display = res;
  //   //console.log('sssss',res);
  // }
  // onUpdate(res :any){
  //
  // }

}
