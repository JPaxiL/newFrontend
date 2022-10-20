import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { MapServicesService } from '../../map/services/map-services.service';

import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class GeofencesService {

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

  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,
    public spinner: NgxSpinnerService,

    ) {
    //this.getAll();
  }

  //Se llama desde /app/map/components/map-view/map-view.component.ts
  public async initialize() {
    await this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/zone`).toPromise()
    .then(response => {
      this.geofences = response.data;
      this.initializeTable();

      for (let i = 0; i < this.geofences.length; i++) {
        //const element = this.geofences[i];

        this.geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(this.geofences[i].geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: this.geofences[i].zone_color //'#000000'
        });

        if (this.geofences[i].zone_visible == "true") {
          this.geofences[i].geo_elemento.addTo(this.mapService.map);
        }

        var centerPoligon = this.geofences[i].geo_elemento.getBounds().getCenter();
        //console.log("centro de = "+this.geofences[i].zone_name);

        //console.log(centerPoligon);

        let bg_color = this.tooltipBackgroundTransparent? this.defaultTagNameBackground: this.mapService.hexToRGBA(this.geofences[i].zone_color);
        let txt_color = this.tooltipBackgroundTransparent? (this.geofences[i].tag_name_color == ''? this.defaultTagNameColor: this.geofences[i].tag_name_color): this.mapService.hexToRGBA(this.geofences[i].zone_color);
        let font_size = (this.geofences[i].tag_name_font_size == 0? this.defaultTagNameFontSize: this.geofences[i].tag_name_font_size) + 'px';

        //this.geofences[i].marker_name = L.marker(centerPoligon).addTo(this.mapService.map);
        this.geofences[i].marker_name = L.circleMarker(centerPoligon, {
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
            '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+this.geofences[i].zone_name+'</b>',
            { permanent: true,
              // offset: [-100, 0],
              direction: 'center',
              className: 'leaflet-tooltip-own',
            });

        if (this.geofences[i].zone_name_visible == "true") {
          this.geofences[i].marker_name.addTo(this.mapService.map);
        }



        // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
        // // tempMarker.bindLabel("My Label");
        // tempMarker.bindTooltip(data.name, { permanent: true, offset: [0, 12] });



        // this.geofences.geo_elemento.setLabel("NOMBRE");
      }
      this.updateGeoCounters();
      this.updateGeoTagCounters();
      this.eyeInputSwitch = this.geofenceCounters.visible != 0;
      this.tagNamesEyeState = this.geofenceTagCounters.visible != 0;
      console.log('Geocercas Cargadas');
      this.initializingGeofences = true;
      console.log(this.geofences);

    });
  }

  public getData() {
    return this.geofences;
  }

  public getTableData(){
    return this.tblDataGeo;
  }

  initializeTable(newGeofenceId?: number) {
    this.tblDataGeo = [];
    for(let i = 0; i < this.geofences.length; i++){
      if(this.geofences[i].id != newGeofenceId){
        this.geofences[i].zone_name_visible_bol = (this.geofences[i].zone_name_visible === 'true');
      } else {
        this.geofences[i].zone_name_visible_bol = true;
      }
      this.tblDataGeo.push({trama:this.geofences[i]});
    }
    this.tblDataGeoFiltered = this.getTableData();

    this.spinner.hide('loadingGeofencesSpinner');
    // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

}


  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

  //====================================

  public async edit(zone: any){
    const response:ResponseInterface = await this.http.put<ResponseInterface>(`${environment.apiUrl}/api/zone/${zone.id}`,zone).toPromise();
    return response.data;
  }

  public async store(zone: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/zone`,zone).toPromise();
    return response.data;
  }

  public async delete(id: any){
    const response:ResponseInterface = await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/zone/${id}`).toPromise();
    return response.data;
  }

  public updateGeoCounters(){
    this.geofenceCounters.visible = this.geofences.filter( (geofence: { zone_visible: string; }) => geofence.zone_visible == 'true').length;
    this.geofenceCounters.hidden = this.geofences.length - this.geofenceCounters.visible;
    //console.log('Visibles:', this.geofenceCounters.visible);
    //console.log('Ocultos:', this.geofenceCounters.hidden);
  }

  public updateGeoTagCounters(){
    this.geofenceTagCounters.visible = this.geofences.filter( (geofence: { zone_name_visible_bol: boolean; }) => geofence.zone_name_visible_bol == true).length;
    this.geofenceTagCounters.hidden = this.geofences.length - this.geofenceTagCounters.visible;
  }

}
