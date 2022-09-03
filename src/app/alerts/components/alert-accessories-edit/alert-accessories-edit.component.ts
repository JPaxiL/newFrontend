import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-alert-accessories-edit',
  templateUrl: './alert-accessories-edit.component.html',
  styleUrls: ['./alert-accessories-edit.component.scss'],
})
export class AlertAccessoriesEditComponent implements OnInit {
  options = new Array({ id: 'ALERTS-ACCESSORIES', name: 'Alertas Seguridad Vehicular' });

  public alertForm!: FormGroup;
  public events: any = [];
  public loading: boolean = true;
  public vehicles: Select2Data = [];
  public disabledEventSoundActive = true;
  public disabledEmail = true;
  public vehiclesSelected: string[] = [];
  overlay = false;
  loadingEventSelectInput: boolean = true;

  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  listaSonidos = [
    { id: 1, ruta: 'sonidos/alarm8.mp3', label: 'Sonido 1' },
    { id: 2, ruta: 'sonidos/alarm2.mp3', label: 'Sonido 2' },
    { id: 3, ruta: 'sonidos/CartoonBullets3.mp3', label: 'Sonido 3' },
    { id: 4, ruta: 'sonidos/DjStop4.mp3', label: 'Sonido 4' },
    { id: 5, ruta: 'sonidos/messenger5.mp3', label: 'Sonido 5' },
    { id: 6, ruta: 'sonidos/Ping6.mp3', label: 'Sonido 6' },
    { id: 7, ruta: 'sonidos/Twitter7.mp3', label: 'Sonido 7' },
    { id: 8, ruta: 'sonidos/Whatsap8.mp3', label: 'Sonido 8' },
    { id: 9, ruta: 'sonidos/WhatsappSound9.mp3', label: 'Sonido 9' },
    { id: 10, ruta: '', label: 'Sin Sonido' },
  ];

  loadingAlertDropdownReady: boolean = false;
  loadingVehicleMultiselectReady: boolean = false;


  constructor(
    private alertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private spinner: NgxSpinnerService,
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.spinner.show('loadingAlertData');

    let alert = this.alertService.getAlertEditData();

    this.vehiclesSelected = alert.imei ==''? []: alert.imei.split(',');
    let arrayNotificationSystem = alert.sistema_notificacion.split(',');
    let notificacion_system =
      arrayNotificationSystem[2].toLowerCase() === 'true';
    let emails = alert.notificacion_direcion_email == ''? []: alert.notificacion_direcion_email.split(',');
    let notificacion_email = alert.notificacion_email.toLowerCase() === 'true';
    this.disabledEventSoundActive = !notificacion_system;
    this.disabledEmail = !notificacion_email;

    this.alertForm = this.formBuilder.group({
      vehicles: [this.vehiclesSelected, [Validators.required]],
      // geocercas: [[]],
      // geocircles: [[]],
      tipoAlerta: [alert.tipo, [Validators.required]],
      chkEventoActivado: [alert.activo],
      chkSonido: [notificacion_system],
      chkCorreo: [notificacion_email],
      sonido: [
        {
          value: `sonidos/${arrayNotificationSystem[3]}`,
          disabled: this.disabledEventSoundActive,
        },
      ],
      nombre: [alert.nombre],
      lista_emails: [emails],
      fecha_desde: [''],
      fecha_hasta: [''],
      email: [
        { value: '', disabled: this.disabledEmail },
        [Validators.required, Validators.email],
      ],
      eventType: ['accessories'],
      id: [alert.id],
    });

    this.loading = false;
  }

  public async loadData() {
    this.setDataVehicles();
    this.events = await this.alertService.getEventsByType('accessories');
    this.alertForm.patchValue({
      tipoAlerta: this.obtenerTipoAlerta(this.alertForm.value.tipoAlerta??''),
    });
    this.loadingEventSelectInput = false;

    this.loadingAlertDropdownReady = true;
    this.hideLoadingSpinner();
  }

  setDataVehicles() {
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map((vehicle: any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.name,
      };
    });

    this.loadingVehicleMultiselectReady = true;
    this.hideLoadingSpinner();
  }

  playAudio() {}

  changeDisabled() {
    if (this.alertForm.value.chkSonido) {
      this.alertForm.controls['sonido'].enable();
    } else {
      this.alertForm.controls['sonido'].disable();
    }
  }

  chkEmailHandler() {
    if (this.alertForm.value.chkCorreo) {
      this.alertForm.controls['email'].enable();
    } else {
      this.alertForm.controls['email'].disable();
    }
  }

  addEmail() {
    if (this.alertForm.value.chkCorreo) {
      if (this.validateEmail(this.alertForm.value.email)) {
        if (
          !this.isInArray(
            this.alertForm.value.email,
            this.alertForm.value.lista_emails
          )
        ) {
          this.alertForm.value.lista_emails.push(this.alertForm.value.email);
          this.alertForm.controls.email.reset();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'El email ingresado ya existe.',
            icon: 'warning',
          });
        }
      } else {
        Swal.fire('Error', 'Debe ingresar un email válido.', 'warning');
      }
    }
  }

  restEmail(index: any) {
    this.alertForm.value.lista_emails.splice(index, 1);
  }

  validateEmail(email: any) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isInArray(value: any, array: any[]) {
    return array.indexOf(value) > -1;
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.alertForm.value.vehiculos = JSON.stringify(
      this.alertForm.value.vehicles
    );

    if (typeof this.alertForm.value.sonido == 'undefined') {
      this.alertForm.value.sonido = 'sonidos/alarm8.mp3';
    }

    if(this.alertForm.value.chkCorreo && this.alertForm.value.lista_emails.length == 0){
      Swal.fire('Error', 'Debe ingresar un correo', 'warning');
      return
    }

    if (this.alertForm.value.vehicles.length != 0) {
      Swal.fire({
        title: 'Desea guardar los cambios?',
        //text: 'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const res = await this.alertService.edit(this.alertForm.value);
          this.clickShowPanel('ALERTS-ACCESSORIES');
        },
      }).then((data) => {
        if (data.isConfirmed) {
          Swal.fire(
            'Actualizado',
            'Los datos se actualizaron correctamente!!',
            'success'
          );
        }
      });
    } else {
      Swal.fire('Error', 'Debe seleccionar un vehículo', 'warning');
    }
  }

  clickShowPanel(nomComponent: string): void {
    $('#panelMonitoreo').show('slow');
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item) => item.id == nomComponent);
    this.panelService.nombreCabecera = item[0].name;
  }

  hideLoadingSpinner(){
    if(this.loadingAlertDropdownReady && this.loadingVehicleMultiselectReady){
      this.spinner.hide('loadingAlertData');
    }
  }

  obtenerTipoAlerta( strAlerta: string){
    //console.log(this.events);
    for(let i = 0; i < this.events.length; i++){
      if(this.prepareString(strAlerta) == this.prepareString(this.events[i].name)){
        console.log('Se encontro match');
        return this.events[i].name;
      }
    }
    return strAlerta;
  }

  prepareString(str: string){
    return str.toLowerCase().normalize('NFKD').replace(/[^\w ]/g, '').replace(/  +/g, ' ').trim();
    //return str.toLowerCase().normalize('NFKD').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/  +/g, ' ').trim();
  }

}
