import { Component, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { PanelService } from 'src/app/panel/services/panel.service';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/events/services/event.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { GeopointsService } from 'src/app/geopoints/services/geopoints.service';
import { GeofencesService } from 'src/app/geofences/services/geofences.service';
import { CircularGeofencesService } from 'src/app/geofences/services/circular-geofences.service';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  userInfoForm :any = {};

  isUnderConstruction: boolean = true;
  loading : boolean = false;
  
  showEventos: boolean = false;
  showReportes: boolean = false;
  cities = [
    {name: 'New York', code: 'NY', inactive: false},
    {name: 'Rome', code: 'RM', inactive: true},
    {name: 'London', code: 'LDN', inactive: false},
    {name: 'Istanbul', code: 'IST', inactive: true},
    {name: 'Paris', code: 'PRS', inactive: false},
    {name: 'PERU', code: 'PE', inactive: false},
    {name: 'Mexico', code: 'ME', inactive: false},
    {name: 'Paraguay', code: 'Pa', inactive: false},
    {name: 'India', code: 'In', inactive: false},
    {name: 'Turkia', code: 'In', inactive: false},
    {name: 'Japon', code: 'In', inactive: false},
    {name: 'Islandia', code: 'In', inactive: false},
   
  ];
  reports: any;
  events: any;
  
  constructor(       
    private userDataService: UserDataService,
    private panelService: PanelService,
    private http: HttpClient,
    private geopointsService: GeopointsService,
    private vehiclesService: VehicleService,
    private geofencesService: GeofencesService,
    private geoCircularService: CircularGeofencesService,
    private EventService: EventService) {
  }

  async ngOnInit(): Promise<void> {
    this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
    this.initForm();

    //CONTEO DE VEHICULOS
    if(!this.vehiclesService.statusDataVehicle){
      // console.log('ESPERANDO SUSCRIPCION ...');
      this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
      this.vehiclesService.dataCompleted.subscribe( vehicles => {
      // console.log('CARGADA SUSCRIPCION ...');
      this.userInfoForm.vehiclesLenght = vehicles.length;
      this.userDataService.spinner.hide('loadingInfoUser');
      });
    } else {
      // console.log('VEHICLES SERVICE LOADES ...')
      this.userInfoForm.vehiclesLenght = this.vehiclesService.vehicles.length;
      this.userDataService.spinner.hide('loadingInfoUser');
    }

    //CONTEO DE GEOPOINTS
    if(!this.geopointsService.initializingGeopoints){
      // console.log('ESPERANDO SUSCRIPCION GEOPOINTS ...');
      this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
      this.geopointsService.geopointsCompleted.subscribe( geopoints => {
      // console.log('CARGADA SUSCRIPCION GEOPOINTS ...',geopoints);
      this.userInfoForm.geopointsLenght = geopoints.length;
      this.userDataService.spinner.hide('loadingInfoUser');
      });
    } else {
      // console.log('GEOPOINTS DE SERVICE LOADED ...') 
      this.userInfoForm.geopointsLenght = this.geopointsService.geopoints.length;
      this.userDataService.spinner.hide('loadingInfoUser');
    }

    //CONTEO DE GEOCERCAS 
    if(!this.geofencesService.initializingGeofences){
      // console.log('ESPERANDO SUSCRIPCION GEOCERCAS ...');
      this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
      this.geofencesService.dataCompleted.subscribe( geofences => {
      // console.log('CARGADA SUSCRIPCION GEOCERCAS ...',geofences);
      this.userInfoForm.geocercaPoligLenght = geofences.length;
      this.userDataService.spinner.hide('loadingInfoUser');
      });
    } else {
      // console.log('GEOCERCAS DE SERVICE LOADED ...',this.geofencesService.geofences);
      this.userInfoForm.geocercaPoligLenght = this.geofencesService.geofences.length;
      this.userDataService.spinner.hide('loadingInfoUser');
    }

    //CONTEO DE GEOCERCAS CIRCULARES
    if(!this.geoCircularService.initializingCircularGeofences){
      // console.log('ESPERANDO SUSCRIPCION GEOCERCAS ...');
      this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
      this.geoCircularService.dataCompleted.subscribe( circular_geofences => {
      // console.log('CARGADA SUSCRIPCION GEOCERCAS ...',circular_geofences);
      this.userInfoForm.geocercaCircLenght = circular_geofences.length;
      // this.userDataService.spinner.hide('loadingInfoUser');
      });
    } else {
      console.log('GEOCERCAS DE SERVICE LOADED ...',this.geoCircularService.circular_geofences);
      this.userInfoForm.geocercaCircLenght = this.geoCircularService.circular_geofences.length;
      this.userDataService.spinner.hide('loadingInfoUser');
    }

    //CONTEO DE REPORTES
    if (this.userDataService.reportsUserLoaded == false){
      this.userDataService.spinner.show('loadingInfoUser');
      this.userDataService.getReportsForUser().subscribe(
        async (data) => {
          console.log('REPORTES DEL USUARIO OBTENIDOS: 1 vez',data);
          if(data.success){
            this.userDataService.reportsUser = data.data;
            this.reports = this.userDataService.reportsUser;
            this.userDataService.reportsUserLoaded = true;
            this.userInfoForm.reportesLenght = this.reports.length;

          }else{
            this.reports = [];
            console.log('EL USUARIO NO TIENE EVENTOS');
          }
          this.userDataService.spinner.hide('loadingInfoUser');
        },
        (error) => {
          // Maneja los errores si ocurre alguno durante la solicitud
          console.error('Error al obtener los eventos:', error);
        }
      )
    }else{
      this.reports = this.userDataService.reportsUser;
      this.userInfoForm.reportesLenght = this.reports.length;
      this.userDataService.spinner.hide('loadingInfoUser');
    }
    
    //CONTEO DE EVENTOS
    if (this.EventService.eventsUserLoaded == false){
      this.userDataService.spinner.show('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner
      this.EventService.getEventsForUser().subscribe(
        async (data) => {
          // Aquí puedes trabajar con los datos obtenidos
          console.log('EVENTOS DEL USUARIO OBTENIDOS: 1vez', data);
          // Realiza cualquier acción con los datos recibidos
          if (data.success){
            this.userDataService.eventsUser = data.data;
            this.events = this.userDataService.eventsUser;
            this.EventService.eventsUserLoaded = true;
            this.userInfoForm.eventosLenght = this.events.length;
          }else{
            this.events = [];
            console.log('EL USUARIO NO TIENE EVENTOS');
          }
          this.userDataService.spinner.hide('loadingInfoUser');
        },
        (error) => {
          // Maneja los errores si ocurre alguno durante la solicitud
          console.error('Error al obtener los eventos:', error);
        }
      );
    }else{
      this.userDataService.spinner.hide('loadingInfoUser');
      this.events = this.userDataService.eventsUser;
      this.userInfoForm.eventosLenght = this.events.length;

    }
    // this.userDataService.spinner.hide('loadingInfoUser'); // Nombre opcional, puedes usarlo para identificar el spinner

  }

  initForm() {
    this.userInfoForm.changePass = false;
    this.userInfoForm.oldPass = ''; 
    this.userInfoForm.newPass = ''; 
    this.userInfoForm.newPassRepeat = '';
    this.userInfoForm.eventosLenght = '0';
    this.userInfoForm.reportesLenght = '0';
  }

  onClickCancel(){
    this.userInfoForm.oldPass = '';
    this.userInfoForm.newPass = '';
    this.userInfoForm.newPassRepeat = '';
    $("#panelMonitoreo").hide( "slow" );
  }

  onSubmit(){
    // Limpiar el array antes de agregar los datos actualizados
    
    console.log(this.userInfoForm); // Información del formulario general


    // Preparación de la solicitud para enviar datos
    let req = {
      oldPass: this.userInfoForm.oldPass,
      newPass: this.userInfoForm.newPass,
      newCopyPass: this.userInfoForm.newPassRepeat,
    };
    return req;
  }

  confirm(){
    this.loading=true;
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se aplicarán los cambios',
      //icon: 'warning',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        actions: 'w-100',
        cancelButton: 'col-4',
        confirmButton: 'col-4',
      },
      preConfirm: async () => {
        var response:any;
        response = await this.onSubmit();
        this.userDataService.changePasswordUser(response).subscribe(
          (response) => {
            // Manejar la respuesta del servidor si es necesario
            // console.log('Actualización exitosa:', response);
            if (!response.res){
              Swal.fire(
                'Ups',
                response.message,
                'warning'
              );
            }else if (response.res){
              Swal.fire(
                '',
                'Los datos se guardaron correctamente!!',
                'success'
              );
            }
          },
          (error) => {
            // Manejar errores si la actualización falla
            console.error('Error al actualizar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error...',
              'warning'
            );
          }
        );
      },
    }).then((data) => {
      // console.log('testing respuesta...',data);
      this.loading=false;
    });
  }

}
