import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolylineGeogencesService {

  polyline_geofences: any[] = []
  nameComponentLin:string = "LISTAR";
  action:string = "add";
  idGeocercaEdit:number = 0;

  tblDataGeo: any[] = [];
  tblDataGeoFiltered: any = [];

  showBtnAdd = true;
  showBtnEdit = true;
  initializingUserPrivleges: boolean = false;
  initializingPolylineGeofences: boolean = false;
  eyeInputSwitch: boolean = true;
  tagNamesEyeState: boolean = true;
  tooltipBackgroundTransparent: boolean = true;
  defaultTagNameFontSize = 10;
  defaultTagNameColor = '#000000';
  defaultTagNameBackground = 'inherit'
  @Output() dataCompleted = new EventEmitter<any>();

  paintpolygonControl: any;

  polylineGeofenceCounters: any = {
    visible: 0,
    hidden: 0,
  }

  polylineGeofenceTagCounters: any = {
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
    this.initializePaintPolygon();
  }

  getAll(){
    this.http.get<ResponseInterface>(`${environment.apiUrl}/api/polyline-zone`).subscribe(resp => {

      this.polyline_geofences = resp.data;
      console.log("getAll Polilinea", resp.data);
      this.initializeTable();
      this.drawGeofencesOnMap();
      this.updateGeoCounters();
      this.updateGeoTagCounters();
      this.eyeInputSwitch = this.polylineGeofenceCounters.visible != 0;
      this.tagNamesEyeState = this.polylineGeofenceCounters.visible != 0;
      this.initializingPolylineGeofences = true;
      this.attemptToHideSpinner();
      this.dataCompleted.emit(this.polyline_geofences);
    });
  }

  initializeTable(newCircularGeofenceId?: number) {
    this.tblDataGeo = [];
    for(let i = 0; i < this.polyline_geofences.length; i++){
      if(this.polyline_geofences[i].id != newCircularGeofenceId){
        this.polyline_geofences[i].zone_name_visible_bol = (this.polyline_geofences[i].zone_name_visible == 'true');
      } else {
        this.polyline_geofences[i].zone_name_visible_bol = true;
      }
      this.tblDataGeo.push({trama:this.polyline_geofences[i]});
    }
    this.tblDataGeoFiltered = this.getTableData();
    
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

    this.polyline_geofences.sort((a: any, b: any) => {
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
    for (let i = 0; i < this.polyline_geofences.length; i++) {
      
      console.log(this.polyline_geofences[i]);

      this.polyline_geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(this.polyline_geofences[i].geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: this.polyline_geofences[i].zone_color,
      });

      var centerPoligon = this.polyline_geofences[i].geo_elemento.getBounds().getCenter();

      let bg_color = this.tooltipBackgroundTransparent? this.defaultTagNameBackground: this.mapService.hexToRGBA(this.polyline_geofences[i].zone_color);
      let txt_color = this.tooltipBackgroundTransparent? (this.polyline_geofences[i].tag_name_color == ''? this.defaultTagNameColor: this.polyline_geofences[i].tag_name_color): this.mapService.hexToRGBA(this.polyline_geofences[i].zone_color);
      let font_size = (this.polyline_geofences[i].tag_name_font_size == 0? this.defaultTagNameFontSize: this.polyline_geofences[i].tag_name_font_size) + 'px';

      
      this.polyline_geofences[i].marker_name = L.circleMarker(centerPoligon, {
        
        "radius": 0,
        "fillColor": "#000",//color,
        "fillOpacity": 1,
        "color": "#000",//color,
        "weight": 1,
        "opacity": 1

      }).bindTooltip(
          
          '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+this.polyline_geofences[i].zone_name+'</b>',
          { permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-own',
          });

      this.bindMouseEvents(this.polyline_geofences[i]);

    }

    //this.sortGeofencesBySize();

    for (let i = 0; i < this.polyline_geofences.length; i++) {
      this.showDrawingsOfGeofence(this.polyline_geofences[i]);
    }
  }

  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

  getData() {
    return this.polyline_geofences;
  }

  getTableData(){
    return this.tblDataGeo;
  }

  getUserPrivileges(){
    console.log('(Polyline Geofences Service) Esperando privliegios...');
    if(!this.userDataService.userDataInitialized){
      console.log('(Polyline Geofences Service) User Data no está listo. Subscribiendo para obtener privilegios...');
      this.userDataService.geofencesPrivileges.subscribe({
        next: (result: boolean) => {
          if(result){
            this.verifyPrivileges();
          }
        },
        error: (errMsg: any) => {
          console.log('(Polyline Geofences Service) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(Polyline Geofences Service) User Data está listo. Obteniendo privilegios...');
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
    console.log('(Polyline Geofences Service) Privilegios obtenidos...');
  }

  attemptToHideSpinner(){
    console.log('Attempt to hide Geofences Spinner: ', { 
      isTableReady: this.initializingPolylineGeofences, 
      isUserDataReady: this.initializingUserPrivleges } );
    if(this.initializingPolylineGeofences && this.initializingUserPrivleges){
      this.spinner.hide('loadingPolylineGeofencesSpiner');
    }
  }

  updateGeoCounters(){
    this.polylineGeofenceCounters.visible = this.polyline_geofences.filter( (polyline_geofences: { zone_visible: string; }) => polyline_geofences.zone_visible == 'true').length;
    this.polylineGeofenceCounters.hidden = this.polyline_geofences.length - this.polylineGeofenceCounters.visible;
    
  }

  updateGeoTagCounters(){
    this.polylineGeofenceTagCounters.visible = this.polyline_geofences.filter( (polyline_geofences: { zone_name_visible_bol: boolean; }) => polyline_geofences.zone_name_visible_bol == true).length;
    this.polylineGeofenceTagCounters.hidden = this.polyline_geofences.length - this.polylineGeofenceTagCounters.visible;
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

  initializePaintPolygon(){
  
    //@ts-ignore
    this.paintpolygonControl = L.control.paintPolygon({
      menu: false,
    }).addTo(this.mapService.map);
  }

  edit(zone: any){
    
    return this.http.put<ResponseInterface>(`${environment.apiUrl}/api/polyline-zone/${zone.id}`,zone).pipe(switchMap(({data}) => [data]));
  }

  store(zone: any){
    
    return this.http.post<ResponseInterface>(`${environment.apiUrl}/api/polyline-zone`,zone).pipe(switchMap(({data}) => [data]));

  }

  async delete(id: any){
    return await (await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/polyline-zone/${id}`).toPromise()).data;
    
  }
}
