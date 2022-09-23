import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';


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
  ) { }

  ngOnInit(): void {
    console.log("=================USER");
    console.log(this.panelService.userData);
    this.userData = this.panelService.userData;


  }

}
