import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { GeopointsService } from 'src/app/geopoints/services/geopoints.service';

import { SubcuentasService } from '../../services/subcuentas.service';
import Swal from 'sweetalert2';


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

  constructor(
    public subcuentasService:SubcuentasService,
    private VehicleService: VehicleService,
    private geofencesService: GeofencesService,
    private geopointsService: GeopointsService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    if ( this.subcuentasService.action == "edit" ) {
      //this.llenar_formulario();
      //var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];
      //console.log(geo);

      var sub = this.subcuentasService.subUsers.filter((item:any)=> item.id == this.subcuentasService.idSubUserEdit)[0];
      console.log(sub);
      this.subcuentasForm = this.fb.group({
        chkSubUserActivado: [sub.activo],
        nombre: [sub.nombre_usuario],
        contrasena: [''],
        vehiculos: [[]],
        geocercas: [[]],
        geopuntos: [[]],

      });

    } else {
      //this.nuevo_formulario();
      this.subcuentasForm = this.initForm();
      this.loadData();


    }



  }

  initForm(): FormGroup {
    return this.fb.group({
      chkSubUserActivado: [true],
      nombre: [''],
      contrasena: [''],
      vehiculos: [[]],
      geocercas: [[]],
      geopuntos: [[]],

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

  onSubmit(): void {
    var nro = this.subcuentasForm.value.vehiculos.length;
    console.log('Form ->', this.subcuentasForm.value);

    console.log(this.subcuentasForm.value.contrasena);
    console.log(this.subcuentasForm.value.nombre);


    console.log(JSON.stringify( this.subcuentasForm.value.vehiculos ));

    console.log(JSON.stringify( this.subcuentasForm.value.geocercas ));

    console.log(JSON.stringify( this.subcuentasForm.value.geopuntos ));


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


    console.log(this.subcuentasForm.value.contrasena);
    console.log(this.subcuentasForm.value.nombre);
    if (this.subcuentasForm.value.nombre == '') {
      Swal.fire('', 'Ingrese el nombre de la cuenta', 'warning');
      return ;
    }

    if (this.subcuentasForm.value.contrasena == '') {
      Swal.fire('', 'Ingrese una contraseña', 'warning');
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
          const res = await this.subcuentasService.create(this.subcuentasForm.value);
          // this.clickShowPanel('ALERTS-PLATFORMS');
          console.log(res);
          console.log(res.success);
          var ff:any = res;
          if (ff.text == 'repetido') {
              Swal.fire(
                '',
                'Nombre de usuario ya existe!. Ingrese otro nombre.',
                'warning'
              );
          } else if(ff.text == 'Insert') {
              Swal.fire(
                '',
                'Subusuario se registro correctamente.',
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

}
