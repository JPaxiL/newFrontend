import { AlertService } from './../../service/alert.service';
import { Alert } from './../../models/alert.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { PanelService } from 'src/app/panel/services/panel.service';

@Component({
  selector: 'app-actions-alert',
  templateUrl: './actions-alert.component.html',
  styleUrls: ['./actions-alert.component.scss']
})
export class ActionsAlertComponent implements OnInit {
  @Input() alert: any;
  @Input() nameComponent:string = '';
  @Output() editAlert = new EventEmitter<string>();
  @Output() deleteAlert = new EventEmitter<any>();

  params: any;

  options = new Array(
    { id:'ALERTS-ACCESSORIES', name:"Alertas Seguridad Vehicular"},
    { id:'ALERTS-GPS', name:"Alertas GPS"},
    { id:'ALERTS-PLATFORMS', name:"Alertas Plataforma"},

  );


  constructor(
    private alertService :AlertService,
    private panelService:PanelService
  ) { }

  ngOnInit(): void {
  }

  agInit(params: any){
    this.params = params;
  }

  edit(id:string){
    this.editAlert.emit(id);
  }

  delete(event:any , alert:Alert){
    event.preventDefault();

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${alert.nombre}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          const res = await this.alertService.delete(alert.id);
          this.deleteAlert.emit();
          this.clickShowPanel(this.nameComponent);
        }
    }).then(data => {
      if(data.isConfirmed){
        Swal.fire(
          'Eliminado',
          '¡Los datos se eliminaron correctamente!',
          'success'
        );
      }
    });
  }

  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }

}
