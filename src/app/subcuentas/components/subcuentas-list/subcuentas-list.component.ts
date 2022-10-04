import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';

import { SubcuentasService } from '../../services/subcuentas.service';


@Component({
  selector: 'app-subcuentas-list',
  templateUrl: './subcuentas-list.component.html',
  styleUrls: ['./subcuentas-list.component.scss']
})
export class SubcuentasListComponent implements OnInit {

  isUnderConstruction: boolean = false;
  userData: any; //Informacion del usuario

  constructor(
    public panelService: PanelService,
    public subcuentasService: SubcuentasService,

  ) { }

  ngOnInit(): void {
    console.log("=================USER");
    console.log(this.panelService.userData);

    if(!this.subcuentasService.initializingSubUser){
      this.subcuentasService.spinner.show('loadingSubcuentas');
    }


    this.userData = this.panelService.userData;


    this.subcuentasService.initialize();


  }



  // this.reportService.modalActive = true;
  sss() {
    console.log(this.subcuentasService.modalActive);

  }


}
