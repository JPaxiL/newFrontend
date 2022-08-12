import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng-lts/api';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

import {DialogModule} from 'primeng-lts/dialog';
import {ConfirmationService} from 'primeng-lts/api';

import { VehicleService } from '../../services/vehicle.service';
import { VehicleConfigService } from '../../services/vehicle-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  @Output() eventDisplayGroup = new EventEmitter<boolean>();

  vehicleIconState: boolean = false;

  sortOrder: number=1;
  display: boolean = false;
  displayDelete: boolean = false;
  displayEditGroup: boolean = false;
  textDelete: string = "";
  textHeaderEdit: string = "";
  loadingDelete: boolean = false;
  idDelete!: number;
  typeDelete!: string;
  config: any=[];
  vehicles: TreeNode[]=[];
  cols: any[]=[];
  loading: boolean=true;
  buttonDisplay: string="block";
  list1: any = [];
  list2: any = [];
  formDisplay : string = 'block'
  selectedList1: any = [];
  selectedList2: any = [];
  private dataEdit : any = {
    id : -1,
    name : "",
    type : ""
  };
  alreadyLoaded: boolean = false;

  @ViewChild('nameEdit',{ static:true}) nameEdit!: ElementRef;
  color: any = {
    10:"#45e845",
    20:"#2cadf2",
    30:"#b23ccf",
    40:"#000",
    50:"#ffb300",
    60:"#cc1013",
    100:"#45e845",
  };

  hint: any = {
    10: 'En movimiento',
    20: 'Detenido encendido',
    30: 'Detenido apagado',
    40: 'Sin transmisión',
    50: 'Sin cobertura',
    60: 'GPS sin señal',
    100: 'En movimiento',
  };

  public column: number = 9;
  public setting: any = {
    eye: true,
    imei: false,
    vehicle: true,
    tag: true,
    follow: true,
    limit: true,
    gps: false,
    gsm: false,
    trans: false,
    config: true,
    sort: 'asc'
  }

  @ViewChild('tt') tt!:any;

  constructor(
    private vehicleService:VehicleService,
    private configDropdown: NgbDropdownConfig,
    private vehicleConfigService : VehicleConfigService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private followService:FollowService,
  ) {
    // this.vehicleService.listTable=1;
    if(this.loading) {
      this.spinner.show('loadingTreeTable');
    } else {
      this.alreadyLoaded = true;
      console.log(this.alreadyLoaded);
    }
    configDropdown.placement = 'right-top';
    configDropdown.autoClose = 'outside';
    this.vehicleService.dataTreeCompleted.subscribe(vehicles=>{
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
      this.spinner.hide('loadingTreeTable');
      this.treeTableResizing(true);
      this.headerScrollHandler();
    });

    this.vehicleService.reloadTableTree.subscribe(res=>{

      if(this.vehicleService.treeTableStatus){
        // //console.log('desde tree table ...');
        // this.vehicleService.vehiclesTree = this.vehicleService.createNode(this.vehicleService.vehicles);
        this.vehicles = this.vehicleService.vehiclesTree;
      }

    });


  }

  ngOnInit(): void {
    this.vehicleService.treeTableStatus = true;
    // //console.log("tree on init");
    if(this.vehicleService.statusDataVehicleTree){
      this.vehicles = this.vehicleService.vehiclesTree;
      this.loading=false;
      this.alreadyLoaded = true;
      this.headerScrollHandler();
    }
    this.cols = [
          { field: 'eye', header: 'eye' },
          { field: 'name', header: 'Vehículo' },
          { field: 'activo', header: 'TAG' },
          { field: 'follow', header: 'speed' },
          /* { field: 'gps', header: 'speed' },
          { field: 'gsm', header: 'speed' }, */
          { field: 'point_color', header: 'speed' },
          { field: 'activo', header: 'speed' }
      ];
    this.treeTableResizing(true);
    window.addEventListener('resize', this.treeTableResizing, true);
    screen.orientation.addEventListener('change', this.treeTableResizing);
    console.log(this.vehicleService.vehicles);
  }

  headerScrollHandler(){
    setTimeout(()=> {
      const headerBox = document.querySelector('.p-treetable-scrollable-header-box') as HTMLElement;
      const contentBox = document.querySelector('.p-treetable-tbody') as HTMLElement;
      if(headerBox != null && contentBox != null){
        if(headerBox!.offsetWidth > contentBox!.offsetWidth){
          headerBox!.classList.remove('no-scroll');
        } else {
          headerBox!.classList.add('no-scroll');
        }
      }
    }, 1000);
  }

  treeTableResizing(e: any) {
    /* console.log('--navbar-height: ', Number(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('rem', ''))); */

    const navbarHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('rem', ''));
    const rowBusquedaHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--row-busqueda-height').replace('rem', ''));
    const panelMonitoreoVehiclesHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--pm-vehiculos-header-height').replace('rem', ''));
    const treetableHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--treetable-header-height').replace('rem', ''));
    /* this.toastr.success('treeTable altura previa:' + $('.map-area-app').height()!); */
    //console.log('treeTable altura previa en px:' + $('.map-area-app').height()!);
    const rem_to_px = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // var treeTable_height_in_px = $('.map-area-app').height()! - rem_to_px * 4.375;

    //0.125rem es tolerancia para evitar overflow
    //Le quité la tolerancia porque el cálculo ahora es exacto.
    //12.125 era 9.375 + 2.75 (previa altura del navbar)
    var treeTable_height_in_px = $('.map-area-app').height()! - rem_to_px * (rowBusquedaHeight + panelMonitoreoVehiclesHeaderHeight + treetableHeaderHeight + ($('.map-area-app').width()! > 740? 0: navbarHeight)) ;
    //$('p-treetable.vehicle-treetable .cdk-virtual-scroll-viewport').attr("style", '');
    $('p-treetable.vehicle-treetable .cdk-virtual-scroll-viewport').attr('style', 'height: ' + treeTable_height_in_px + 'px !important');
    //console.log('treeTable altura en px:' + treeTable_height_in_px);
  }

  onChangeDisplay(res : boolean){
    this.display = res;
  }
  onConfirmationEdit(){
    this.confirmationService.confirm({
             message: 'Se aplicarán los cambios',
            accept: () => {
                //Actual logic to perform a confirmation
                // //console.log("aceptadoo ....");
                this.onSubmitEdit();
            }
        });
  }
  onSubmitEdit(){
    // //console.log('eviando data para edicion');
    this.loading=true;
    this.formDisplay = 'none';
    if(this.vehicleService.demo){
      //console.log('modo demo, no se enviara info a la DB');
      this.updateGroup();

      this.vehicleService.reloadTableTree.emit();
      this.displayEditGroup = false;
      this.loading=false;
      this.formDisplay = 'block';
    }else{
      const req = {
        type : this.dataEdit.type,
        id : this.dataEdit.id,
        list1 : this.list1,
        list2 : this.list2,
        name : this.nameEdit.nativeElement.value
      };
      this.vehicleConfigService.putGroupUpdate(req).subscribe((info : any)=>{
        // //console.log('result submit',info);
        if(info.res){
          this.updateGroup();
          this.vehicleService.reloadTableTree.emit();
          this.displayEditGroup = false;
          this.loading=false;
          this.formDisplay = 'block';
        }else{

        }
      });

    }
  }
  updateGroup(){
    const vehicles = this.vehicleService.vehicles;
    if(this.dataEdit.type=='grupo'){
      for (const key in this.list1) {
        let index = vehicles.indexOf(this.list1[key]);
        vehicles[index].idgrupo = null;
        vehicles[index].grupo = "Unidades Sin Grupo";

      }

      for (const key in this.list2){
        let index = vehicles.indexOf(this.list2[key]);
        vehicles[index].idgrupo = this.dataEdit.id;
        vehicles[index].grupo = this.nameEdit.nativeElement.value;
      }
      for(const key in vehicles){
        if(vehicles[key].idgrupo==this.dataEdit.id){
          vehicles[key].grupo=this.nameEdit.nativeElement.value
        }
      }
    }else{
      for (const key in this.list1) {
        let index = vehicles.indexOf(this.list1[key]);
        vehicles[index].idconvoy = null;
        vehicles[index].convoy = "Unidades Sin Convoy";

      }

      for (const key in this.list2){
        let index = vehicles.indexOf(this.list2[key]);
        vehicles[index].idconvoy = this.dataEdit.id;
        vehicles[index].convoy = this.nameEdit.nativeElement.value;
      }
      for(const key in vehicles){
        if(vehicles[key].idconvoy==this.dataEdit.id){
          vehicles[key].convoy=this.nameEdit.nativeElement.value;
        }
      }
    }
    this.vehicleService.vehicles = vehicles;
    this.vehicleService.vehiclesTree = this.vehicleService.createNode(vehicles);
  }
  showEditGroup(data: any){
    this.dataEdit = data;
    // //console.log('show edit data',data);
    this.displayEditGroup = true;
    this.textHeaderEdit = data.type+" "+data.name;
    this.nameEdit.nativeElement.value = data.name;

    //list 1
    const vehicles = this.vehicleService.vehicles;
    let aux1=[];
    let aux2=[];
    let aux_idgrupo=-1;
    for (const key in vehicles) {
      // //console.log('id==idconvoy------->'+data.id+'=='+vehicles[key]['idconvoy'])
      if (data.type=='grupo') {
        if(data.id==vehicles[key]['idgrupo']&&vehicles[key]['convoy']=='Unidades Sin Convoy'){
          aux2.push(vehicles[key]);
        }
        aux1 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.grupo=="Unidades Sin Grupo");
      }
      if (data.type=='convoy') {
        if(data.id==vehicles[key]['idconvoy']){
          aux2.push(vehicles[key]);
          aux_idgrupo = vehicles[key]['idgrupo'];
        }
      }
    }
    if(data.type=='convoy'){
      for (const key in vehicles){
        if(vehicles[key]['idgrupo']==aux_idgrupo&&vehicles[key]['convoy']=='Unidades Sin Convoy'){
          // //console.log('unidades sin convoy??',vehicles[key]);
          aux1.push(vehicles[key]);
        }

      }
    }

    this.list2 = aux2;
    this.list1 = aux1;


  }
  showDelete(data: any){
    // //console.log("data",data);
    this.textDelete = data['type'];
    this.displayDelete = true;
    if(data['id']==null){
      //console.log('no hay id');
    }else{
      // //console.log('en proceso de borrado');
      this.idDelete = data['id'];
      this.typeDelete = data['type'];
    }
  }
  upList1(){
    // this.list1=this.selectedList2;
    // this.selectedList2=[];
    let aux: any=[];

    //recupero valores upList2
    for (const key in this.list1) {
      aux.push(this.list1[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList2) {
      // let index = aux.indexOf(this.selectedList2[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList2[key]);
      //console.log(this.selectedList2[key]);
    }
    //inserto valores en list1
    this.list1 = aux;
    //vacio valores de list 2
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list2) {
      let aux_status=false;
      for (const key2 in this.selectedList2) {
        if (this.list2[key]==this.selectedList2[key2]) {
          aux_status=true;
        }
      }
      if(!aux_status){
        aux2.push(this.list2[key]);
      }
    }
    this.list2 = aux2;
    this.selectedList2=[];
  }
  upList2(){
    // this.list2=this.selectedList1;
    // this.selectedList1=[];
    let aux: any=[];

    //recupero valores upList2
    for (const key in this.list2) {
      aux.push(this.list2[key]);
    }
    // inserto valores nuevos
    // //console.log('subir a lista 2');
    for (const key in this.selectedList1) {
      // let index = aux.indexOf(this.selectedList1[key]);
      // //console.log("index====",index);
      aux.push(this.selectedList1[key]);
      // //console.log(this.selectedList1[key]);
    }
    //inserto valores en list2
    this.list2 = aux;
    //vacio valores de list 1
    let aux2: any = [];
    let aux_status = false;
    for (const key in this.list1) {
      let aux_status=false;
      for (const key2 in this.selectedList1) {
        if (this.list1[key]==this.selectedList1[key2]) {
          aux_status=true;
        }
      }
      if(!aux_status){
        aux2.push(this.list1[key]);
      }
    }
    this.list1 = aux2;
    this.selectedList1=[];
  }
  onDelete(){
    this.loadingDelete = true;

    const req = {
      id : this.idDelete,
      vehicles : null
    };
    // //console.log('borrando ...');
    this.buttonDisplay="none";
    this.vehicleConfigService.putGroupDelete(req).subscribe((info: any)=>{
      //console.log('descomponer res = ',info);
      this.loadingDelete = false;
      this.buttonDisplay="block";
      if(info.res){
        let aux_vehicles = info.vehicles;
        let aux_vehicles_tree = this.vehicleService.vehicles;
        for (const key in aux_vehicles) {
          for (const j in aux_vehicles_tree) {
            if (aux_vehicles[key]['id']==aux_vehicles_tree[j]['id']) {
              if(this.typeDelete=='grupo'){
                aux_vehicles_tree[j]['idgrupo']=null;
                aux_vehicles_tree[j]['grupo']='Unidades Sin Grupo';
              }else{
                aux_vehicles_tree[j]['idconvoy']=null;
                aux_vehicles_tree[j]['convoy']='Unidades Sin Convoy';
              }

            }
          }
        }
        this.vehicleService.vehicles = aux_vehicles_tree;
        this.vehicleService.vehiclesTree = this.vehicleService.createNode(aux_vehicles_tree);
        this.vehicleService.reloadTableTree.emit();
        this.textDelete = info.message;
        this.displayDelete = false;
        this.idDelete=-1;
        this.typeDelete='';
      }else{

      }
    });
  }
  onUpdate(res :any){
    const vehicles = this.vehicleService.vehicles;
    // //console.log("vehicles socket",vehicles);

    const resultado = vehicles.find( (vehi: any) => vehi.IMEI == res.IMEI.toString() );
    if(resultado){
      const index = vehicles.indexOf( resultado);

      vehicles[index].id_conductor = res.id_conductor;
      vehicles[index].idgrupo = res.idgrupo;
      vehicles[index].name  = res.name;
      vehicles[index].model = res.model;
      vehicles[index].sim_number  = res.sim_number;
      vehicles[index].plate_number  = res.plate_number;
      vehicles[index].tolva  = res.tolva;
      vehicles[index].empresa  = res.empresa;
      vehicles[index].tipo  = res.tipo;
      vehicles[index].icon  = res.icon;

      this.vehicleService.vehicles = vehicles;

      //reload talbe
      if(this.vehicleService.listTable==0){
        this.vehicleService.reloadTable.emit();
      }else{
        this.vehicleService.reloadTableTree.emit(this.vehicleService.vehiclesTree);
      }
    }
    // this.vehicleService.
  }
  onClickConfig(data: any):void{
    // //console.log("config...vehicle ",data);
    this.config = data;
    this.display = !this.display;

    // //console.log("display-->",this.display);
  }
  ngOnDestroy(): void {
    this.vehicleService.treeTableStatus=false;
    window.removeEventListener('resize', this.treeTableResizing, true);
    screen.orientation.removeEventListener('change', this.treeTableResizing);
  }
  onClickGroup(){
    // this.displayGroup=true;
    this.eventDisplayGroup.emit(true);
    //console.log('displaygroup true');
  }
  onClickSetting(e: string):void{
    console.log("clikc setting",e);
    console.log("clikc setting",this.setting[e]);
    this.setting[e] = !this.setting[e];
    if(this.setting[e]){
      this.column++;
    }else{
      this.column--;
    }
    // //console.log("colmun = ",this.column);
  }
  onClickEye(IMEI: string){
    this.vehicleService.onClickEye(IMEI);
  }
  onClickIcon(IMEI: string){
    this.vehicleService.onClickIcon(IMEI);
  }
  onSort(data: any){
    // //console.log("sort desde tree", data);
    this.sortOrder=data;
  }
  onClickTag(IMEI: string){
    this.vehicleService.onClickTag(IMEI);
  }

  onTableGroup(){
    this.vehicleService.listTable=1;
    this.vehicleService.clickListTable.emit(1);
  }

  onTableGeneral(){
    this.vehicleService.listTable=0;
    this.vehicleService.clickListTable.emit(0);
  }

  onTableTransmision(){

  }

  onClickFollow(rowData: any){
    rowData.follow = !rowData.follow;
    this.followService.add(rowData);
  }

  public onQuickFilterChanged(data: any) {
    // //console.log("tt",this.tt);
    this.tt.filterGlobal(data.target.value, 'contains')
    this.tt.defaultSortOrder=-1;
  }

  getContrastYIQ(hex: string){
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000' : '#fff';
  }

}
