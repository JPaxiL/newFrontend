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
  options = new Array(
    { id: 'ALERTS-ACCESSORIES', name: 'Alertas 360' },
    { id: 'ALERTS-SECURITY', name: 'Alertas Seguridad Vehicular' },
    { id: 'ALERTS-MOBILE', name: 'Alertas Soluciones Móviles' },
    { id: 'ALERTS-360', name: 'Alertas Fatiga 360' }
  );
  type = '';
  public alertForm!: FormGroup;
  public events: any = [];
  public loading: boolean = true;
  public vehicles: Select2Data = [];
  public disabledEventSoundActive = true;
  public disabledEmail = true;
  public vehiclesSelected: string[] = [];
  public disabledWhatsapp = true;
  overlay = false;
  loadingEventSelectInput: boolean = true;
  audio = new Audio();

  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  booleanOptionsVentanaEmergente = [
    { label: 'Activado', value: true },
    { label: 'Desactivado', value: false },
  ];
  booleanOptionsAtencionEventos = [
    { label: 'Activado', value: true },
    { label: 'Desactivado', value: false },
  ];

  listaSonidos: any = [];

  loadingAlertDropdownReady: boolean = false;
  loadingVehicleMultiselectReady: boolean = false;
  alertSelected: any;

  constructor(
    private alertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private spinner: NgxSpinnerService
  ) {
    /* this.listaSonidos = this.alertService.listaSonidos; */
    this.type =
      this.panelService.nombreComponente == 'ALERTS-SECURITY-EDIT'
        ? 'security'
        : this.panelService.nombreComponente == 'ALERTS-MOBILE-EDIT'
        ? 'mobile'
        : '360';
    this.loadData();
  }

  ngOnInit(): void {
    this.spinner.show('loadingAlertData');
    let alert = this.alertService.getAlertEditData();
    /* console.log("ALERT:::::", alert); */
    this.vehiclesSelected = alert.imei == '' ? [] : alert.imei.split(',');
    let arrayNotificationSystem = alert.sistema_notificacion.split(',');
    let notificacion_system =
      arrayNotificationSystem[2].toLowerCase() === 'true';
    let emails =
      alert.notificacion_direcion_email == ''
        ? []
        : alert.notificacion_direcion_email.split(',');
    let notificacion_email = alert.notificacion_email.toLowerCase() === 'true';
    this.disabledEventSoundActive = !notificacion_system;
    this.disabledEmail = !notificacion_email;
    let activo = alert.activo === 'true' ? true : false;

    let notificacion_whatsapp =
      alert.notificacion_whatsapp.toLowerCase() === 'true';
    this.disabledWhatsapp = !notificacion_whatsapp;

    let whatsapps;
    if (
      alert.notificacion_whatsapp_lista == null ||
      alert.notificacion_whatsapp_lista == ''
    ) {
      whatsapps = [];
    } else {
      whatsapps = alert.notificacion_whatsapp_lista.split(',');
    }

    let ventana_emergente = alert.ventana_emergente.toLowerCase() === 'true';
    let evaluation = alert.bol_evaluation;

    this.alertForm = this.formBuilder.group({
      vehicles: [this.vehiclesSelected, [Validators.required]],
      // geocercas: [[]],
      // geocircles: [[]],
      tipoAlerta: [alert.tipo, [Validators.required]],
      chkEventoActivado: [activo],
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
      eventType: [this.type],
      id: [alert.id],
      chkwhatsapp: [notificacion_whatsapp],
      lista_whatsapp: [whatsapps],
      whatsapp: [
        { value: '', disabled: this.disabledWhatsapp },
        [Validators.required],
      ],
      chkVentanaEmergente: [ventana_emergente],
      chkEvaluation: [evaluation],
    });

    this.loading = false;
  }

  public async loadData() {
    this.setDataVehicles();

    /* console.log('obtengo el id ' + this.alertForm.value.tipoAlerta); */

    this.events = await this.alertService.getEventsByType(this.type);
    console.log(this.events);

    const tipoAlerta = this.alertForm.value.tipoAlerta;
    console.log('Tipo de alerta seleccionado:', tipoAlerta);

    if (tipoAlerta) {
      this.alertSelected = alert;
      console.log('El evento es de ' + tipoAlerta);

      // Obtén todos los elementos de la lista de sonidos hasta el id 27
      let sonidosObtenidos = this.alertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (tipoAlerta == 'Fatiga Extrema') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 34
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Anticolisión Frontal') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 29
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Riesgo de Colisión con Peatones') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 39
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'No Rostro') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 37
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Desvío de Carril Hacia la Izquierda') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 31
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Desvío de Carril Hacia la Derecha') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 30
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Posible Fatiga') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 38
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Distracción') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 32
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      }

      if (sonidosObtenidos.length > 0) {
        console.log('Sonidos obtenidos:', sonidosObtenidos);
        this.listaSonidos = sonidosObtenidos;
      } else {
        console.log(
          'No se encontraron sonidos para la alerta seleccionada o la función no devuelve un array.'
        );
      }
    } else {
      this.listaSonidos = this.alertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (this.listaSonidos.length > 0) {
        console.log('Sonidos obtenidos:', this.listaSonidos);
      } else {
        console.log('No se encontraron sonidos para la alerta seleccionada.');
      }
    }



    this.alertForm.patchValue({
      tipoAlerta: this.obtenerTipoAlerta(this.alertForm.value.tipoAlerta ?? ''),
    });
    this.loadingEventSelectInput = false;

    this.loadingAlertDropdownReady = true;
    this.hideLoadingSpinner();
  }

  actualizarSonidos() {
    const tipoAlerta = this.alertForm.value.tipoAlerta;
    console.log('Tipo de alerta seleccionado:', tipoAlerta);

    if (tipoAlerta) {
      this.alertSelected = alert;
      console.log('El evento es de ' + tipoAlerta);

      // Obtén todos los elementos de la lista de sonidos hasta el id 27
      let sonidosObtenidos = this.alertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (tipoAlerta == 'Fatiga Extrema') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 34
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Anticolisión Frontal') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 29
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Riesgo de Colisión con Peatones') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 39
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'No Rostro') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 37
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Desvío de Carril Hacia la Izquierda') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 31
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Desvío de Carril Hacia la Derecha') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 30
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Posible Fatiga') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 38
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (tipoAlerta == 'Distracción') {
        const vozPersonalizada = this.alertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 32
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      }

      if (sonidosObtenidos.length > 0) {
        console.log('Sonidos obtenidos:', sonidosObtenidos);
        this.listaSonidos = sonidosObtenidos;
      } else {
        console.log(
          'No se encontraron sonidos para la alerta seleccionada o la función no devuelve un array.'
        );
      }
    } else {
      this.listaSonidos = this.alertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (this.listaSonidos.length > 0) {
        console.log('Sonidos obtenidos:', this.listaSonidos);
      } else {
        console.log('No se encontraron sonidos para la alerta seleccionada.');
      }
    }
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
        audioPromise
          .then(() => {
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
      this.alertForm.value.sonido = 'sonidos/globales/alarm8.mp3';
    }

    if (
      this.alertForm.value.chkCorreo &&
      this.alertForm.value.lista_emails.length == 0
    ) {
      Swal.fire('Error', 'Debe ingresar un correo', 'warning');
      return;
    }

    if (
      this.alertForm.value.chkwhatsapp &&
      this.alertForm.value.lista_whatsapp.length == 0
    ) {
      Swal.fire('Error', 'Debe ingresar un número', 'warning');
      return;
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
          this.alertService.getAll();
          this.clickShowPanel();
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

  clickShowPanel(): void {
    $('#panelMonitoreo').show('slow');
    if (this.type == 'security') {
      this.panelService.nombreComponente = 'ALERTS-SECURITY';
      this.panelService.nombreCabecera = 'Alertas Seguridad Vehicular';
    } else if (this.type == 'mobile') {
      this.panelService.nombreComponente = 'ALERTS-MOBILE';
      this.panelService.nombreCabecera = 'Alertas Solución Móvil';
    } else {
      this.panelService.nombreComponente = 'ALERTS-360';
      this.panelService.nombreCabecera = 'Alertas Fatiga 360';
    }
  }

  hideLoadingSpinner() {
    if (this.loadingAlertDropdownReady && this.loadingVehicleMultiselectReady) {
      this.spinner.hide('loadingAlertData');
    }
  }

  obtenerTipoAlerta(strAlerta: string) {
    //console.log(this.events);
    for (let i = 0; i < this.events.length; i++) {
      if (
        this.prepareString(strAlerta) == this.prepareString(this.events[i].name)
      ) {
        // console.log('Se encontro match');
        return this.events[i].name;
      }
    }
    return strAlerta;
  }

  prepareString(str: string) {
    return str
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w ]/g, '')
      .replace(/  +/g, ' ')
      .trim();
    //return str.toLowerCase().normalize('NFKD').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/  +/g, ' ').trim();
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
          this.alertForm.value.lista_whatsapp.push(
            this.alertForm.value.whatsapp
          );
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

  chkWhatsappHandler() {
    if (this.alertForm.value.chkwhatsapp) {
      this.alertForm.controls['whatsapp'].enable();
    } else {
      this.alertForm.controls['whatsapp'].disable();
    }
  }
}
