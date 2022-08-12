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
export class GeopointsService {

  initializingGeopoints: boolean = false;
  tblDataGeo = new Array();

  eyeInputSwitch: boolean = true;
  geopointCounters: any = {
    visible: 0,
    hidden: 0,
  }

  public geopoints:any = [];
  public nombreComponente:string = "LISTAR";

  public idGeopointEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,
    public spinner: NgxSpinnerService,
  ) { }


  public async initialize() {
    await this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/point`).toPromise()
    .then(response => {
      // console.log("========================");

      // console.log(response);

      this.geopoints = response.data;
      this.initializeTable();

      for (let i = 0; i < this.geopoints.length; i++) {
        // //const element = this.geofences[i];

        this.geopoints[i].geopunto_nombre_visible_bol = (this.geopoints[i].geopunto_nombre_visible === 'true');
        this.geopoints[i].geopunto_visible_bol    = (this.geopoints[i].geopunto_visible === 'true');


        // const myCustomColour = this.geopoints[i].geopunto_color;//'#583470'

        // const markerHtmlStyles = `
        //   background-color: ${myCustomColour};
        //   width: 3rem;
        //   height: 3rem;
        //   display: block;
        //   left: -1.5rem;
        //   top: -1.5rem;
        //   position: relative;
        //   border-radius: 3rem 3rem 0;
        //   transform: rotate(45deg);
        //   border: 1px solid #FFFFFF`

        // const iconX = L.divIcon({
        //   className: "my-custom-pin",
        //   iconAnchor: [0, 24],
        //   //labelAnchor: [-6, 0],
        //   popupAnchor: [0, -36],
        //   html: `<span style="${markerHtmlStyles}" />`
        // })

        // var latlng = this.geopoints[i].geopunto_vertices.split(",")
        // //bounds.push([parseFloat(latlng[0]), parseFloat(latlng[1])]);

        // this.geopoints[i].geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
        //   { icon: iconX
        //   });
          //.addTo(this.mapService.map);



          //// ====3

          // this.geopoints[i].geo_elemento2 = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
          // { icon: L.icon({
          //       iconUrl: 'assets/images/route_start.png',
          //       iconAnchor: [16, 32]
          //   })
          // }).addTo(this.mapService.map);




          // ==============2

          var latlng = this.geopoints[i].geopunto_vertices.split(",")

          const svgIcon = L.divIcon({
            html: this.geopointHTMLMarkerIcon(this.geopoints[i].geopunto_color),
            className: "",
            iconSize: [24, 41.86],
            iconAnchor: [12, 41.86],
          });

          this.geopoints[i].geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
            { icon: svgIcon
            });

          if (this.geopoints[i].geopunto_visible == "true") {
            this.geopoints[i].geo_elemento.addTo(this.mapService.map);
          }

          this.geopoints[i].marker_name = L.circleMarker([parseFloat(latlng[0]), parseFloat(latlng[1])], {
            // pane: 'markers1',
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
              /* '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geopoints[i].geopunto_color+';">'+this.geopoints[i].geopunto_name+'</b>', */
              '<b class="" style="background-color: '+ this.mapService.hexToRGBA(this.geopoints[i].geopunto_color) +'; color: '+ this.mapService.getContrastYIQ(this.geopoints[i].geopunto_color) +';">'+this.geopoints[i].geopunto_name+'</b>',
              { permanent: true,
                offset: [0, 20],
                direction: 'center',
                className: 'leaflet-tooltip-own',
              });

        if (this.geopoints[i].geopunto_nombre_visible == "true") {
          this.geopoints[i].marker_name.addTo(this.mapService.map);
        }

        // geo_elemento: NewClass {options: {…}, _latlng: LatLng, _initHooksCalled: true, _events: {…}, editing: NewClass, …}
        // geopunto_color: "#ff0000"
        // geopunto_id: 65
        // geopunto_name: "06"
        // geopunto_nombre_visible: "true"
        // geopunto_nombre_visible_bol: true
        // geopunto_vertices: "-13.57600000,-71.99536667"
        // geopunto_visible: "true"
        // marker_name: NewClass {options: {…}, _latlng: LatLng, _radius: 0, _initHooksCalled: true, editing: NewClass, …}
        // user_id: 305




        //============5

        // this.geopoints[i].geo_elemento5 = L.circleMarker([parseFloat(latlng[0]), parseFloat(latlng[1])], {
        //   // pane: 'markers1',
        //   "radius": 4,
        //   "fillColor": this.geopoints[i].geopunto_color,
        //   "fillOpacity": 1,
        //   "color": "#000",//color,
        //   "weight": 1,
        //   "opacity": 1
        // }).addTo(this.mapService.map);



        // if (this.geofences[i].zone_visible == "true") {
        //   this.geofences[i].geo_elemento.addTo(this.mapService.map);
        // }

        // var centerPoligon = this.geofences[i].geo_elemento.getBounds().getCenter();
        // console.log("centro de = "+this.geofences[i].zone_name);

        // console.log(centerPoligon);

        // //this.geofences[i].marker_name = L.marker(centerPoligon).addTo(this.mapService.map);
        // this.geofences[i].marker_name = L.circleMarker(centerPoligon, {
        //   // pane: 'markers1',
        //   "radius": 0,
        //   "fillColor": "#000",//color,
        //   "fillOpacity": 1,
        //   "color": "#000",//color,
        //   "weight": 1,
        //   "opacity": 1

        // }).bindTooltip(
        //     // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
        //     '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geofences[i].zone_color+';">'+this.geofences[i].zone_name+'</b>',
        //     { permanent: true,
        //       // offset: [-100, 0],
        //       direction: 'center',
        //       className: 'leaflet-tooltip-own',
        //     });

        // if (this.geofences[i].zone_name_visible == "true") {
        //   this.geofences[i].marker_name.addTo(this.mapService.map);
        // }



      }

      this.updateGeoCounters();
      this.eyeInputSwitch = this.geopointCounters.visible != 0;
      console.log('Geopuntos Cargados');
      this.initializingGeopoints = true;

    });
  }

  public getData() {
    return this.geopoints;
  }

  public initializeTable(newGeopointId?: number){
    this.tblDataGeo = [];
    for (let i = 0; i < this.geopoints.length; i++) {
      this.geopoints[i].geopunto_nombre_visible_bol = (this.geopoints[i].geopunto_nombre_visible === 'true');
      this.geopoints[i].geopunto_visible_bol = (this.geopoints[i].geopunto_visible === 'true');

      this.tblDataGeo.push({trama:this.geopoints[i]});
    }
    this.spinner.hide('loadingGeopointsSpinner');
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

  public updateGeoCounters(){
    //console.log('Geopuntos update: ', this.geopoints);
    //console.log('Geopuntos update: ', this.tblDataGeo.filter( geopoint => geopoint.trama.geopunto_visible == 'true').length);
    //console.log('Geopuntos update: ', this.tblDataGeo.length - this.tblDataGeo.filter( geopoint => geopoint.trama.geopunto_visible == 'true').length);
    this.geopointCounters.visible = this.tblDataGeo.filter( geopoint => geopoint.trama.geopunto_visible == 'true').length;
    this.geopointCounters.hidden = this.tblDataGeo.length - this.geopointCounters.visible;
  }

}
