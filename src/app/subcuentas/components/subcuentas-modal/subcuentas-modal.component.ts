import { Component, OnInit } from '@angular/core';

import { SubcuentasService } from '../../services/subcuentas.service';


@Component({
  selector: 'app-subcuentas-modal',
  templateUrl: './subcuentas-modal.component.html',
  styleUrls: ['./subcuentas-modal.component.scss']
})
export class SubcuentasModalComponent implements OnInit {

  constructor(
    public subcuentasService:SubcuentasService,

  ) { }

  ngOnInit(): void {
  }

  showSelectExcel()
  {
    console.log("modal");
    console.log(this.subcuentasService.modalActive);


  }

  clickCancelar(id:number) {

  }

  clickGuardar(id:number) {

  }

}
