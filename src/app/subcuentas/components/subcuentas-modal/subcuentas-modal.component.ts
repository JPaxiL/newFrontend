import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { GeopointsService } from 'src/app/geopoints/services/geopoints.service';

import { SubcuentasService } from '../../services/subcuentas.service';
import Swal from 'sweetalert2';
// import * as _ from 'lodash';
import {Md5} from 'ts-md5';



@Component({
  selector: 'app-subcuentas-modal',
  templateUrl: './subcuentas-modal.component.html',
  styleUrls: ['./subcuentas-modal.component.scss']
})
export class SubcuentasModalComponent implements OnInit {

  subcuentasForm!: FormGroup;
  public vehiculos: Select2Data = [];
  public geocercas: Select2Data = [];
  public geocircles: Select2Data = [];
  public geopuntos: Select2Data = [];
  public reportes: Select2Data = [];
  public eventos: Select2Data = [];

  public eyeStateCreate: boolean = true;
  public eyeStateEditBefore: boolean = true;
  public eyeStateEditAfter: boolean = true;
  public eyeStateEditAfter2: boolean = true;

  constructor(
    public subcuentasService:SubcuentasService,
    private VehicleService: VehicleService,
    private geofencesService: GeofencesService,
    private geopointsService: GeopointsService,
    private fb: FormBuilder,
    private http: HttpClient,


  ) {
    this.loadData();

    // this.http.post(environment.apiUrl + '/api/getReports', {}).subscribe({
    //   next: data => {
    //     // console.log("----------------data");
    //     // console.log(data);
    //     var reps:any = data;
    //     this.reportes = reps.map((reporte: any) => {
    //       return {
    //         value: reporte.codigo,
    //         label: reporte.value,
    //       };
    //     });

    //   },
    //   error: () => {
    //     console.log('Hubo un error al procesar la solicitud');
    //   }
    // });
  }

  ngOnInit(): void {

    if ( this.subcuentasService.action == "edit" ) {
      //this.llenar_formulario();
      //var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];
      //console.log(geo);

      var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == this.subcuentasService.idSubUserEdit)[0];
      console.log(sub);
      console.log(JSON.parse(sub.array_zonas));

      // this.subcuentasForm = this.fb.group({
      //   chkSubUserActivado: [sub.activo],
      //   nombre: [sub.nombre_usuario],
      //   contrasena: [''],
      //   vehiculos: [[]],
      //   geocercas: [[]],//[JSON.parse(sub.array_zonas)], //[[]],
      //   geopuntos: [[]]//[JSON.parse(sub.array_puntos)],

      // });

      // this.subcuentasForm = this.initForm();

      this.subcuentasForm = this.fb.group({
              id:[sub.id],
              chkSubUserActivado: [sub.activo],
              nombre: [sub.nombre_usuario],
              contrasena: [''],
              contrasenaNew : [''],
              contrasenaNew2 : [''],
              vehiculos: [JSON.parse(sub.array_trackers)],//[['867688036621526']],
              geocercas: [JSON.parse(sub.array_zonas)],//[JSON.parse(sub.array_zonas)], //[[]],
              geopuntos: [JSON.parse(sub.array_puntos)],//[JSON.parse(sub.array_puntos)],
              reportes: [JSON.parse(sub.array_reportes)],//[JSON.parse(sub.array_puntos)],
              eventos: [JSON.parse(sub.array_eventos)]//[JSON.parse(sub.array_puntos)],


            });




      this.subcuentasForm.value.geocercas = [JSON.parse(sub.array_zonas)];

    } else {

        //this.nuevo_formulario();
        this.subcuentasForm = this.initForm();

    }

  }

  initForm(): FormGroup {
    return this.fb.group({
      id:[''],
      chkSubUserActivado: [true],
      nombre: [''],
      contrasena: [''],
      vehiculos: [[]],
      geocercas: [[]],
      geopuntos: [[]],
      reportes: [[]],
      eventos: [[]],

    })
  }

  showSelectExcel()
  {
    console.log("modal");
    console.log(this.subcuentasService.modalActive);


  }

  public async loadData() {
    // this.events = await this.AlertService.getEventsByType('platform');
    // this.loadingEventSelectInput = false;
    this.setDataVehicles();
    this.setDataGeofences();
    this.setDataGeopoints();
    this.setDataReportes();
    this.setDataEventos();

    // this.loadingAlertDropdownReady = true;
    // this.hideLoadingSpinner();
  }

  setDataVehicles() {
    let vehiculos = this.VehicleService.getVehiclesData();

    this.vehiculos = vehiculos.map((vehicle: any) => {
      return {
        value:vehicle.IMEI,
        label: vehicle.name,
      };
    });

    // this.loadingVehicleMultiselectReady = true;
    // this.hideLoadingSpinner();
  }

  setDataGeofences() {
    let geocercas = this.geofencesService.getData();
    this.geocercas = geocercas.map((geocerca: any) => {
      return {
        value: geocerca.id,
        label: geocerca.zone_name,
      };
    });

    // this.loadingGeofencesMultiselectReady = true;
    // this.hideLoadingSpinner();
  }

  setDataGeopoints() {
    let geopuntos = this.geopointsService.getData();
    console.log(geopuntos);

    this.geopuntos = geopuntos.map((geopunto: any) => {
      return {
        value: geopunto.geopunto_id,
        label: geopunto.geopunto_name,
      };
    });

    // this.loadingGeofencesMultiselectReady = true;
    // this.hideLoadingSpinner();
  }

  setDataReportes() {
    let reportes = this.subcuentasService.getDataReportesAll();

    this.reportes = reportes.map((reporte: any) => {
      return {
        value: reporte.codigo,
        label: reporte.value,
      };
    });

    // this.loadingGeofencesMultiselectReady = true;
    // this.hideLoadingSpinner();
  }

  setDataEventos() {
    let eventos = this.subcuentasService.getDataEventosAll();

    this.eventos = eventos.map((evento: any) => {
      return {
        value: evento.code,
        label: evento.name,
      };
    });

    // this.loadingGeofencesMultiselectReady = true;
    // this.hideLoadingSpinner();
  }


  onSubmit(): void {




    var nro = this.subcuentasForm.value.vehiculos.length;
    console.log('Form ->', this.subcuentasForm.value);
    console.log(this.subcuentasForm.value.contrasena);
    console.log(this.subcuentasForm.value.nombre);
    console.log(JSON.stringify( this.subcuentasForm.value.vehiculos ));
    console.log(JSON.stringify( this.subcuentasForm.value.geocercas ));
    console.log(JSON.stringify( this.subcuentasForm.value.geopuntos ));

    // ["868324027652143","868324028803208"]
    // Route::post('/subUser/create', [SubUserController::class, 'crateSubUser']);


    // this.subcuentasForm.value.geocercascirculares = JSON.stringify(
    //   this.subcuentasForm.value.geocercas
    // );

    console.log('Form ->', this.subcuentasForm.value);
    this.subcuentasForm.value.vehiculos = JSON.stringify(
      this.subcuentasForm.value.vehiculos
    );
    this.subcuentasForm.value.geocercas = JSON.stringify(
      this.subcuentasForm.value.geocercas
    );
    this.subcuentasForm.value.geopuntos = JSON.stringify(
      this.subcuentasForm.value.geopuntos
    );
    this.subcuentasForm.value.reportes = JSON.stringify(
      this.subcuentasForm.value.reportes
    );
    this.subcuentasForm.value.eventos = JSON.stringify(
      this.subcuentasForm.value.eventos
    );

    // console.log(this.subcuentasForm.value.contrasena);
    // console.log(this.subcuentasForm.value.nombre);
    if (this.subcuentasForm.value.nombre == '') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese el nombre de la cuenta',
        icon: 'error',
      });
      return ;
    }



    if (nro != 0) {

      Swal.fire({
        //title: '¿Desea guardar los cambios?',
        text: '¿Desea guardar los cambios?',//'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {

          var res:any;
          if ( this.subcuentasService.action == "edit" ) {


            var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == this.subcuentasService.idSubUserEdit)[0];
            console.log(sub);
            console.log(this.subcuentasForm.value.contrasena+" -O- "+sub.contrasena);

            // console.log(md5.createHash(this.subcuentasForm.value.contrasena));
            const md5 = new Md5();
            var oldpass = md5.appendStr(this.subcuentasForm.value.contrasena).end();

            console.log(md5.appendStr(this.subcuentasForm.value.contrasena).end());
            console.log(oldpass);


            if (this.subcuentasForm.value.contrasena != "" || this.subcuentasForm.value.contrasenaNew != "" || this.subcuentasForm.value.contrasenaNew2 != "") {

              console.log(oldpass+' - '+sub.contrasena);
              if (oldpass != sub.contrasena) {
                Swal.fire(
                  '',//'Error',
                  'La contraseña anterior es incorrecta!!',
                  'error'
                );
                return ;
              }

              console.log(this.subcuentasForm.value.contrasenaNew+' - '+this.subcuentasForm.value.contrasenaNew2);
              if (this.subcuentasForm.value.contrasenaNew == "" || this.subcuentasForm.value.contrasenaNew2 == "") {
                Swal.fire(
                  '',//'Error',
                  'Complete los campos de la contraseña',
                  'error'
                );
                return ;
              }

              if (this.subcuentasForm.value.contrasenaNew != this.subcuentasForm.value.contrasenaNew2) {
                Swal.fire(
                  '',//'Error',
                  'La nueva contraseña debe coincidir!!',
                  'error'
                );
                return ;
              }

              // res = await this.subcuentasService.edit(this.subcuentasForm.value);
            }
            res = await this.subcuentasService.edit(this.subcuentasForm.value);


          } else {

            if (this.subcuentasForm.value.contrasena == '') {
              Swal.fire({
                title: 'Error',
                text: 'Ingrese una contraseña',
                icon: 'error',
              });
              return ;
            }

            res = await this.subcuentasService.create(this.subcuentasForm.value);
          }

          if (res.text == 'repetido') {
              Swal.fire(
                '',
                'Nombre de usuario ya existe!. Ingrese otro nombre.',
                'warning'
              );
          } else if(res.text == 'Insert') {
              Swal.fire(
                '',
                'Subusuario se registro correctamente.',
                'success'
              );
              this.subcuentasService.modalActive = false;
              this.subcuentasService.spinner.show('loadingSubcuentas');
              this.subcuentasService.initialize();

          } else if(res.text == 'editado') {
            Swal.fire(
              '',
              'Subusuario se edito correctamente.',
              'success'
            );
            this.subcuentasService.modalActive = false;
            this.subcuentasService.spinner.show('loadingSubcuentas');
            this.subcuentasService.initialize();

          } else if(true){
            console.log('------------');
          }

          //'success' , 'warning' , 'error'

          // if (data.isConfirmed) {
          //   Swal.fire(
          //     '',//'Datos guardados',
          //     'Los datos se guardaron correctamente!!',
          //     'success'
          //   );
          // }


        },
      }).then((data) => {
        console.log(data);



      });
    } else {
      Swal.fire('', 'Debe seleccionar un vehículo', 'warning');
    }

  }

  clickCancelar(id:number) {
    console.log('clickcancelas');

  }

  clickGuardar(id:number) {
    console.log('clickguardas');

  }

  getControlLabel(type: string){
    return this.subcuentasForm.controls[type].value;
  }

  togglePassEye(){
    document.querySelector('#passCreate')?.setAttribute('type', this.eyeStateCreate? 'password': 'text');
    document.querySelector('#passEditBefore')?.setAttribute('type', this.eyeStateEditBefore? 'password': 'text');
    document.querySelector('#passEditAfter')?.setAttribute('type', this.eyeStateEditAfter? 'password': 'text');
    document.querySelector('#passEditAfter2')?.setAttribute('type', this.eyeStateEditAfter2? 'password': 'text');
  }

}
