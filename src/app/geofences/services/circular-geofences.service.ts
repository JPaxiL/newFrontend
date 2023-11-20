import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { environment } from 'src/environments/environment';

import * as L from 'leaflet';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CircularGeofencesService {

  circular_geofences: any[] = []
  nameComponentCir:string = "LISTAR";
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
  @Output() dataCompleted = new EventEmitter<any>();

  circularGeofenceCounters: any = {
    visible: 0,
    hidden: 0,
  }

  circularGeofenceTagCounters: any = {
    visible: 0,
    hidden: 0,
  }

  constructor(private http: HttpClient,
              private userDataService: UserDataService,
              public spinner: NgxSpinnerService,
              private mapService: MapServicesService) { }

  initialize(){
    this.getUserPrivileges();
    this.getAll();

    
  }

  getAll(){
    this.http.get<ResponseInterface>(`${environment.apiUrl}/api/circular-zone`).subscribe(resp => {

      this.circular_geofences = resp.data;
      console.log("Circularessss",resp.data);
      this.initializeTable();
      this.drawGeofencesOnMap();
      this.updateGeoCounters();
      this.updateGeoTagCounters();
      this.eyeInputSwitch = this.circularGeofenceCounters.visible != 0;
      this.tagNamesEyeState = this.circularGeofenceCounters.visible != 0;
      this.initializingCircularGeofences = true;
      this.attemptToHideSpinner();
      console.log(this.circular_geofences);
      this.dataCompleted.emit(this.circular_geofences);
    });
  }

  initializeTable(newCircularGeofenceId?: number) {
    this.tblDataGeo = [];
    for(let i = 0; i < this.circular_geofences.length; i++){
      if(this.circular_geofences[i].id != newCircularGeofenceId){
        this.circular_geofences[i].zone_name_visible_bol = (this.circular_geofences[i].zone_name_visible == 'true');
      } else {
        this.circular_geofences[i].zone_name_visible_bol = true;
      }
      this.tblDataGeo.push({trama:this.circular_geofences[i]});
    }
    this.tblDataGeoFiltered = this.getTableData();

    console.log(this.tblDataGeoFiltered);
    
  }

  bindMouseEvents(geofence: any){
    geofence.geo_elemento.on('mouseover', () => {
      if(geofence.zone_name_visible != 'true'){
        geofence.marker_name.addTo(this.mapService.map);
      }
    });
    geofence.geo_elemento.on('mouseout', () => {
      if(geofence.zone_name_visible != 'true'){
        this.mapService.map.removeLayer(geofence.marker_name);
      }
    });
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

  showDrawingsOfGeofence(geofence: any){
    if (geofence.zone_visible == 'true') {
      geofence.geo_elemento.addTo(this.mapService.map);
    }

    if (geofence.zone_name_visible == 'true') {
      geofence.marker_name.addTo(this.mapService.map);
    }
    
  }

  drawGeofencesOnMap(){
    for (let i = 0; i < this.circular_geofences.length; i++) {
      
      this.circular_geofences[i].geo_elemento = new L.Circle( this.getCoordenadas(this.circular_geofences[i].geo_coordenadas), {
        radius: this.getRadius(this.circular_geofences[i].geo_coordenadas),
        weight: 3,
        fill: this.circular_geofences[i].zone_no_int_color,
        color: this.circular_geofences[i].zone_color,
      });

      let bg_color = this.tooltipBackgroundTransparent? this.defaultTagNameBackground: this.mapService.hexToRGBA(this.circular_geofences[i].zone_color);
      let txt_color = this.tooltipBackgroundTransparent? (this.circular_geofences[i].tag_name_color == ''? this.defaultTagNameColor: this.circular_geofences[i].tag_name_color): this.mapService.hexToRGBA(this.circular_geofences[i].zone_color);
      let font_size = (this.circular_geofences[i].tag_name_font_size == 0? this.defaultTagNameFontSize: this.circular_geofences[i].tag_name_font_size) + 'px';

      
      this.circular_geofences[i].marker_name = L.circleMarker(this.getCoordenadas(this.circular_geofences[i].geo_coordenadas), {
        
        "radius": 0,
        "fillColor": "#000",//color,
        "fillOpacity": 1,
        "color": "#000",//color,
        "weight": 1,
        "opacity": 1

      }).bindTooltip(
          
          '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+this.circular_geofences[i].zone_name+'</b>',
          { permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-own',
          });

      this.bindMouseEvents(this.circular_geofences[i]);

    }

    //this.sortGeofencesBySize();

    for (let i = 0; i < this.circular_geofences.length; i++) {
      this.showDrawingsOfGeofence(this.circular_geofences[i]);
    }
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
    return this.circular_geofences;
  }

  getTableData(){
    return this.tblDataGeo;
  }

  getUserPrivileges(){
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
    console.log('(Circular Geofences Service) Privilegios obtenidos...');
  }

  attemptToHideSpinner(){
    console.log('Attempt to hide Geofences Spinner: ', { 
      isTableReady: this.initializingCircularGeofences, 
      isUserDataReady: this.initializingUserPrivleges } );
    if(this.initializingCircularGeofences && this.initializingUserPrivleges){
      this.spinner.hide('loadingCircularGeofencesSpiner');
    }
  }

  updateGeoCounters(){
    this.circularGeofenceCounters.visible = this.circular_geofences.filter( (circular_geofences: { zone_visible: string; }) => circular_geofences.zone_visible == 'true').length;
    this.circularGeofenceCounters.hidden = this.circular_geofences.length - this.circularGeofenceCounters.visible;
    
  }

  updateGeoTagCounters(){
    this.circularGeofenceTagCounters.visible = this.circular_geofences.filter( (circular_geofences: { zone_name_visible_bol: boolean; }) => circular_geofences.zone_name_visible_bol == true).length;
    this.circularGeofenceTagCounters.hidden = this.circular_geofences.length - this.circularGeofenceTagCounters.visible;
  }

  clearDrawingsOfGeofence(geofence: any){
    if(geofence.geo_elemento != null && typeof geofence.geo_elemento != 'undefined'
      && geofence.zone_visible == 'true' ){

      this.mapService.map.removeLayer(geofence.geo_elemento);
    }
    if(geofence.marker_name != null && typeof geofence.marker_name != 'undefined'
      && geofence.zone_name_visible == 'true' ){

      this.mapService.map.removeLayer(geofence.marker_name);
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
