import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';

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
  public showTiempoLimite = false;
  public showFechaCaducidad = true;
  public showGeocercas = true;
  public disabledTimeLimit = true;
  public disabledSpeed = true;

  public vehiclesSelected: string[] = [];
  public geoSelected: string[] = [];
  overlay = false;
  overlayGeo = false;

  constructor(
    private AlertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private geofencesService: GeofencesService
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    let alert = this.AlertService.getAlertEditData();

    console.log('typeof alert =======> ', typeof alert.bol_fijar_tiempo);

    this.vehiclesSelected = alert.imei.split(',');
    this.geoSelected = alert.valor_verificado.split(',');
    let arrayNotificationSystem = alert.sistema_notificacion.split(',');
    let notificacion_system =
      arrayNotificationSystem[2].toLowerCase() === 'true';
    let emails = alert.notificacion_direcion_email.split(',');
    let notificacion_email = alert.notificacion_email.toLowerCase() === 'true';
    this.disabledEventSoundActive = !notificacion_system;
    this.disabledEmail = !notificacion_email;
    this.expirationDate = !alert.bol_fecha_caducidad;
    let fecha_desde = alert.fecha_desde.split('-').map(Number);
    let fecha_hasta = alert.fecha_hasta.split('-').map(Number);

    this.disabledTimeLimit = !alert.bol_fijar_tiempo;
    this.disabledSpeed = !alert.bol_fijar_velocidad;

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

    this.alertForm = this.formBuilder.group({
      vehicles: [this.vehiclesSelected, [Validators.required]],
      geocercas: [['30037']],
      geocircles: [[]],
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
      fecha_desde: [date_from],
      fecha_hasta: [date_to],
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
    });
    this.loading = false;

    this.chageAlertType();
  }

  public async loadData() {
    this.setDataGeofences();
    this.setDataVehicles();

    this.events = await this.AlertService.getEventsByType('platform');
  }

  async setDataVehicles() {
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map((vehicle: any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.name,
        data: { color: 'white', name: vehicle.name },
      };
    });
  }

  async setDataGeofences() {
    let geocercas = this.geofencesService.getData();
    this.geocercas = geocercas.map((geocerca: any) => {
      return {
        value: String(geocerca.id),
        label: geocerca.zone_name,
        data: { color: 'white', name: geocerca.zone_name },
      };
    });
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

  changeDisabled($event: any) {
    if ($event.target.checked) {
      this.alertForm.controls['sonido'].enable();
    } else {
      this.alertForm.controls['sonido'].disable();
    }
  }

  playAudio() {}

  onSubmit(event: any) {
    //console.log("this.alertForm.value =============> ", moment(this.alertForm.value).format('YYYY MM DD'));

    event.preventDefault();

    this.alertForm.value.vehiculos = JSON.stringify(
      this.alertForm.value.vehicles
    );
    this.alertForm.value.geocercas = JSON.stringify(
      this.alertForm.value.geocercas
    );
    // this.alertForm.value.geocercascirculares = JSON.stringify(this.alertForm.value.geocercascirculares);
    this.alertForm.value.vehicles = null;
    this.alertForm.value.fecha_desde = this.setDate(
      this.alertForm.value.fecha_desde
    );
    this.alertForm.value.fecha_hasta = this.setDate(
      this.alertForm.value.fecha_hasta
    );

    if (this.alertForm.value.duracion_formato_parada == '') {
      this.alertForm.value.duracion_formato_parada = 'S';
    }

    if (typeof this.alertForm.value.tiempo_limite_infraccion == 'undefined') {
      this.alertForm.value.tiempo_limite_infraccion = 10;
    }

    if (
      typeof this.alertForm.value.velocidad_limite_infraccion == 'undefined'
    ) {
      this.alertForm.value.velocidad_limite_infraccion = 0;
    }

    if (this.alertForm.value.vehiculos.length != 0) {
      Swal.fire({
        title: 'Desea guardar los cambios?',
        text: 'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          await this.AlertService.edit(this.alertForm.value);
          this.clickShowPanel('ALERTS-PLATFORMS');
        },
      }).then(function () {
        Swal.fire(
          'Actualizado',
          'Los datos se actualizaron correctamente!!',
          'success'
        );
      });
    } else {
      Swal.fire('Error', 'Debe seleccionar un vehículo', 'warning');
    }
  }

  changeDisabledEmail($event: any) {
    if ($event.target.checked) {
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
        }
      } else {
        Swal.fire('Error', 'debe ingresar un email valido.', 'warning');
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
    console.log(this.alertForm.value.tipoAlerta);
    switch (this.alertForm.value.tipoAlerta) {
      case 'Zona de entrada':
      case 'Zona de salida':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = true;
        this.showGeocercas = true;
        this.showInfraccion = false;
        break;

      case 'Tiempo de estadia en zona':
      case 'Parada en zona no autorizada':
        this.showTiempoLimite = true;
        this.showFechaCaducidad = true;
        this.showGeocercas = true;
        this.showInfraccion = false;
        break;
      case 'Infracción':
      case 'Infraccion':
        this.showTiempoLimite = false;
        this.showFechaCaducidad = false;
        this.showGeocercas = false;
        this.showInfraccion = true;
        break;

      default:
        break;
    }
  }

  changechkFijarTiempo($event: any) {
    if ($event.target.checked) {
      this.alertForm.controls['tiempo_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].disable();
    } else {
      this.alertForm.controls['tiempo_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarLimiteVelocidad'].enable();
    }
  }

  changechkFijarLimiteVelocidad($event: any) {
    if ($event.target.checked) {
      this.alertForm.controls['velocidad_limite_infraccion'].enable();
      this.alertForm.controls['chkFijarTiempo'].disable();
    } else {
      this.alertForm.controls['velocidad_limite_infraccion'].disable();
      this.alertForm.controls['chkFijarTiempo'].enable();
    }
  }
}
