import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';

import { SubcuentasService } from '../../services/subcuentas.service';
import Swal from 'sweetalert2';


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

  clickActivarSubusuario(id:number) {
    //if (id != 0) {


      var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == id)[0];

      var str_activo = (sub.activo) ? "Desactivar" : "Activar";

      Swal.fire({
        //title: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?',
        text: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?', //'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: str_activo, //'Desactivar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {

          sub.activo = (sub.activo) ? false : true;
          const res = await this.subcuentasService.activar(sub)

          var str2 = (str_activo == "Activar") ? "activo" : "desactivo";
          console.log(res);
            if (res != 1) {
                Swal.fire(
                  '',
                  'Subusuario se '+str2+' correctamente',
                  'success'
                );
            } else {
                Swal.fire(
                  '',
                  'Subusuario no se '+str2+' correctamente',
                  'error'
                );
              //icon: 'error',
            }

        },
      }).then((data) => {
        if(data.isConfirmed){
          this.subcuentasService.spinner.show('loadingSubcuentas');
          this.subcuentasService.initialize();
        }
      });
    // } else {
    //   Swal.fire('Error', 'Debe seleccionar un vehículo', 'warning');
    // }
  }

  clickConfigurarSubusuario(id:number) {

    this.subcuentasService.modalActive=true;
    this.subcuentasService.action='edit';
    this.subcuentasService.idSubUserEdit = id;

  }

  clickEliminarSubusuario(event:any, id:number) {
    this.subcuentasService.action='delete';

    var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == id)[0];

    Swal.fire({
      //title: '¿Está seguro que desea '+ str_activo.toUpperCase() +' '+sub.nombre_usuario+'?',
      text: '¿Está seguro que desea eliminar '+sub.nombre_usuario+'?', //'Espere un momento...',
      icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {

        const res = await this.subcuentasService.delete(sub);
        // console.log(res);
          if (res == 1) {
              Swal.fire(
                '',
                'Subusuario se elimino correctamente',
                'success'
              );
          } else {
              Swal.fire(
                '',
                'Subusuario no se elimino correctamente',
                'error'
              );
            //icon: 'error',
          }


      },
    }).then((data) => {
      // console.log("data-------");
      // console.log(data);
      this.subcuentasService.spinner.show('loadingSubcuentas');
      this.subcuentasService.initialize();

    });




  }

  clickAgregarSubusuario() {
    // console.log(this.subcuentasService.subUsers.length);

    if ( this.subcuentasService.subUsers.length > 5 ) {
      Swal.fire(
        '',
        'El límite de Subusuarios es 5.',
        'warning'
      );
    } else {
      this.subcuentasService.modalActive=true;
      this.subcuentasService.action='add';
    }

  }

  // this.reportService.modalActive = true;
  sss() {
    console.log(this.subcuentasService.modalActive);

  }


}
