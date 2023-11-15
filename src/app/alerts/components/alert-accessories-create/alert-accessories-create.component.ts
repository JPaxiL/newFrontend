import { Component, ElementRef, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-alert-accessories-create',
  templateUrl: './alert-accessories-create.component.html',
  styleUrls: ['./alert-accessories-create.component.scss'],
})
export class AlertAccessoriesCreateComponent implements OnInit {
  options = new Array({ id: 'ALERTS-ACCESSORIES', name: 'Alertas Seguridad Vehicular' });

  public alertForm!: FormGroup;
  public events: any = [];
  public loading: boolean = true;
  public vehicles: Select2Data = [];
  public disabledEventSoundActive = true;
  public disabledEmail = true;
  public disabledWhatsapp = true;
  loadingEventSelectInput: boolean = true;

  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  booleanOptionsVentanaEmergente = [
    { label: 'Activado', value: true },
    { label: 'Desactivado', value: false },
  ];

  listaSonidos: any = [];
  audio = new Audio();

  loadingAlertDropdownReady: boolean = false;
  loadingVehicleMultiselectReady: boolean = false;

  constructor(
    private AlertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private spinner: NgxSpinnerService,
    private el: ElementRef
  ) {
    this.listaSonidos = this.AlertService.listaSonidos;
  }

  ngOnInit(): void {
    this.spinner.show('loadingAlertData');

    this.alertForm = this.formBuilder.group({
      vehicles: ['', [Validators.required]],
      // geocercas: [[]],
      // geocircles: [[]],
      tipoAlerta: ['', [Validators.required]],
      chkEventoActivado: [true],
      chkSonido: [false],
      chkCorreo: [false],
      chkwhatsapp: [false],
      sonido: [
        {
          value: 'sonidos/alarm8.mp3',
          disabled: this.disabledEventSoundActive,
        },
      ],
      nombre: [''],
      lista_emails: [[]],
      fecha_desde: [moment(new Date('2000/01/01')).format('YYYY-MM-DD')],
      fecha_hasta: [moment(new Date('2000/01/01')).format('YYYY-MM-DD')],
      email: [
        { value: '', disabled: this.disabledEmail },
        [Validators.required, Validators.email],
      ],
      eventType: ['accessories'],

      lista_whatsapp: [[]],
      whatsapp: [
        { value: '', disabled: this.disabledWhatsapp },
        [Validators.required],
      ],
      chkVentanaEmergente:[false]
    });

    this.loading = false;
    this.loadData();
  }

  public async loadData() {
    this.setDataVehicles();
    this.events = await this.AlertService.getEventsByType('accessories');
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

  playAudio(path: string) {
    if (typeof path != 'undefined' && path != '') {
      if (this.audio.currentSrc != '' && !this.audio.ended) {
        this.audio.pause();
      }
      this.audio = new Audio('assets/' + path);
      let audioPromise = this.audio.play();

      if (audioPromise !== undefined) {
        audioPromise.then(() => {
          //console.log('Playing notification sound')
        })
          .catch((error: any) => {
            //console.log(error);
            // Auto-play was prevented
          });
      }
    }
  }

  changeDisabled() {
    if (this.alertForm.value.chkSonido) {
      this.alertForm.controls['sonido'].enable();
    } else {
      this.alertForm.controls['sonido'].disable();
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

  chkEmailHandler() {
    if (this.alertForm.value.chkCorreo) {
      this.alertForm.controls['email'].enable();
    } else {
      this.alertForm.controls['email'].disable();
    }
  }

  chkWhatsappHandler() {

    if (this.alertForm.value.chkwhatsapp) {
      this.alertForm.controls['whatsapp'].enable();
    } else {
      this.alertForm.controls['whatsapp'].disable();
    }
  }

  onSubmit(event: any) {
    event.preventDefault();

    if (this.alertForm.value.chkCorreo && this.alertForm.value.lista_emails.length == 0) {
      Swal.fire('Error', 'Debe ingresar un correo', 'warning');
      return
    }

    if (this.alertForm.value.chkwhatsapp && this.alertForm.value.lista_whatsapp.length == 0) {
      Swal.fire('Error', 'Debe ingresar un número', 'warning');
      return
    }

    this.alertForm.value.vehiculos = JSON.stringify(
      this.alertForm.value.vehicles
    );

    if (typeof this.alertForm.value.sonido == 'undefined') {
      this.alertForm.value.sonido = 'sonidos/alarm8.mp3';
    }

    if (this.alertForm.value.vehicles.length != 0) {
      Swal.fire({
        title: '¿Desea guardar los cambios?',
        //text: 'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const res = await this.AlertService.create(this.alertForm.value);
          this.clickShowPanel('ALERTS-ACCESSORIES');
        },
      }).then((data) => {
        if (data.isConfirmed) {
          Swal.fire(
            'Datos guardados',
            'Los datos se guardaron correctamente!!',
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

  hideLoadingSpinner() {
    if (this.loadingAlertDropdownReady && this.loadingVehicleMultiselectReady) {
      this.spinner.hide('loadingAlertData');
    }
  }

  addWhatsapp() {
    if (this.alertForm.value.chkwhatsapp) {
      if (this.alertForm.value.whatsapp) {
        if (
          !this.isInArray(
            this.alertForm.value.whatsapp,
            this.alertForm.value.lista_whatsapp
          )
        ) {
          this.alertForm.value.lista_whatsapp.push(this.alertForm.value.whatsapp);
          this.alertForm.controls.whatsapp.reset();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'El número ingresado ya existe.',
            icon: 'warning',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Debe ingresar un número.',
          icon: 'warning',
        });
      }

    }
  }

  restWhatsapp(index: number) {
    this.alertForm.value.lista_whatsapp.splice(index, 1);
  }
}
