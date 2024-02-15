import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { environment } from 'src/environments/environment';

import * as L from 'leaflet';
import { switchMap } from 'rxjs/operators';
import { MinimapUtilsService } from './minimap-utils.service';
import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CircularGeofencesMinimapService {

  circular_geofences: any[] = []
  nombreComponente:string = "LISTAR";
  action:string = "add";
  idGeocercaEdit:number = 0;

  tblDataGeo: any[] = [];
  tblDataGeoFiltered: any = [];

  showBtnAdd = true;
  showBtnEdit = true;
  initializingUserPrivleges: boolean = false;
  initializingCircularGeofences: boolean = false;
  eyeInputSwitch: boolean = true;
  tagNamesEyeState: boolean = true;
  tooltipBackgroundTransparent: boolean = true;
  defaultTagNameFontSize = 10;
  defaultTagNameColor = '#000000';
  defaultTagNameBackground = 'inherit'

  circularGeofenceCounters: any = {
    visible: 0,
    hidden: 0,
  }

  circularGeofenceTagCounters: any = {
    visible: 0,
    hidden: 0,
  }
  @Output() ready: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient,
              private userDataService: UserDataService,
              public spinner: NgxSpinnerService,
              private minimapUtils: MinimapUtilsService) {
              }

  async initialize(){
    await this.getUserPrivileges();
    await this.getAll();
  }

  async getAll() {
    try {
      const resp = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/circular-zone`).toPromise();
      
      this.circular_geofences = resp.data;
      this.initializingCircularGeofences = true;
      this.attemptToHideSpinner();
      console.log(this.circular_geofences);
      this.ready.emit(true);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  
  initializeTable(circular_geofences:any, newCircularGeofenceId?: number) {
    for(let i = 0; i < circular_geofences.length; i++){
      if(circular_geofences[i].id != newCircularGeofenceId){
        circular_geofences[i].zone_name_visible_bol = (circular_geofences[i].zone_name_visible === true);
      } else {
        circular_geofences[i].zone_name_visible_bol = true;
      }
    }
    return circular_geofences;
  }

  sortGeofencesBySize(){

    this.circular_geofences.sort((a: any, b: any) => {
      if( L.GeometryUtil.geodesicArea((a.geo_elemento.getLatLngs()[0])) > L.GeometryUtil.geodesicArea((b.geo_elemento.getLatLngs()[0])) ){
        return -1;
      }
      if( L.GeometryUtil.geodesicArea((a.geo_elemento.getLatLngs()[0])) < L.GeometryUtil.geodesicArea((b.geo_elemento.getLatLngs()[0])) ){
        return 1;
      }
      return 0;
    });
  }

  drawGeofencesOnMap(circular_geofences: any){
    for (let i = 0; i < this.circular_geofences.length; i++) {
      
      circular_geofences[i].geo_elemento = new L.Circle( this.getCoordenadas(circular_geofences[i].geo_coordenadas), {
        radius: this.getRadius(circular_geofences[i].geo_coordenadas),
        weight: 3,
        fill: circular_geofences[i].zone_no_int_color,
        color: circular_geofences[i].zone_color,
      });

      let bg_color = this.tooltipBackgroundTransparent? this.defaultTagNameBackground: this.minimapUtils.hexToRGBA(circular_geofences[i].zone_color);
      let txt_color = this.tooltipBackgroundTransparent? (circular_geofences[i].tag_name_color == ''? this.defaultTagNameColor: circular_geofences[i].tag_name_color): this.minimapUtils.hexToRGBA(circular_geofences[i].zone_color);
      let font_size = (circular_geofences[i].tag_name_font_size == 0? this.defaultTagNameFontSize: circular_geofences[i].tag_name_font_size) + 'px';

      
      circular_geofences[i].marker_name = L.circleMarker(this.getCoordenadas(circular_geofences[i].geo_coordenadas), {
        
        "radius": 0,
        "fillColor": "#000",//color,
        "fillOpacity": 1,
        "color": "#000",//color,
        "weight": 1,
        "opacity": 1

      }).bindTooltip(
          
          '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+circular_geofences[i].zone_name+'</b>',
          { permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-own',
          });
    }
    return circular_geofences;
  }

  getCoordenadas(data:any){
    //<(-2.98692739333486,-69.43359375),671103.240326455>
    let coo = data.match(/\(([^)]+)\)/)[1];
    let LatLng = coo.split(',');

    return L.latLng(parseFloat(LatLng[0]),parseFloat(LatLng[1]));

  }

  getRadius(data:any){
    //<(-15.6865095725514,-69.697265625),703434.058098874>
    let radius = data.split('),')[1];
    radius = radius.substring(0, radius.length - 1);

    return parseFloat(radius);

  }

  getData() {
    console.log("[CIRCULAR GEOFENCES] retornando datos: ", this.circular_geofences);
    let geof = this.initializeTable([...this.circular_geofences]);
    geof = this.drawGeofencesOnMap(geof);
    return geof;
  }

  getTableData(){
    return this.tblDataGeo;
  }
  
  async getUserPrivileges(){
    console.log('(Circular Geofences Service) Esperando privliegios...');
    if(!this.userDataService.userDataInitialized){
      console.log('(Circular Geofences Service) User Data no está listo. Subscribiendo para obtener privilegios...');
      this.userDataService.geofencesPrivileges.subscribe({
        next: (result: boolean) => {
          if(result){
            this.verifyPrivileges();
          }
        },
        error: (errMsg: any) => {
          console.log('(Circular Geofences Service) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(Circular Geofences Service) User Data está listo. Obteniendo privilegios...');
      this.verifyPrivileges();
    }
    
  }

  verifyPrivileges(){
    if (this.userDataService.userData.privilegios == "subusuario") {
      
      this.showBtnAdd = false;
      this.showBtnEdit = false;
    }
    this.initializingUserPrivleges = true;
    this.attemptToHideSpinner();
    // console.log('(Circular Geofences Service) Privilegios obtenidos...');
  }

  attemptToHideSpinner(){
    // console.log('Attempt to hide Geofences Spinner: ', { 
    //   isTableReady: this.initializingCircularGeofences, 
    //   isUserDataReady: this.initializingUserPrivleges } );
    if(this.initializingCircularGeofences && this.initializingUserPrivleges){
      this.spinner.hide('loadingCircularGeofencesSpiner');
    }
  }

  updateGeoCounters(){
    this.circularGeofenceCounters.visible = this.circular_geofences.filter( (circular_geofences: { zone_visible: boolean; }) => circular_geofences.zone_visible == true).length;
    this.circularGeofenceCounters.hidden = this.circular_geofences.length - this.circularGeofenceCounters.visible;
    
  }

  updateGeoTagCounters(){
    this.circularGeofenceTagCounters.visible = this.circular_geofences.filter( (circular_geofences: { zone_name_visible_bol: boolean; }) => circular_geofences.zone_name_visible_bol == true).length;
    this.circularGeofenceTagCounters.hidden = this.circular_geofences.length - this.circularGeofenceTagCounters.visible;
  }

  clearDrawingsOfGeofence(geofence: any,map: any){
    if(geofence.geo_elemento != null && typeof geofence.geo_elemento != 'undefined'
      && geofence.zone_visible == true ){

      map.removeLayer(geofence.geo_elemento);
    }
    if(geofence.marker_name != null && typeof geofence.marker_name != 'undefined'
      && geofence.zone_name_visible == true ){

      map.removeLayer(geofence.marker_name);
    }
  }

  edit(zone: any){
    
    return this.http.put<ResponseInterface>(`${environment.apiUrl}/api/circular-zone/${zone.id}`,zone).pipe(switchMap(({data}) => [data]));
  }

  store(zone: any){
    
    return this.http.post<ResponseInterface>(`${environment.apiUrl}/api/circular-zone`,zone).pipe(switchMap(({data}) => [data]));

  }

  async delete(id: any){
    return await (await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/circular-zone/${id}`).toPromise()).data;
    
  }

}
