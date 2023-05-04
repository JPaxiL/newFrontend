import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  public eyeStateCreate: boolean = true;
  public eyeStateEditBefore: boolean = true;
  public eyeStateEditAfter: boolean = true;
  public eyeStateEditAfter2: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,

    public driversService: DriversService,



  ) {
    //this.loadData();

  }

  ngOnInit(): void {
    if ( this.driversService.action == "edit" ) {
      var sub = this.driversService.drivers.filter((item:any)=> item.id_conductor == this.driversService.idDriverEdit)[0];
      // console.log(sub);
      this.driversForm = this.fb.group({
              id:         [sub.id_conductor],
              nombre:     [sub.nombre_conductor],
              dni:        [sub.dni_conductor],
              nro_llave:  [sub.nro_llave],
              nro_licencia: [sub.nro_licencia],
            });

    } else {
        //this.nuevo_formulario();
        this.driversForm = this.initForm();

    }

  }

  initForm(): FormGroup {
    return this.fb.group({
      id:[''],
      nombre: [''],
      dni:        [''],
      nro_llave:  [''],
      nro_licencia: [''],

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

    if (this.driversForm.value.nombre == '') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese el nombre del conductor',
        icon: 'error',
      });
      return ;
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
          console.log(sub);
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

        } else if(res.text == 'editado') {
            Swal.fire(
              '',
              'Conductor se edito correctamente.',
              'success'
            );
            this.driversService.modalActive = false;
            this.driversService.spinner.show('loadingSubcuentas');
            this.driversService.initialize();

        } else if(res.text == 'llave_existe') {
          Swal.fire(
            '',
            'Llave ya se encuentra registrada.',
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
