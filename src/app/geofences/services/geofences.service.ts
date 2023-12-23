import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import {TreeNode} from 'primeng-lts/api';
import { MapServicesService } from '../../map/services/map-services.service';
import * as moment from 'moment';
import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { ITag } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeofencesService {

  private api_url = environment.apiUrl;
  public geofences:any = [];
  public nameComponentPol:string = "LISTAR";
  public geofencesTree: TreeNode[]=[];
  public treeTableStatus: boolean = false;
  public idGeocercaEdit:number = 0;
  public type: string = 'polig'; //[polig, cir, line]
  public action:string = 'add'; //[add,edit,delete]

  @Output() dataTreeCompleted = new EventEmitter<any>();
  @Output() dataCompleted = new EventEmitter<any>();
  @Output() clickEye = new EventEmitter<any>();
  @Output() displayOn = new EventEmitter<any>();
  @Output() deleted = new EventEmitter();
   disableBtn: boolean = true;
  modalCloseEvent = new EventEmitter();

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
  showBtnImportExport = true;
  showBtnTags = true;
  listGeofences: any = [];
  listTag: ITag [] = [];
  public operations: any = [];
  public tagGroups: any = [];
  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,
    public spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    ) {
    //this.getAll();
  }

  //Se llama desde /app/map/components/map-view/map-view.component.ts
  public async initialize() {
    this.getUserPrivileges();
    await this.getAll();
    
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/zone`).toPromise()
    .then(async (response) => {
      this.geofences = response.data;
      await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/listTags`).toPromise()
      .then(response => {
        console.log("ress", response);
        this.listTag = response.data;
        console.log("lisstagg", this.listTag);

        console.log("Polygonalessss",response.data);
        this.initializeTable();
        this.drawGeofencesOnMap();
        this.updateGeoCounters();
        this.updateGeoTagCounters();
        this.eyeInputSwitch = this.geofenceCounters.visible != 0;
        this.tagNamesEyeState = this.geofenceTagCounters.visible != 0;
        this.initializingGeofences = true;
        this.attemptToHideSpinner();
        this.dataCompleted.emit(this.geofences);
      });;
    });
  }
 
  public getTagss(){
    return this.listTag.filter(item=>item.var_name != "deafault");
  }
  public async storeTag(zone: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/storeTag`,zone).toPromise();
    return response;
  }
  public async deleteTag(zone: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/deleteTag`,zone).toPromise();
    return response;
  }
  // public async storeTagAndAssingGeo(req: any){
  //   const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/storeTagAndAssigGeos`,req).toPromise();
  //   console.log(response);
  //   return response.data;
  // }
  storeTagAndAssingGeo(req: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/storeTagAndAssigGeos`, req);
  } 
 

  closeModal() {
    // Envía evento al padre para cerrarse
    this.modalCloseEvent.emit();
  }

  public clearDrawingsOfGeofence(geofence: any){
    if(geofence.geo_elemento != null && typeof geofence.geo_elemento != 'undefined'
      && geofence.zone_visible == 'true' ){

      //Si la geocerca ya existe y es visible, entonces remover la capa
      //console.log('Geocerca visible, eliminar', geofence);
      this.mapService.map.removeLayer(geofence.geo_elemento);
    }
    if(geofence.marker_name != null && typeof geofence.marker_name != 'undefined'
      && geofence.zone_name_visible == 'true' ){

      //Si el nombre de la geocerca ya existe y es visible, entonces removerla
      //console.log('Nombre de geocerca visible, eliminar', geofence);
      this.mapService.map.removeLayer(geofence.marker_name);
    }
  }

  public showDrawingsOfGeofence(geofence: any){
    if (geofence.zone_visible == 'true') {
      geofence.geo_elemento.addTo(this.mapService.map);
    }

    if (geofence.zone_name_visible == 'true') {
      geofence.marker_name.addTo(this.mapService.map);
    }

    // const tempMarker = L.marker([data.latitud, data.longitud], {icon: iconMarker}).bindPopup(popupText);
    // // tempMarker.bindLabel("My Label");
    // tempMarker.bindTooltip(data.name, { permanent: true, offset: [0, 12] });

    // this.geofences.geo_elemento.setLabel("NOMBRE");
  }

  public drawGeofencesOnMap(){
    for (let i = 0; i < this.geofences.length; i++) {

      this.geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(this.geofences[i].geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: this.geofences[i].zone_color,
      });

      //console.log("centro de = "+this.geofences[i].zone_name);
      //console.log(centerPoligon);
      var centerPoligon = this.geofences[i].geo_elemento.getBounds().getCenter();

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
            className: 'leaflet-tooltip-own geofence-tooltip',
          });

      this.bindMouseEvents(this.geofences[i]);
    }

    this.sortGeofencesBySize();

    for (let i = 0; i < this.geofences.length; i++) {
      //const element = this.geofences[i];
      this.showDrawingsOfGeofence(this.geofences[i]);
    }
  }

  public bindMouseEvents(geofence: any){
    geofence.geo_elemento.on('mouseover', () => {
      //this.sortGeofencesBySize(this.geofences);
      //console.log(`Mouseover event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
      if(geofence.zone_name_visible != 'true'){
        //console.log('Mostrar tooltip');
        geofence.marker_name.addTo(this.mapService.map);
      }
      //console.log(geofence.geo_elemento.getLatLngs());
      //console.log(L.GeometryUtil.geodesicArea((geofence.geo_elemento.getLatLngs()[0])));
    });
    geofence.geo_elemento.on('mouseout', () => {
      //console.log(`MouseOUT event on <<${geofence.zone_name}>>: `, { zonaNameState: geofence.zone_name_visible, geocerca: geofence });
      if(geofence.zone_name_visible != 'true'){
        //console.log('Eliminar tooltip');
        this.mapService.map.removeLayer(geofence.marker_name);
      }
    });
  }

  public sortGeofencesBySize(){
    //console.log('Sorting...');
    this.geofences.sort((a: any, b: any) => {
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
  }

  public getData() {
    return this.geofences;
  }

  public getTableData(){
    return this.tblDataGeo;
  }

  public onClickEye(geofence: string):void{
    this.clickEye.emit(geofence);
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

    //this.spinner.hide('loadingGeofencesSpinner');
    // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
  }

  getUserPrivileges(){
    //console.log('(Geofences Service) Esperando privliegios...');
    if(!this.userDataService.userDataInitialized){
      //console.log('(Geofences Service) User Data no está listo. Subscribiendo para obtener privilegios...');
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
      //console.log('(Geofences Service) User Data está listo. Obteniendo privilegios...');
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
    this.deleted.emit(id);
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

  getNameTag(id: any){
    //console.log('find tagsss',this.tags);
    return this.listTag.find(tag=>tag.id == id.toString())?.var_name;
  }

  public async createTreeNode():Promise <TreeNode[]>{
    let map: any=[];
    this.operations = [];
    this.tagGroups = [];
    let status_operation = false;
    let status_tags = false;
    console.log("Geofences Unidos", this.listGeofences)

    for(const index in this.listGeofences){
      status_operation = false;
      status_tags= false;
      console.log('id GEO TAGS->', this.listGeofences[index].tags);
      if(this.listGeofences[index].tags?.length == 0 || this.listGeofences[index].tags == null || !this.listGeofences[index].tags){
        if(this.operations.includes(this.listGeofences[index]['idoperation'])){
        }else{
          this.operations.push(this.listGeofences[index]['idoperation']);
          status_operation= true;
        }
        if(this.tagGroups.includes(this.listGeofences[index]['idoperation']+'_0')){
        }else{
          this.tagGroups.push(this.listGeofences[index]['idoperation']+'_0');
          status_tags= true;
        } //lógica para agregar a map
        if(status_operation&&status_tags){
          console.log('case defoult:1_1');
          map.push(
            {
              data:{id:this.listGeofences[index]['idoperation'],name: this.listGeofences[index]['nameoperation'], col:3, type:'operacion' },
              expanded: true,
              children:[
                {
                  data:{id:0, name: 'Geocercas Sin Etiquetas', col:3, type:'etiqueta' },
                  expanded: true,
                  children: [
                    {
                      data:this.listGeofences[index],
                    }
                  ]
                }
              ]
            }
          );
        }else if(!status_operation&&status_tags){
          console.log('case defoult:0_1');
          const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id == this.listGeofences[index]['idoperation']);
          const newTag = {
            data:{id:0, name: 'Geocercas Sin Etiquetas', col:3, type:'etiqueta' },
            expanded: true,
            children: [
              {
                data:this.listGeofences[index],
              }
            ],
          };
          existingOperation.children.push(newTag);
          
        }else if(status_operation&&!status_tags){
          console.log('case defoult:1_0');
        }else if(!status_operation&&!status_tags){
          console.log('case defoult:0_0');
          const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id == this.listGeofences[index]['idoperation']);
          const existingTag = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id == 0);
          existingTag.children.push({
            data: this.listGeofences[index]
          });
        }
      }else{
        console.log('ERROR', this.listGeofences[index]);
        for(const indexTag of this.listGeofences[index].tags!){
          const tagName = this.getNameTag(indexTag);
          if(this.operations.includes(this.listGeofences[index]['idoperation'])){
          }else{
            this.operations.push(this.listGeofences[index]['idoperation']);
            status_operation= true;
          }
          if(this.tagGroups.includes(this.listGeofences[index]['idoperation']+'_'+indexTag)){
          }else{
            this.tagGroups.push(this.listGeofences[index]['idoperation']+'_'+indexTag);
            status_tags= true;
          }
          //
          if(status_operation&&status_tags){
            console.log('case:1_1');
            map.push(
              {
                data:{id:this.listGeofences[index]['idoperation'],name: this.listGeofences[index]['nameoperation'], col:3, type:'operacion' },
                expanded: true,
                children:[
                  {
                    data:{id:indexTag, name: tagName, col:3, type:'etiqueta' },
                    expanded: true,
                    children: [
                      {
                        data:this.listGeofences[index],
                      }
                    ]
                  }
                ]
              }
            );
          }else if(!status_operation&&status_tags){
            console.log('case:0_1');
            const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === this.listGeofences[index]['idoperation']);
            const newTag = {
              data:{id:indexTag, name: tagName, col:3, type:'etiqueta' },
              expanded: true,
              children: [
                {
                  data:this.listGeofences[index],
                }
              ],
            };
            existingOperation.children.push(newTag);
            
          }else if(status_operation&&!status_tags){
            console.log('case:1_0');
          }else if(!status_operation&&!status_tags){
            console.log('case:0_0');
            const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id == this.listGeofences[index]['idoperation']);
            const existingTag = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id == indexTag);
            existingTag.children.push({
              data: this.listGeofences[index]
            });
          }
          status_tags= false;
          status_operation = false;
        }
      }
    }
    console.log("tagss", this.listTag);
    console.log('arbol de etiquetas',map);
    return Promise.resolve(map);
  }

}