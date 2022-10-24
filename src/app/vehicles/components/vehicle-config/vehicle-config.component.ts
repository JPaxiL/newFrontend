import { Component, ElementRef, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';

import {ConfirmationService} from 'primeng-lts/api';

import { VehicleConfigService } from '../../services/vehicle-config.service';


@Component({
  selector: 'app-vehicle-config',
  templateUrl: './vehicle-config.component.html',
  styleUrls: ['./vehicle-config.component.scss']
})
export class VehicleConfigComponent implements OnInit {

  @Input('display') display: boolean = false;
  @Input('config') config: any = [];
  @Output() eventDisplay = new EventEmitter<boolean>();
  @Output() eventUpdate = new EventEmitter<any>();

  @ViewChild('name',{ static:true}) name!: ElementRef;
  @ViewChild('sim',{ static:true}) sim!: ElementRef;
  @ViewChild('placa',{ static:true}) placa!: ElementRef;
  @ViewChild('tolva',{ static:true}) tolva!: ElementRef;
  @ViewChild('empresa',{ static:true}) empresa!: ElementRef;

  loading : boolean = false;
  formDisplay : string = "flex";
  /* formDisplay : string = "block"; */



  selectedIcon: any = {};
  selectedType: any = {};
  vehicle: any = {};

  types: any = [
    {id: '0', name: 'BUS'},
    {id: '1', name: 'MINIBUS'},
    {id: '2', name: 'VAN'},
    {id: '3', name: 'CAMIONETA'},
    {id: '4', name: 'CONCENTRADO'}
  ];
  /*

  campos bloqueadoes
  imei
  Conductor
  GRUPO
  tamque

  */
  groups: any = [
    { name: "CLIENTES TACNA", id:'0'},
    { name: "GPSTEL", id:'1'},
    { name: "Unidades Sin Grupo", id:'2'},
    { name: "WARI SERVICE", id:'3'}

  ];
  icons: any = [
    { name: "1.png", code: "1" },
    { name: "2.png", code: "2" },
    { name: "3.png", code: "3" },
    { name: "4.png", code: "4" },
    { name: "5.png", code: "5" },
    { name: "6.png", code: "6" },
    { name: "7.png", code: "7" },
    { name: "8.png", code: "8" },
    { name: "9.png", code: "9" },
    { name: "10.png", code: "10" },
    { name: "11.png", code: "11" },
    { name: "12.png", code: "12" },
    { name: "13.png", code: "13" },
    { name: "14.png", code: "14" },
    { name: "15.png", code: "15" },
    { name: "16.png", code: "16" },
    { name: "17.png", code: "17" },
    { name: "18.png", code: "18" },
    { name: "19.png", code: "19" },
    { name: "20.png", code: "20" },
    { name: "26.png", code: "26" },
    { name: "31.png", code: "31" },
    { name: "33.png", code: "33" },
    { name: "34.png", code: "34" },
    { name: "41.png", code: "41" },
    { name: "42.png", code: "42" },
    { name: "43.png", code: "43" },
    { name: "44.png", code: "44" },
    { name: "45.png", code: "45" },
    { name: "46.png", code: "46" },
    { name: "47.png", code: "47" }

  ];

  constructor(private configService: VehicleConfigService, private confirmationService: ConfirmationService) {}


  ngOnInit(): void {

  }
  onShow(){
    for (const key in this.icons) {
      if (this.icons[key].name==this.config.icon) {
        this.selectedIcon = {
          name: this.icons[key].name,
          code:this.icons[key].code
        }
      }
    }
    this.selectedType = {
      name: this.types[this.config.tipo]['name'],
      id: this.config.tipo,
    };

  }
  onClickCancel(){
    this.eventDisplay.emit(false);
  }
  confirm(){
    this.confirmationService.confirm({
             message: 'Se aplicarán los cambios',
            accept: () => {
                //Actual logic to perform a confirmation
                // //console.log("aceptadoo ....");
                this.onSubmit();
            }
        });
  }
  onSubmit(){

    this.vehicle = {
      IMEI: this.config.IMEI,
      id_conductor: this.config.id_conductor,
      idgrupo: this.config.idgrupo,
      name : this.valueNull(this.name.nativeElement.value),
      model: this.config.model,
      sim_number : this.valueNull(this.sim.nativeElement.value),
      plate_number : this.valueNull(this.placa.nativeElement.value),
      tolva : this.valueNull(this.tolva.nativeElement.value),
      empresa : this.valueNull(this.empresa.nativeElement.value),
      tipo : this.selectedType.id,
      icon : this.selectedIcon.name,
      int_correctivo_h: this.config.int_correctivo_h,
      int_preventivo_h : this.config.int_preventivo_h,
      bol_correctivo_ini : this.config.bol_correctivo_ini,
      bol_correctivo_fin : this.config.bol_correctivo_fin,
      dat_correctivo_ini : this.config.dat_correctivo_ini,
      dat_correctivo_fin : this.config.dat_correctivo_fin

    };


    // //console.log("vehicle config = ",this.config);
    // //console.log("vehicle edit = ",this.vehicle);
    //procesando info
    this.loading=true;
    this.formDisplay = "none";

    //end procesando info
    this.configService.putConfig(this.vehicle).subscribe((info:any) => {
      // //console.log(info);
      if(info.res){
        //update data local
        //mensaje de exito
        this.eventUpdate.emit(this.vehicle);
        this.eventDisplay.emit(false);
        this.loading=false;
        this.formDisplay = "flex";
        /* this.formDisplay = "block"; */
      }else{
        //mensaje de error
      }
    });
  }
  valueNull(a: string){
    if(a.length==0){
      return null;
    }else{
      return a;
    }
  }

}
