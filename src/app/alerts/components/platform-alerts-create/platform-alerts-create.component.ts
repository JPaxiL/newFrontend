import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Select2Data, Select2Option } from 'ng-select2-component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { PanelService } from 'src/app/panel/services/panel.service';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-platform-alerts-create',
  templateUrl: './platform-alerts-create.component.html',
  styleUrls: ['./platform-alerts-create.component.scss'],
})
export class PlatformAlertsCreateComponent implements OnInit {
  options = new Array({ id: 'ALERTS-PLATFORMS', name: 'Alertas Plataforma' });

  public alertForm!: FormGroup;
  public events: any = [];

  public loading: boolean = true;

  public vehicles: Select2Data = [];
  public geocercas: Select2Data = [];
  public geocercasFiltradas: Select2Data = [];
  public geocircles: Select2Data = [];

  public disabledEventSoundActive = false;
  public disabledEmail = true;
  public expirationDate = true;
  public showInfraccion = false;
  public showInfraccionGeocerca = false;
  public showTiempoLimite = false;
  public showFechaCaducidad = true;
  public showGeocercas = true;
  public disabledTimeLimit = true;
  loadingEventSelectInput: boolean = true;
  alertSelected: any;
  public disabledWhatsapp = true;

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
  loadingGeofencesMultiselectReady: boolean = false;

  timeFormatOptions = [
    { label: 'segundos', value: 'S' },
    { label: 'minutos', value: 'M' },
    { label: 'horas', value: 'H' },
  ];

  fijarTiempoOptions = [
    { label: '10 Seg.', value: 10 },
    { label: '30 Seg.', value: 30 },
    { label: '1 Min.', value: 60 },
    { label: '2 Min.', value: 120 },
  ];

  booleanOptionsAtencionEventos = [
    { label: 'Activado', value: true },
    { label: 'Desactivado', value: false },
  ];

  constructor(
    private AlertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private geofencesService: GeofencesService,
    private spinner: NgxSpinnerService
  ) {
    this.listaSonidos = [...this.AlertService.listaSonidos];
  }

  ngOnInit(): void {
    this.spinner.show('loadingAlertData');
    let dateCurrent = {
      year: moment().year(),
      month: moment().month() + 1,
      day: moment().date(),
    };

    this.alertForm = this.formBuilder.group({
      vehicles: ['', [Validators.required]],
      geocercas: [[]],
      geocercascirculares: [[]],
      tipoAlerta: ['', [Validators.required]],
      chkEventoActivado: [true],
      chkSonido: [true],
      chkCorreo: [false],
      sonido: [
        {
          value: 'sonidos/alarm8.mp3',
          disabled: this.disabledEventSoundActive,
        },
      ],
      nombre: [''],
      lista_emails: [[]],
      //fecha_desde: [dateCurrent],
      //fecha_hasta: [dateCurrent],
      email: [
        { value: '', disabled: this.disabledEmail },
        [Validators.required, Validators.email],
      ],
      eventType: ['platform'],
      chkCaducidad: [false],
      chkDuracionParada: [false],
      duracion_parada: [0],
      duracion_formato_parada: [''],
      chkFijarTiempo: [false],
      tiempo_limite_infraccion: [
        { value: '', disabled: this.disabledTimeLimit },
      ],
      chkFijarLimiteVelocidad: [false],
      velocidad_limite_infraccion: [{ value: '', disabled: true }],
      chkwhatsapp: [false],
      lista_whatsapp: [[]],
      whatsapp: [
        { value: '', disabled: this.disabledWhatsapp },
        [Validators.required],
      ],
      chkVentanaEmergente: [false],
      chkEvaluation: [false],
    });
    this.loading = false;
    this.loadData();
  }

  public async loadData() {
    this.events = await this.AlertService.getEventsByType('platform');
    console.log('EVENTSSS:::::', this.events);

    this.loadingEventSelectInput = false;
    this.setDataVehicles();
    this.setDataGeofences();

    this.loadingAlertDropdownReady = true;
    this.hideLoadingSpinner();
  }

  changeVehicles(event: any) {
    console.log('event::::', event);
    const operations = new Set();
    this.alertForm.value.vehicles.forEach((objeto: any) => {
      const vh = this.vehicles.find((vh: any) => vh.value == objeto);
      console.log('vh:', vh);
      operations.add(vh?.templateId);
    });
    console.log('OPERATIONS::::', operations);
    this.geocercasFiltradas = this.geocercas.filter((geofence) =>
      operations.has(geofence.templateId)
    );
    console.log('geocercasFiltradas::::', this.geocercasFiltradas.length);
  }
  setDataVehicles() {
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map((vehicle: any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.name,
        templateId: vehicle.idoperation,
      };
    });

    this.loadingVehicleMultiselectReady = true;
    this.hideLoadingSpinner();
  }

  setDataGeofences() {
    let geocercas = this.geofencesService.getData();
    this.geocercas = geocercas.map((geocerca: any) => {
      return {
        value: geocerca.id,
        label: geocerca.zone_name,
        templateId: geocerca.idoperation,
      };
    });
    this.geocercasFiltradas = this.geocercas;
    this.loadingGeofencesMultiselectReady = true;
    this.hideLoadingSpinner();
  }

  restEmail(index: any) {
    this.alertForm.value.lista_emails.splice(index, 1);
  }

  clickShowPanel(nomComponent: string): void {
    $('#panelMonitoreo').show('slow');
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item) => item.id == nomComponent);
    this.panelService.nombreCabecera = item[0].name;
  }

  changeDisabled() {
    if (this.alertForm.value.chkSonido) {
      this.alertForm.controls['sonido'].enable();
    } else {
      this.alertForm.controls['sonido'].disable();
    }
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

  onSubmit(event: any) {
    event.preventDefault();

    this.alertForm.value.vehiculos = JSON.stringify(
      this.alertForm.value.vehicles
    );
    this.alertForm.value.vehicles = null;
    this.alertForm.value.geocercas = JSON.stringify(
      this.alertForm.value.geocercas
    );
    this.alertForm.value.geocercascirculares = JSON.stringify(
      this.alertForm.value.geocercascirculares
    );
    /*this.alertForm.value.fecha_desde = this.setDate(
      this.alertForm.value.fecha_desde
    );
    this.alertForm.value.fecha_hasta = this.setDate(
      this.alertForm.value.fecha_hasta
    );*/

    if (this.alertForm.value.duracion_formato_parada == '') {
      this.alertForm.value.duracion_formato_parada = 'S';
    }

    if (typeof this.alertForm.value.tiempo_limite_infraccion == 'undefined') {
      this.alertForm.value.tiempo_limite_infraccion = 0;
    }

    if (typeof this.alertForm.value.sonido == 'undefined') {
      this.alertForm.value.sonido = 'sonidos/alarm8.mp3';
    }

    if (
      typeof this.alertForm.value.velocidad_limite_infraccion == 'undefined'
    ) {
      this.alertForm.value.velocidad_limite_infraccion = 0;
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

    if (this.alertForm.value.vehiculos.length != 0) {
      console.log('ANTES DE GUARDAR: ', this.alertForm.value);
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
          await this.AlertService.create(this.alertForm.value);
          this.AlertService.getAll();
          this.clickShowPanel('ALERTS-PLATFORMS');
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
            allowOutsideClick: false,
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Debe ingresar un email válido.',
          icon: 'warning',
          allowOutsideClick: false,
        });
      }
    }
  }

  validateEmail(email: any) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isInArray(value: any, array: any[]) {
    return array.indexOf(value) > -1;
  }

  changeDisabledExpirationDate($event: any) {
    this.expirationDate = !this.expirationDate;
  }

  setDate(date: any) {
    return moment({
      year: date.year,
      month: date.month - 1,
      day: date.day,
    })
      .format('YYYY-MM-DD')
      .toString();
  }

  changeAlertType() {
    console.log("cambioalerta",this.alertForm.value.tipoAlerta);
    const alert = this.events.find(
      (event: any) =>
        event.id.toString() === this.alertForm.value.tipoAlerta.toString()
    );
    this.alertSelected = alert;
    /* console.log('alerttt', alert); */

    // INICIO SONIDOS PERSONALIZADOS

    if (alert) {
      this.alertSelected = alert;
      console.log('alerttt', alert);

      // Obtén todos los elementos de la lista de sonidos hasta el id 27
      let sonidosObtenidos = this.AlertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 26
      );

      if (alert.name === 'Infracción') {
        const vozPersonalizada = this.AlertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 35
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (alert.name === 'Exceso de Velocidad') {
        const vozPersonalizada = this.AlertService.listaSonidos.find(
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
      this.listaSonidos = this.AlertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 26
      );

      if (this.listaSonidos.length > 0) {
        console.log('Sonidos obtenidos:', this.listaSonidos);
      } else {
        console.log('No se encontraron sonidos para la alerta seleccionada.');
      }
    }

    // FIN SONIDOS PERSONALIZADOS

    this.alertForm.value.velocidad_limite_infraccion = 0;
    if (this.alertSelected.slug == 'infraccion') {
      this.alertForm.controls['velocidad_limite_infraccion'].enable();
      this.alertForm.value.chkFijarLimiteVelocidad = [true];
    } else {
      this.alertForm.controls['velocidad_limite_infraccion'].disable();
    }
    switch (alert.slug) {
      case 'zona-de-entrada':
      case 'zona-de-salida':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = false;
        this.showGeocercas = true;
        this.showInfraccion = false;
        this.showInfraccionGeocerca = false;
        break;

      case 'tiempo-estadio-zona':
      case 'parada-en-zona-no-autorizada':
        this.showTiempoLimite = true;
        this.showFechaCaducidad = false;
        this.showGeocercas = true;
        this.showInfraccion = false;
        this.showInfraccionGeocerca = false;
        break;
      case 'infraccion':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = false;
        this.showGeocercas = false;
        this.showInfraccion = true;
        this.showInfraccionGeocerca = false;
        break;

      case 'infraccion-geocerca':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = false;
        this.showGeocercas = true;
        this.showInfraccion = false;
        this.showInfraccionGeocerca = true;
        break;
      case 'exceso-velocidad':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = false;
        this.showGeocercas = true;
        this.showInfraccion = false;
        this.showInfraccionGeocerca = false;
        break;
      default:
        break;
    }
  }

  resetForm() {
    this.alertForm.reset();
  }
  changechkFijarTiempo() {
    if (this.alertForm.value.chkFijarTiempo) {
      this.alertForm.controls['tiempo_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].disable();
    } else {
      this.alertForm.controls['tiempo_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].enable();
    }
  }

  changechkFijarLimiteVelocidad() {
    if (this.alertForm.value.chkFijarLimiteVelocidad) {
      this.alertForm.controls['velocidad_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarTiempo'].disable();
    } else {
      this.alertForm.controls['velocidad_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarTiempo'].enable();
    }
  }

  hideLoadingSpinner() {
    if (
      this.loadingAlertDropdownReady &&
      this.loadingVehicleMultiselectReady &&
      this.loadingGeofencesMultiselectReady
    ) {
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
