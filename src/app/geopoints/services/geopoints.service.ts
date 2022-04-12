import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { MapServicesService } from '../../map/services/map-services.service';

import * as L from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class GeopointsService {

  public geopoints:any = [];
  public nombreComponente:string = "LISTAR";

  public idGeopointEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]

  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,

  ) { }


  public initialize() {
    this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/point`).toPromise()
    .then(response => {
      // console.log("========================");

      // console.log(response);

      this.geopoints = response.data;



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
            html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+this.geopoints[i].geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
            className: "",
            iconSize: [24, 29],
            iconAnchor: [12, 29],
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
              '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geopoints[i].geopunto_color+';">'+this.geopoints[i].geopunto_name+'</b>',
              { permanent: true,
                offset: [20, 20],
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

    });
  }

  public getData() {
    return this.geopoints;
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


}
