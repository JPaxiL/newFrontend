import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { PanelService } from 'src/app/panel/services/panel.service';

declare var $: any;

@Component({
  selector: 'app-alert-accessories-create',
  templateUrl: './alert-accessories-create.component.html',
  styleUrls: ['./alert-accessories-create.component.scss'],
})
export class AlertAccessoriesCreateComponent implements OnInit {
  options = new Array({ id: 'ALERTS-ACCESSORIES', name: 'Alertas Accesorios' });

  public alertForm!: FormGroup;
  public events: any = [];
  public loading: boolean = true;
  public vehicles: Select2Data = [];
  public disabledEventSoundActive = true;
  public disabledEmail = true;

  constructor(
    private AlertService: AlertService,
    private VehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public panelService: PanelService
  ) {}

  ngOnInit(): void {
    this.alertForm = this.formBuilder.group({
      vehicles: ['', [Validators.required]],
      // geocercas: [[]],
      // geocircles: [[]],
      tipoAlerta: ['', [Validators.required]],
      chkEventoActivado: [true],
      chkSonido: [false],
      chkCorreo: [false],
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
    });
    this.loading = false;
    this.loadData();
  }

  public async loadData() {
    this.setDataVehicles();
    this.events = await this.AlertService.getEventsByType('accessories');
  }

  setDataVehicles() {
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map((vehicle: any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.name,
      };
    });
  }

  playAudio() {}

  changeDisabled($event: any) {
    if ($event.target.checked) {
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

  changeDisabledEmail($event: any) {
    if ($event.target.checked) {
      this.alertForm.controls['email'].enable();
    } else {
      this.alertForm.controls['email'].disable();
    }
  }

  onSubmit(event: any) {
    event.preventDefault();

    this.alertForm.value.vehiculos = JSON.stringify(
      this.alertForm.value.vehicles
    );

    if (typeof this.alertForm.value.sonido == 'undefined') {
      this.alertForm.value.sonido = 'sonidos/alarm8.mp3';
    }

    if (this.alertForm.value.vehicles.length != 0) {
      Swal.fire({
        title: 'Desea guardar los cambios?',
        text: 'Espere un momento...',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
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
}
