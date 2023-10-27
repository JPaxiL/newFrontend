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
export class GeofencesMinimapService {

  public geofences:any = [];
  public nombreComponente:string = "LISTAR";

  public idGeocercaEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  tblDataGeo: any = [];
  tblDataGeoFiltered: any = [];
  initializingGeofences: boolean = false;
  eyeInputSwitch: boolean = true;
  tagNamesEyeState: boolean = true;
  geofenceCounters: any = {
    visible: 0,
    hidden: 0,
  }
  geofenceTagCounters: any = {
    visible: 0,
    hidden: 0,
  }

  tooltipBackgroundTransparent: boolean = true;
  defaultTagNameFontSize = 10;
  defaultTagNameColor = '#000000';
  defaultTagNameBackground = 'inherit'

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

  //Se llama desde /app/map/components/map-view/map-view.component.ts
  public async initialize() {
    await this.getUserPrivileges();
    await this.getAll();
  }
  
  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/zone`).toPromise()
    .then(response => {
      this.geofences = response.data;
      this.initializingGeofences = true;
      this.attemptToHideSpinner();
      this.ready.emit(true);
    });
  }

  public drawGeofencesOnMap(geofences:any){
    for (let i = 0; i < geofences.length; i++) {

      geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(geofences[i].geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: geofences[i].zone_color,
      });

      //console.log("centro de = "+this.geofences[i].zone_name);
      //console.log(centerPoligon);
      var centerPoligon = geofences[i].geo_elemento.getBounds().getCenter();

      let bg_color = this.tooltipBackgroundTransparent? this.defaultTagNameBackground: this.minimapUtils.hexToRGBA(geofences[i].zone_color);
      let txt_color = this.tooltipBackgroundTransparent? (geofences[i].tag_name_color == ''? this.defaultTagNameColor: geofences[i].tag_name_color): this.minimapUtils.hexToRGBA(geofences[i].zone_color);
      let font_size = (geofences[i].tag_name_font_size == 0? this.defaultTagNameFontSize: geofences[i].tag_name_font_size) + 'px';

      //this.geofences[i].marker_name = L.marker(centerPoligon).addTo(this.mapService.map);
      geofences[i].marker_name = L.circleMarker(centerPoligon, {
        // pane: 'markers1',
        "radius": 0,
        "fillColor": "#000",//color,
        "fillOpacity": 1,
        "color": "#000",//color,
        "weight": 1,
        "opacity": 1

      }).bindTooltip(
          // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
          // '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geofences[i].zone_color+';">'+this.geofences[i].zone_name+'</b>',
          '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+geofences[i].zone_name+'</b>',
          { permanent: true,
            // offset: [-100, 0],
            direction: 'center',
            className: 'leaflet-tooltip-own geofence-tooltip',
          });
    }

    return this.sortGeofencesBySize(geofences);
  }
  /* Movido a minimap-service.service
  public bindMouseEvents(geofence: any, map:any){
    geofence.geo_elemento.on('mouseover', () => {
      //this.sortGeofencesBySize(this.geofences);
      //console.log(`Mouseover event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
      if(geofence.zone_name_visible != 'true'){
        //console.log('Mostrar tooltip');
        geofence.marker_name.addTo(map);
      }
      //console.log(geofence.geo_elemento.getLatLngs());
      //console.log(L.GeometryUtil.geodesicArea((geofence.geo_elemento.getLatLngs()[0])));
    });
    geofence.geo_elemento.on('mouseout', () => {
      //console.log(`MouseOUT event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
      if(geofence.zone_name_visible != 'true'){
        //console.log('Eliminar tooltip');
        map.removeLayer(geofence.marker_name);
      }
    });
  }*/

  public sortGeofencesBySize(geofences: any){
    //console.log('Sorting...');
    geofences.sort((a: any, b: any) => {
      if( L.GeometryUtil.geodesicArea((a.geo_elemento.getLatLngs()[0])) > L.GeometryUtil.geodesicArea((b.geo_elemento.getLatLngs()[0])) ){
        return -1;
      }
      if( L.GeometryUtil.geodesicArea((a.geo_elemento.getLatLngs()[0])) < L.GeometryUtil.geodesicArea((b.geo_elemento.getLatLngs()[0])) ){
        return 1;
      }
      return 0;
    });
    /* this.geofences.forEach((geofence:any) => {
      console.log('Size de ' + geofence.zone_name, L.GeometryUtil.geodesicArea((geofence.geo_elemento.getLatLngs()[0])));
    }); */
    //console.log('Sorted geofences by size: ', this.geofences);
    return geofences;
  }

  public getData() {
    console.log("[GEOFENCES] retornando datos: ", this.geofences);
    let geof = this.initializeTable([...this.geofences]);
    geof = this.drawGeofencesOnMap(geof);
    console.log('Geocercas Cargadas');
    return geof;
  }

  public getTableData(){
    return this.tblDataGeo;
  }

  initializeTable(geofences: any, newGeofenceId?: number) {
    for(let i = 0; i < geofences.length; i++){
      if(geofences[i].id != newGeofenceId){
        geofences[i].zone_name_visible_bol = (geofences[i].zone_name_visible === 'true');
      } else {
        geofences[i].zone_name_visible_bol = true;
      }
    }
    return geofences;
  }

  async getUserPrivileges(){
    console.log('(Geofences Service) Esperando privliegios...');
    if(!this.userDataService.userDataInitialized){
      console.log('(Geofences Service) User Data no está listo. Subscribiendo para obtener privilegios...');
      this.userDataService.geofencesPrivileges.subscribe({
        next: (result: boolean) => {
          if(result){
            this.verifyPrivileges();
          }
        },
        error: (errMsg: any) => {
          console.log('(Geofences Service) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(Geofences Service) User Data está listo. Obteniendo privilegios...');
      this.verifyPrivileges();
    }
    
  }
  

  attemptToHideSpinner(){
    console.log('Attempt to hide Geofences Spinner: ', { 
      isTableReady: this.initializingGeofences, 
      isUserDataReady: this.initializingUserPrivleges } );
    if(this.initializingGeofences && this.initializingUserPrivleges){
      this.spinner.hide('loadingGeofencesSpinner');
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
    console.log('(Geofences Service) Privilegios obtenidos...');
  }

  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

}
