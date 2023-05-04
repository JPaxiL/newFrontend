import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';

import { DriversService } from '../../services/drivers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {


  
  isUnderConstruction: boolean = false;
  userData: any; //Informacion del usuario

  constructor(
    public panelService: PanelService,
    public driversService: DriversService,

  ) { }

  ngOnInit(): void {
    console.log("=================DRIVERS");
    console.log(this.panelService.userData);

    if(!this.driversService.initializingDriver){
      this.driversService.spinner.show('loadingDrivers');
    }


    // this.userData = this.panelService.userData;

    if (this.driversService.drivers.length > 0) {
      this.driversService.getAll();

    } else {
      this.driversService.initialize();

    }


  }

  clickActivarSubusuario(id:number) {
    //if (id != 0) {


      // var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == id)[0];

      // var str_activo = (sub.activo) ? "Desactivar" : "Activar";

      // Swal.fire({
      //   //title: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?',
      //   title: '¿Está seguro?',
      //   text: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?', //'Espere un momento...',
      //   icon: 'warning',
      //   showLoaderOnConfirm: true,
      //   showCancelButton: true,
      //   allowOutsideClick: false,
      //   confirmButtonText: str_activo, //'Desactivar',
      //   cancelButtonText: 'Cancelar',
      //   preConfirm: async () => {

      //     sub.activo = (sub.activo) ? false : true;
      //     const res = await this.subcuentasService.activar(sub)

      //     var str2 = (str_activo == "Activar") ? "activo" : "desactivo";
      //     console.log(res);
      //       if (res != 1) {
      //           Swal.fire(
      //             '',
      //             'Subusuario se '+str2+' correctamente',
      //             'success'
      //           );
      //       } else {
      //           Swal.fire(
      //             '',
      //             'Subusuario no se '+str2+' correctamente',
      //             'error'
      //           );
      //         //icon: 'error',
      //       }

      //   },
      // }).then((data) => {
      //   if(data.isConfirmed){
      //     this.subcuentasService.spinner.show('loadingDrivers');
      //     this.subcuentasService.getAll();
      //   }
      // });

  }

  clickConfigurarDriver(id:number) {

    this.driversService.modalActive=true;
    this.driversService.action='edit';
    this.driversService.idDriverEdit = id;

  }

  clickEliminarDriver(event:any, id:number) {
    console.log('------clickEliminarDriver');
    
    console.log(id);
    
    this.driversService.action='delete';

    var sub = this.driversService.drivers.filter((item:any)=> item.id_conductor == id)[0];

    console.log('----clickEliminarDriver');
    console.log(sub);

    Swal.fire({
      //title: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?',
      title: '¿Está seguro?',
      text: '¿Está seguro que desea eliminar '+sub.nombre_conductor+'?', //'Espere un momento...',
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {

        const res = await this.driversService.delete(sub);
        // console.log(res);
          if (res == 1) {
              Swal.fire(
                '',
                'Conductor se elimino correctamente',
                'success'
              );
          } else {
              Swal.fire(
                '',
                'Conductor no se elimino correctamente',
                'error'
              );
            //icon: 'error',
          }


      },
    }).then((data) => {
      // console.log("data-------");
      // console.log(data);
      if(data.isConfirmed){
        this.driversService.spinner.show('loadingDrivers');
        this.driversService.getAll();
      }
    });




  }

  clickAgregarDriver() {
    console.log(this.driversService.drivers.length);
    this.driversService.modalActive=true;
    this.driversService.action='add';
  
  }

  // this.reportService.modalActive = true;
  sss() {
    // console.log(this.subcuentasService.modalActive);

  }



}
