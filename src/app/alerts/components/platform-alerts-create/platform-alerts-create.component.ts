import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Select2Data } from 'ng-select2-component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { PanelService } from 'src/app/panel/services/panel.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';

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
  public geocircles: Select2Data = [];

  public disabledEventSoundActive = false;
  public disabledEmail = false;
  public expirationDate = true;
  public showInfraccion = false;
  public showTiempoLimite = false;
  public showFechaCaducidad = true;
  public showGeocercas = true;
  public disabledTimeLimit = true;

  constructor(
    private AlertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    private geofencesService: GeofencesService
  ) {}

  ngOnInit(): void {
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
      chkCorreo: [true],
      sonido: [
        {
          value: 'sonidos/alarm8.mp3',
          disabled: this.disabledEventSoundActive,
        },
      ],
      nombre: [''],
      lista_emails: [[]],
      fecha_desde: [dateCurrent],
      fecha_hasta: [dateCurrent],
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
    });
    this.loading = false;
    this.loadData();
  }

  public async loadData() {
    this.events = await this.AlertService.getEventsByType('platform');
    this.setDataVehicles();
    this.setDataGeofences();
  }

  setDataVehicles() {
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map((vehicle: any) => {
      return {
        value: { IMEI: vehicle.IMEI, name: vehicle.name },
        label: vehicle.name,
        data: { color: 'white', name: vehicle.name },
      };
    });
  }

  setDataGeofences() {
    let geocercas = this.geofencesService.getData();
    this.geocercas = geocercas.map((geocerca: any) => {
      return {
        value: { id: geocerca.id, name: geocerca.zone_name },
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
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          await this.AlertService.create(this.alertForm.value);
          this.clickShowPanel('ALERTS-PLATFORMS');
        },
      }).then(function () {
        Swal.fire(
          'Datos guardados',
          'Los datos se guardaron correctamente!!',
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
