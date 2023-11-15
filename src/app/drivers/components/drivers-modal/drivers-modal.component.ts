import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { DriversService } from '../../services/drivers.service';

import Swal from 'sweetalert2';

import {Md5} from 'ts-md5';


@Component({
  selector: 'app-drivers-modal',
  templateUrl: './drivers-modal.component.html',
  styleUrls: ['./drivers-modal.component.scss']
})
export class DriversModalComponent implements OnInit {



  driversForm!: FormGroup;
  ibuttons :any = [];
  cars : any = [];
  tipo_identificacion = '';

  public eyeStateCreate: boolean = true;
  public eyeStateEditBefore: boolean = true;
  public eyeStateEditAfter: boolean = true;
  public eyeStateEditAfter2: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,

    public driversService: DriversService,
    public VehicleService : VehicleService,



  ) {
    //this.loadData();

  }


  //   cars = [
  //     { nombre: 'ABC-676',imei:'111111111' },
  //     { nombre: 'DER-435',imei:'2222222222' },
  //     { nombre: 'DRW-345',imei:'3333333333' },
  //     { nombre: 'DRF-345',imei:'444444444' },
  // ];

  listIdentificacion =  [
        { id: 'ibutton',value:'A un I-button' },
        { id: 'imei',value:'A una Unidad' },
        { id: '',value:'N/A' },
    ];

  ngOnInit(): void {
    console.log("=========ngOnInit ");
    console.log(this.driversService.action);

    this.ibuttons = this.driversService.ibuttons;

    let vehicles = this.VehicleService.getVehiclesData();
    // console.log("======================== vehiculos en conductores");
    // console.log(vehicles);
    this.getCars(vehicles);

    // this.VehicleService.dataCompleted.subscribe( vehicles => {
    //   console.log("======================== vehiculos en conductores");
    //   console.log(vehicles);
    //   this.getCars(vehicles);
    // });

    if ( this.driversService.action == "edit" ) {
      //solo para el caso de EDIT su ibutton debe mostrarse
      var sub = this.driversService.drivers.filter((item:any)=> item.id == this.driversService.idDriverEdit);
      console.log('PRUEBA EDIT ->',sub);
      this.driversForm = this.fb.group({
              id:         [sub[0].id],
              nombre:     [sub[0].nombre_conductor],
              dni:        [sub[0].dni_conductor],
              nro_llave:      [sub[0].id_keyIbutton],
              nro_licencia:   [sub[0].nro_licencia],
              tracker_imei:   [sub[0].tracker_imei],
              tracker_nombre: [sub[0].tracker_nombre],
              tipo_identificacion: [sub[0].tipo_identificacion],
            });
        // console.log(this.driversForm);

    } else {
        //this.nuevo_formulario();
        this.driversForm = this.initForm();

    }


    
  }


  getCars(vehicles: any){
    for (let i = 0; i < vehicles.length; i++) {
      // let gaa = { nombre: vehicles[i].name ,imei:vehicles[i].IMEI };
      let gaa = { nombre: vehicles[i].name ,imei:vehicles[i].IMEI };
      this.cars.push(gaa);
    }
  }

  onChangeIdentificacion(ev: any) {
    console.log('----onChangeIdentificacion');
    console.log(ev);
    console.log(this.driversForm.value.tipo_identificacion);

    this.tipo_identificacion = this.driversForm.value.tipo_identificacion;

  }

  initForm(): FormGroup {
    return this.fb.group({
      id:[''],
      nombre: [''],
      dni:        [''],
      nro_llave:  [''],
      nro_licencia: [''],
      tracker_imei:   [''],
      tracker_nombre: [''],
      tipo_identificacion: [''],

    })
  }

  showSelectExcel()
  {
    console.log("modal");
    // console.log(this.subcuentasService.modalActive);


  }

  public async loadData() {
    // this.events = await this.AlertService.getEventsByType('platform');
    // this.loadingEventSelectInput = false;
    // this.setDataVehiences();
    // this.setDataGeopcles();
    // this.setDataGeofoints();
    // this.setDataReportes();
    // this.loadingAlertDropdownReady = true;
    // this.hideLoadingSpinner();
  }

  onSubmit(): void {
    console.log("============ onSubmit ");
    console.log(this.driversForm);
    console.log(this.driversForm.value.tipo_identificacion);
    

    if (this.driversForm.value.nombre == '') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese el nombre del conductor',
        icon: 'error',
      });
      return ;
    }

    if (this.driversForm.value.dni == '') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese el DNI del conductor',
        icon: 'error',
      });
      return ;
    }

    if (this.driversForm.value.tipo_identificacion == "ibutton") {

        console.log(this.driversForm.value.nro_llave);

        if (this.driversForm.value.nro_llave == null) {
          Swal.fire({
            title: 'Error',
            text: 'Seleccione una llave I-button',
            icon: 'error',
          });
          return ;
        }


      
    } else if (this.driversForm.value.tipo_identificacion == "imei") {

        console.log(this.driversForm.value.tracker_imei);
        
        if (this.driversForm.value.tracker_imei == null || this.driversForm.value.tracker_imei == "") {
          Swal.fire({
            title: 'Error',
            text: 'Seleccione un Vehículo',
            icon: 'error',
          });
          return ;
        }
        
        this.driversForm.value.tracker_nombre = (this.cars.filter((item:any)=> item.imei == this.driversForm.value.tracker_imei))[0].nombre;
        console.log(this.driversForm.value.tracker_nombre);
    } else {
      
    }


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
        if ( this.driversService.action == "edit" ) {
          var sub = this.driversService.drivers.filter((item:any)=> item.id_conductor == this.driversService.idDriverEdit)[0];
          // console.log(sub);
          res = await this.driversService.edit(this.driversForm.value);
        } else {
          res = await this.driversService.create(this.driversForm.value);
        }

        if (res.text == 'repetido') {
            Swal.fire(
              '',
              'No se pudo agregar.',
              'warning'
            );
        } else if(res.text == 'Insert') {
            Swal.fire(
              '',
              'Conductor se registro correctamente.',
              'success'
            );
            this.driversService.modalActive = false;
            this.driversService.spinner.show('loadingSubcuentas');
            this.driversService.initialize();
            if(res.dataInsert.tipo_identificacion == 'imei'){
              this.VehicleService.updateDriverAndId(res.dataInsert);
            }

        } else if(res.text == 'editado') {
            Swal.fire(
              '',
              'Conductor se edito correctamente.',
              'success'
            );
            this.driversService.modalActive = false;
            this.driversService.spinner.show('loadingSubcuentas');
            this.driversService.initialize();
            if(res.driver.tipo_identificacion == 'imei' || res.driver_old.tipo_identificacion == 'imei'){
              //VERIFICAR IMEI IGUALEs
              if(res.driver_old.tracker_imei == res.driver.tracker_imei){
                console.log('IMEI IGUALES SOLO ACTUALIZAR UNO');
                this.VehicleService.updateDriverAndId(res.driver);
              }else{
                this.VehicleService.updateDriverAndId(res.driver_old);
                this.VehicleService.updateDriverAndId(res.driver);
              }
            }

        } else if(res.text == 'llave_existe') {
          Swal.fire(
            '',
            'Llave ya se encuentra registrada, seleccione otra.',
            'warning'
          );
          // this.driversService.modalActive = false;
          // this.driversService.spinner.show('loadingSubcuentas');
          // this.driversService.initialize();

        } else if(res.text == 'placa_ocupada') {
          Swal.fire(
            '',
            'Placa ya se encuentra registrada.',
            'warning'
          );
          // this.driversService.modalActive = false;
          // this.driversService.spinner.show('loadingSubcuentas');
          // this.driversService.initialize();

        }  else if(true){
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


  }

  clickCancelar(id:number) {
    console.log('clickcancelas');

  }

  clickGuardar(id:number) {
    console.log('clickguardas');

  }

  getControlLabel(type: string){
    return this.driversForm.controls[type].value;
  }

  togglePassEye(){
    document.querySelector('#passCreate')?.setAttribute('type', this.eyeStateCreate? 'password': 'text');
    document.querySelector('#passEditBefore')?.setAttribute('type', this.eyeStateEditBefore? 'password': 'text');
    document.querySelector('#passEditAfter')?.setAttribute('type', this.eyeStateEditAfter? 'password': 'text');
    document.querySelector('#passEditAfter2')?.setAttribute('type', this.eyeStateEditAfter2? 'password': 'text');
  }


}
