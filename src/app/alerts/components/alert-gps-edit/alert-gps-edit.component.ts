import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { PanelService } from 'src/app/panel/services/panel.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-alert-gps-edit',
  templateUrl: './alert-gps-edit.component.html',
  styleUrls: ['./alert-gps-edit.component.scss']
})
export class AlertGpsEditComponent implements OnInit {

  options = new Array(
    { id:'ALERTS-GPS', name:"Alertas GPS"},
  );

  public alertForm!: FormGroup;
  public events:any = [];
  public loading:boolean = true;
  public vehicles:Select2Data = [];
  public disabledEventSoundActive = true;
  public disabledEmail = true;
  public vehiclesSelected:string[] = [];
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

  constructor(
    private alertService: AlertService,
    private VehicleService : VehicleService,
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
    let notificacion_system = (arrayNotificationSystem[2].toLowerCase() === 'true');
    let emails = alert.notificacion_direcion_email == ''? []: alert.notificacion_direcion_email.split(',');
    let notificacion_email = (alert.notificacion_email.toLowerCase() === 'true')
    this.disabledEventSoundActive = !notificacion_system;
    this.disabledEmail = !notificacion_email;

    this.alertForm = this.formBuilder.group({
      vehicles: [this.vehiclesSelected,[Validators.required]],
      // geocercas: [[]],
      // geocircles: [[]],
      tipoAlerta: [alert.tipo,[Validators.required]],
      chkEventoActivado: [alert.activo],
      chkSonido: [notificacion_system],
      chkCorreo: [notificacion_email],
      sonido: [{value:`sonidos/${arrayNotificationSystem[3]}`, disabled: this.disabledEventSoundActive}],
      nombre:  [alert.nombre],
      lista_emails: [emails],
      fecha_desde: [''],
      fecha_hasta: [''],
      email: [{value: '', disabled:this.disabledEmail},[Validators.required, Validators.email]],
      eventType: ['gps'],
      id:[alert.id]
    });


    this.loading = false;
  }

  public async loadData(){
    this.setDataVehicles();
    this.events = await this.alertService.getEventsByType('gps');
    this.loadingEventSelectInput = false;

    this.loadingAlertDropdownReady = true;
    this.hideLoadingSpinner();
  }

  setDataVehicles(){
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map( (vehicle:any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.name
      }
    });

    this.loadingVehicleMultiselectReady = true;
    this.hideLoadingSpinner();
  }

  playAudio(){

  }

  changeDisabled(){
    if(this.alertForm.value.chkSonido){
      this.alertForm.controls['sonido'].enable();
    } else{
      this.alertForm.controls['sonido'].disable();
    }
  }

  chkEmailHandler(){
    if(this.alertForm.value.chkCorreo){
      this.alertForm.controls['email'].enable();
    } else {
      this.alertForm.controls['email'].disable();
    }
  }

  addEmail(){
    if(this.alertForm.value.chkCorreo){
      if(this.validateEmail(this.alertForm.value.email)){
        if(!this.isInArray(this.alertForm.value.email, this.alertForm.value.lista_emails)){
          this.alertForm.value.lista_emails.push(this.alertForm.value.email);
          this.alertForm.controls.email.reset();
          //console.log('Lista Emails', this.alertForm.value.lista_emails);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'El email ingresado ya existe.',
            icon: 'warning',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Debe ingresar un email válido.',
          icon: 'warning',
        });
      }
    }
  }

  restEmail(index: any){
    this.alertForm.value.lista_emails.splice(index, 1);
  }

  validateEmail(email: any) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isInArray(value: any, array:any[]) {
    return array.indexOf(value) > -1;
  }

  onSubmit(event: any){

    event.preventDefault();
    this.alertForm.value.vehiculos = JSON.stringify(this.alertForm.value.vehicles);

    if(typeof this.alertForm.value.sonido == "undefined"){
      this.alertForm.value.sonido =  'sonidos/alarm8.mp3';
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
            preConfirm:async () => {
              const res = await this.alertService.edit(this.alertForm.value);
              this.clickShowPanel('ALERTS-GPS');
            }
        }).then(data => {
          if(data.isConfirmed){
            Swal.fire(
              'Actualizado',
              'Los datos se actualizaron correctamente!!',
              'success'
            );
          }
        });
    } else {
      Swal.fire(
            'Error',
            'Debe seleccionar un vehículo',
            'warning'
        );
    }
  }

  clickShowPanel( nomComponent:string ): void {

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

}
