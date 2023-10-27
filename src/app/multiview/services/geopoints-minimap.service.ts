import { EventEmitter, Injectable, Output } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { MinimapUtilsService } from './minimap-utils.service';

@Injectable({
  providedIn: 'root'
})
export class GeopointsMinimapService {

  initializingGeopoints: boolean = false;
  tblDataGeo = new Array();
  tblDataGeoFiltered: any[] = [];

  eyeInputSwitch: boolean = true;
  tagNamesEyeState: boolean = true;
  geopointCounters: any = {
    visible: 0,
    hidden: 0,
  }
  geopointTagCounters: any = {
    visible: 0,
    hidden: 0,
  }

  public geopoints:any = [];
  public nombreComponente:string = "LISTAR";

  public idGeopointEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  initializingUserPrivleges: boolean = false;
  showBtnAdd = true;
  showBtnEdit = true;

    @Output() ready: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(
    private http: HttpClient,
    public minimapUtils: MinimapUtilsService,
    public spinner: NgxSpinnerService,
    private userDataService: UserDataService,
  ) { 
  }


  public async initialize() {
    //geopointsService SIEMPRE se inicia DESPUES de geofencesService.initialize
    console.log('Geopoints Minimap initializing...');
    await this.getUserPrivileges();
    await this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/point`).toPromise()
    .then(response => {
      this.geopoints = response.data;
      console.log('Geopuntos Cargados');
      this.initializingGeopoints = true;
      this.attemptToHideSpinner();
      this.ready.emit(true);
    });
  }
  drawGeopointsOnMap(geopoints: any){
    for (let i = 0; i < geopoints.length; i++) {
      // //const element = this.geofences[i];

      geopoints[i].geopunto_nombre_visible_bol = (geopoints[i].geopunto_nombre_visible === 'true');
      geopoints[i].geopunto_visible_bol = (geopoints[i].geopunto_visible === 'true');


        var latlng = geopoints[i].geopunto_vertices.split(",")

        const svgIcon = L.divIcon({
          html: this.geopointHTMLMarkerIcon(geopoints[i].geopunto_color),
          className: "",
          iconSize: [24, 41.86],
          iconAnchor: [12, 41.86],
        });

        geopoints[i].geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
          { icon: svgIcon
          });

        

        geopoints[i].marker_name = L.circleMarker([parseFloat(latlng[0]), parseFloat(latlng[1])], {
          // pane: 'markers1',
          "radius": 0,
          "fillColor": "#000",//color,
          "fillOpacity": 1,
          "color": "#000",//color,
          "weight": 1,
          "opacity": 1

        }).bindTooltip(
            /* '<b class="" style="background-color: '+ this.mapService.hexToRGBA(this.geopoints[i].geopunto_color) +'; color: '+ this.mapService.getContrastYIQ(this.geopoints[i].geopunto_color) +';">'+this.geopoints[i].geopunto_name+'</b>', */
            '<b class="" style="background-color: '+ this.minimapUtils.hexToRGBA(geopoints[i].geopunto_color) +';">'+geopoints[i].geopunto_name+'</b>',
            { permanent: true,
              offset: [0, 20],
              direction: 'center',
              className: 'leaflet-tooltip-own geopoint-tooltip',
            });
    }
    return geopoints
  }
  public getData() {
    console.log("[GEOPOINTS] retornando datos: ", this.geopoints);
    let geof = this.initializeTable([...this.geopoints]);
    geof = this.drawGeopointsOnMap(geof);
    return geof;
  }

  public initializeTable(geopoints:any, newGeopointId?: number){
    for (let i = 0; i < geopoints.length; i++) {
      geopoints[i].geopunto_nombre_visible_bol = (geopoints[i].geopunto_nombre_visible === 'true');
      geopoints[i].geopunto_visible_bol = (geopoints[i].geopunto_visible === 'true');
    }
    return geopoints;
  }

  async getUserPrivileges(){
    console.log('(Geopoints Service) Esperando privliegios...');
    if(!this.userDataService.userDataInitialized){
      console.log('(Geopoints Service) User Data no está listo. Subscribiendo para obtener privilegios...');
      this.userDataService.geopointsPrivileges.subscribe({
        next: (result: boolean) => {
          if(result){
            this.verifyPrivileges();
          }
        },
        error: (errMsg: any) => {
          console.log('(Geopoints Service) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(Geopoints Service) User Data está listo. Obteniendo privilegios...');
      this.verifyPrivileges();
    }
    
  }
  

  attemptToHideSpinner(){
    console.log('Attempt to hide Geopoints Spinner: ', { 
      isTableReady: this.initializingGeopoints, 
      isUserDataReady: this.initializingUserPrivleges } );
    if(this.initializingGeopoints && this.initializingUserPrivleges){
      this.spinner.hide('loadingGeopointsSpinner');
    }
  }

  verifyPrivileges(){
    if (this.userDataService.userData.privilegios == "subusuario") {
      // console.log("es sub usuario");
      this.showBtnAdd = false;
      this.showBtnEdit = false;
    } else {
        // console.log("es un usuario normal");
        // this.showBtnAdd = true;
    }
    this.initializingUserPrivleges = true;
    this.attemptToHideSpinner();
    console.log('(Geopoints Service) Privilegios obtenidos...');
  }
  
    //====================================

    public async edit(point: any){
      const response:ResponseInterface = await this.http.put<ResponseInterface>(`${environment.apiUrl}/api/point/${point.geopunto_id}`,point).toPromise();
      return response.data;
    }

    public async store(point: any){
      const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/point`,point).toPromise();
      return response.data;
    }

    public async delete(id: any){
      const response:ResponseInterface = await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/point/${id}`).toPromise();
      return response.data;
    }

  public geopointHTMLMarkerIcon(color: string){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892"><g transform="matrix(1.18559 0 0 1.18559 -965.773 -331.784)"><path d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z" style="fill:`+color+`;"/><circle r="3.035" cy="288.253" cx="823.031" style="fill:#fff"/></g></svg>`;
  }


}