import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { DriversService } from '../../services/drivers.service';

import Swal from 'sweetalert2';

import {Md5} from 'ts-md5';
import { Driver } from '../../models/interfaces';


@Component({
  selector: 'app-drivers-modal',
  templateUrl: './drivers-modal.component.html',
  styleUrls: ['./drivers-modal.component.scss']
})
export class DriversModalComponent implements OnInit {



  driversForm!: FormGroup;
  ibuttons :any = [];
  icipias :any = [];
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

  // icipias =  [
  //   { name: 'C00003',id:'1' },
  //   { name: 'C00002',id:'2' },
  //   { name: 'C00001',id:'3' },
  // ];

  ngOnInit(): void {
    console.log("=========ngOnInit ");
    console.log(this.driversService.action);

    this.ibuttons = this.driversService.ibuttons;
    this.icipias = this.driversService.icipias;

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
      var sub = this.driversService.drivers.filter((item:Driver)=> item.id == this.driversService.idDriverEdit);
      console.log('PRUEBA EDIT ->',sub);
      this.driversForm = this.fb.group({
              id:         [sub[0].id],
              nombre:     [sub[0].nombre_conductor],
              dni:        [sub[0].dni_conductor],
              nro_llave:      [sub[0].id_keyIbutton],
              nro_licencia:   [sub[0].nro_licencia],
              nro_cipia:    [sub[0].id_keyIcipia],
              nro_cellphone: [sub[0].telefono_conductor],
              tracker_imei:   [sub[0].tracker_imei],
              tracker_nombre: [sub[0].tracker_nombre],
              tipo_identificacion: [sub[0].tipo_identificacion],
            });
        console.log(this.driversForm.value);

    } else {
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

  // onChangeIdentificacion(ev: any) {
  //   console.log('----onChangeIdentificacion');
  //   console.log(ev);
  //   console.log(this.driversForm.value.tipo_identificacion);

  //   this.tipo_identificacion = this.driversForm.value.tipo_identificacion;

  // }

  initForm(): FormGroup {
    return this.fb.group({
      id:[''],
      nombre: [''],
      dni:        [''],
      nro_llave:  [''],
      nro_cellphone:  [''],
      nro_cipia:  [''],
      nro_licencia: [''],
      tracker_imei:   [''],
      tracker_nombre: [''],
      tipo_identificacion: [''],

    })
  }

  onSubmit(): void {
    console.log("============ onSubmit ");
    // console.log(this.driversForm);

    if (this.driversForm.value.nombre == '') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese el nombre del conductor',
        icon: 'error',
      });
      return ;
    }

    // if (this.driversForm.value.dni == '') {
    //   Swal.fire({
    //     title: 'Error',
    //     text: 'Ingrese el DNI del conductor',
    //     icon: 'error',
    //   });
    //   return ;
    // }
    // console.log(this.driversForm.value.tracker_imei);
    if (this.driversForm.value.tracker_imei == null || this.driversForm.value.tracker_imei == "" || this.driversForm.value.tracker_imei == "--") {
      this.driversForm.value.tracker_imei = null;
      this.driversForm.value.tracker_nombre = null;
    }else{
      this.driversForm.value.tracker_nombre = (this.cars.filter((item:any)=> item.imei == this.driversForm.value.tracker_imei))[0].nombre;
      // console.log(this.driversForm.value.tracker_nombre);
    }

    if (this.driversForm.value.nro_cipia == '--'){
      this.driversForm.value.nro_cipia = null;
    }
    if (this.driversForm.value.nro_llave == '--'){
      this.driversForm.value.nro_llave = null;
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
        console.log(this.driversForm.value);
        var res:any;
        if ( this.driversService.action == "edit" ) {
          res = await this.driversService.edit(this.driversForm.value);
        } else {
          res = await this.driversService.create(this.driversForm.value);
        }
        console.log('response->',res);

        if (res.success == false) {
            Swal.fire(
              '',
              res.msn,
              'warning'
            );
        }else if(res.success == true){
          if(res.text == 'Insert') {
            Swal.fire(
              '',
              'Conductor se registro correctamente.',
              'success'
            );
            this.driversService.modalActive = false;
            this.driversService.spinner.show('loadingSubcuentas');
            this.driversService.initialize();
            if(res.dataInsert.tipo_identificacion.vehicle == true){
              this.VehicleService.updateDriverAndId(res.dataInsert,true);
            }
          } else if(res.text == 'Update') {
              Swal.fire(
                '',
                res.msn,
                'success'
              );
              this.driversService.modalActive = false;
              this.driversService.spinner.show('loadingSubcuentas');
              this.driversService.initialize();
              if(res.driver.tipo_identificacion.vehicle == true || res.driverOld.tipo_identificacion.vehicle == true){
                //VERIFICAR IMEI IGUALEs
                if(res.driverOld.tracker_imei == res.driver.tracker_imei){
                  // console.log('IMEI IGUALES SOLO ACTUALIZAR UNO');
                  this.VehicleService.updateDriverAndId(res.driver,true);
                }else {
                  // console.log('IMEI NO IGUALES SOLO ACTUALIZAR UNO');
                  if (res.driverOld.tipo_identificacion.vehicle == true){
                    // console.log('UPDATE OLD',res.driverOld);
                    this.VehicleService.updateDriverAndId(res.driverOld,false); // SI ES FALSE ELIMINA
                  }
                  if(res.driver.tipo_identificacion.vehicle == true){
                    // console.log('UPDATE NEW',res.driver);
                    this.VehicleService.updateDriverAndId(res.driver,true);
                  }
                }
              }
          }
        }else{
            console.log('------------ CASO NO DETECTED');
        }
      },
    }).then((data) => {
      // console.log(data);
    });


  }

}
