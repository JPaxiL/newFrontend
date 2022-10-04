import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class SubcuentasService {

  public subUsers:any = [];
  public nombreComponente:string = "LISTAR";

  public idSubUserEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataSubUser: any = [];
  initializingSubUser: boolean = false;

  modalActive:boolean = false;


  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
  ) { }


  public async initialize() {
    await this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){

    // Route::post('/subUsersData', [SubUserController::class, 'getSubUsers']); // Datos de Sub usuarios usuario en Cpanel.

    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/subUsersData`).toPromise()
    .then(response => {

      console.log(response);

      this.subUsers = response;
      this.initializeTable();

      // for (let i = 0; i < this.geofences.length; i++) {
      //   //const element = this.geofences[i];

      //   this.geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(this.geofences[i].geo_coordenadas).coordinates[0] ), {
      //     weight: 3,
      //     fill: true,
      //     color: this.geofences[i].zone_color //'#000000'
      //   });

      //   if (this.geofences[i].zone_visible == "true") {
      //     this.geofences[i].geo_elemento.addTo(this.mapService.map);
      //   }

      //   var centerPoligon = this.geofences[i].geo_elemento.getBounds().getCenter();


        // this.geofences[i].marker_name = L.circleMarker(centerPoligon, {
        //   // pane: 'markers1',
        //   "radius": 0,
        //   "fillColor": "#000",//color,
        //   "fillOpacity": 1,
        //   "color": "#000",//color,
        //   "weight": 1,
        //   "opacity": 1

        // }).bindTooltip(
        //     '<b class="" style="background-color: '+ this.mapService.hexToRGBA(this.geofences[i].zone_color) +'; color : '+ this.mapService.getContrastYIQ(this.geofences[i].zone_color) +';">'+this.geofences[i].zone_name+'</b>',
        //     { permanent: true,
        //       // offset: [-100, 0],
        //       direction: 'center',
        //       className: 'leaflet-tooltip-own',
        //     });

        // if (this.geofences[i].zone_name_visible == "true") {
        //   this.geofences[i].marker_name.addTo(this.mapService.map);
        // }




      // }
      // this.updateGeoCounters();
      // this.eyeInputSwitch = this.geofenceCounters.visible != 0;
      // console.log('Geocercas Cargadas');
      // this.initializingGeofences = true;

      console.log('Sub cuentas Cargadas');
      this.initializingSubUser = true;

    });
  }

  initializeTable(newGeofenceId?: number) {
    this.tblDataSubUser = [];
    console.log('SubUsers: ', this.subUsers);

    for (let i = 0; i < this.subUsers.length; i++) {
      // if(this.geofences[i].id != newGeofenceId){
      //   this.geofences[i].zone_name_visible_bol = (this.geofences[i].zone_name_visible === 'true');
      // } else {
      //   this.geofences[i].zone_name_visible_bol = true;
      // }
      this.tblDataSubUser.push({trama:this.subUsers[i]});
    }
    this.spinner.hide('loadingSubcuentas');

    // this.spinner.hide('loadingGeofencesSpinner');
    // // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

  }

}
