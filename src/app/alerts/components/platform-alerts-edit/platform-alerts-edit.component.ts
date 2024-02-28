import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-platform-alerts-edit',
  templateUrl: './platform-alerts-edit.component.html',
  styleUrls: ['./platform-alerts-edit.component.scss'],
})
export class PlatformAlertsEditComponent implements OnInit {
  options = new Array({ id: 'ALERTS-PLATFORMS', name: 'Alertas Plataforma' });

  public alertForm!: FormGroup;
  public events: any = [];

  public loading: boolean = true;

  public vehicles: Select2Data = [];
  public geocercas: Select2Data = [];
  public geocircles: Select2Data = [];

  public disabledEventSoundActive = false;
  public disabledEmail = false;
  public expirationDate = true;
  public showInfraccion = false;
  public showInfraccionGeocerca = false;
  public showTiempoLimite = false;
  public showFechaCaducidad = true;
  public showGeocercas = true;
  public disabledTimeLimit = true;
  public disabledSpeed = true;

  public vehiclesSelected: string[] = [];
  public geoSelected: string[] = [];
  overlay = false;
  overlayGeo = false;
  loadingEventSelectInput: boolean = true;
  public disabledWhatsapp = true;
  alertSelected: any;

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

  async ngOnInit() {
    this.spinner.show('loadingAlertData');

    let alert = this.AlertService.getAlertEditData();
    console.log('ALERT::::::', alert);

    //this.vehiclesSelected = alert.imei.split(',');
    //this.geoSelected = alert.valor_verificado.split(',');
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
    this.expirationDate = !alert.bol_fecha_caducidad;
    //let fecha_desde = alert.fecha_desde.split('-').map(Number);
    //let fecha_hasta = alert.fecha_hasta.split('-').map(Number);
    let activo = alert.activo === 'true' ? true : false;

    this.disabledTimeLimit = !alert.bol_fijar_tiempo;
    this.disabledSpeed = !alert.bol_fijar_velocidad;
    /*
    let date_from = {
      year: fecha_desde[0],
      month: fecha_desde[1],
      day: fecha_desde[2],
    };

    let date_to = {
      year: fecha_hasta[0],
      month: fecha_hasta[1],
      day: fecha_hasta[2],
    };
*/
    this.vehiclesSelected = alert.imei == '' ? [] : alert.imei.split(',');
    this.geoSelected =
      alert.valor_verificado == '' ? [] : alert.valor_verificado.split(',');

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

    this.alertForm = this.formBuilder.group({
      vehicles: [this.vehiclesSelected, [Validators.required]],
      geocercas: [this.geoSelected],
      geocircles: [[]],
      tipoAlerta: [alert.event_id, [Validators.required]],
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
      //fecha_desde: [date_from],
      //fecha_hasta: [date_to],
      email: [
        { value: '', disabled: this.disabledEmail },
        [Validators.required, Validators.email],
      ],
      eventType: ['platform'],
      chkCaducidad: [alert.bol_fecha_caducidad],
      duracion_parada: [alert.duracion_parada],
      duracion_formato_parada: [alert.duracion_formato_parada],
      id: [alert.id],
      chkFijarTiempo: [
        { value: alert.bol_fijar_tiempo, disabled: alert.bol_fijar_velocidad },
      ],
      tiempo_limite_infraccion: [
        {
          value: alert.tiempo_limite_infraccion,
          disabled: this.disabledTimeLimit,
        },
      ],
      chkFijarLimiteVelocidad: [
        { value: alert.bol_fijar_velocidad, disabled: alert.bol_fijar_tiempo },
      ],
      velocidad_limite_infraccion: [
        {
          value: alert.velocidad_limite_infraccion,
          disabled: this.disabledSpeed,
        },
      ],
      chkwhatsapp: [notificacion_whatsapp],
      lista_whatsapp: [whatsapps],
      whatsapp: [
        { value: '', disabled: this.disabledWhatsapp },
        [Validators.required],
      ],
      chkVentanaEmergente: [ventana_emergente],
      chkEvaluation: [alert.bol_evaluation],
    });
    console.log('ALERTFORM:::', this.alertForm);
    this.events = await this.AlertService.getEventsByType('platform');
    console.log('Events after Load: ', this.events);
    this.loadData();
    console.log('After load Data:');

    this.chageAlertType();
    console.log('After chageAlertType');

    this.loading = false;
  }

  public loadData() {
    console.log('Call LoadData;;;');

    this.setDataGeofences();
    this.setDataVehicles();
    console.log('after setDataVehicles');

    this.alertForm.patchValue({
      //tipoAlerta: this.obtenerTipoAlerta(this.alertForm.value.tipoAlerta??''),
      tipoAlerta: this.alertForm.value.tipoAlerta,
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

  setDataGeofences() {
    let geocercas = this.geofencesService.getData();
    this.geocercas = geocercas.map((geocerca: any) => {
      return {
        value: String(geocerca.id),
        label: geocerca.zone_name,
      };
    });

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
    this.alertForm.value.geocercas = JSON.stringify(
      this.alertForm.value.geocercas
    );
    // this.alertForm.value.geocercascirculares = JSON.stringify(this.alertForm.value.geocercascirculares);
    /*this.alertForm.value.vehicles = null;
    this.alertForm.value.fecha_desde = this.setDate(
      this.alertForm.value.fecha_desde
    );
    this.alertForm.value.fecha_hasta = this.setDate(
      this.alertForm.value.fecha_hasta
    );*/

    if (this.alertForm.value.duracion_formato_parada == '') {
      this.alertForm.value.duracion_formato_parada = 'S';
    }

    if (typeof this.alertForm.value.tiempo_limite_infraccion == 'undefined') {
      this.alertForm.value.tiempo_limite_infraccion = null;
    }

    if (
      typeof this.alertForm.value.velocidad_limite_infraccion == 'undefined'
    ) {
      this.alertForm.value.velocidad_limite_infraccion = null;
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
          await this.AlertService.edit(this.alertForm.value);
          this.AlertService.getAll();
          this.clickShowPanel('ALERTS-PLATFORMS');
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

  chageAlertType() {
    console.log('tipoAlerta', this.alertForm.value.tipoAlerta);
    console.log(this.alertForm.value.tipoAlerta);
    const alert = this.events.find(
      (event: any) =>
        event.id.toString() === this.alertForm.value.tipoAlerta.toString()
    );
    /*     this.alertSelected = alert;
    console.log("alerttt",alert); */

    // Inicio Alerta Perzonalizada

    if (alert) {
      this.alertSelected = alert;
      console.log('alerttt', alert);

      // Obtén todos los elementos de la lista de sonidos hasta el id 27
      let sonidosObtenidos = this.AlertService.listaSonidos.filter(
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (alert.id === 26) {
        const vozPersonalizada = this.AlertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 36
        );
        if (vozPersonalizada) {
          sonidosObtenidos = [vozPersonalizada, ...sonidosObtenidos];
        }
      } else if (alert.id === 64) {
        const vozPersonalizada = this.AlertService.listaSonidos.find(
          (sonido: { id: any }) => sonido.id === 33
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
        (sonido: { id: any }) => sonido.id <= 27
      );

      if (this.listaSonidos.length > 0) {
        console.log('Sonidos obtenidos:', this.listaSonidos);
      } else {
        console.log('No se encontraron sonidos para la alerta seleccionada.');
      }
    }

    // Fin Alerta Perzonalizada

    if (this.alertSelected.slug == 'infraccion') {
      this.alertForm.controls['velocidad_limite_infraccion'].enable();
    } else {
      this.alertForm.controls['velocidad_limite_infraccion'].disable();
    }
    console.log('selectedAlert: ::: ', this.alertSelected);
    switch (this.alertSelected.slug) {
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

  changechkFijarTiempo() {
    if (this.alertForm.value.chkFijarTiempo) {
      this.alertForm.controls['tiempo_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].disable();
      this.alertForm.value.velocidad_limite_infraccion = null;
    } else {
      this.alertForm.controls['tiempo_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].enable();
      this.alertForm.value.velocidad_limite_infraccion = null;
    }
  }

  changechkFijarLimiteVelocidad() {
    if (this.alertForm.value.chkFijarLimiteVelocidad) {
      this.alertForm.controls['velocidad_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarTiempo'].disable();
      this.alertForm.value.tiempo_limite_infraccion = null;
    } else {
      this.alertForm.controls['velocidad_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarTiempo'].enable();
      this.alertForm.value.tiempo_limite_infraccion = null;
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

  obtenerTipoAlerta(strAlerta: string) {
    console.log('strAlerta', strAlerta);
    for (let i = 0; i < this.events.length; i++) {
      if (
        this.prepareString(strAlerta) == this.prepareString(this.events[i].name)
      ) {
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
