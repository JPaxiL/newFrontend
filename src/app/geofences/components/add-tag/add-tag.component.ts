import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { GeofencesService } from '../../services/geofences.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {

  @Input('display') display: boolean = false;
  @Output() onHideEvent = new EventEmitter<boolean>();

  @ViewChild('name',{ static:true}) name!: ElementRef;
  @ViewChild('description',{ static:true}) description!: ElementRef;

  stateOptions: any[];
  paymentOptions: any[];

  loading : boolean = false;
  list1: any=[];
  selectedList1: any=[];
  list2: any=[];
  selectedList2: any=[];
  nameTarget: string = "";

  option: string="operacion";

  constructor(
    private geofecesService: GeofencesService,
  ) {
    this.stateOptions = [
      { label: "Operacion", value: "operacion" },
      { label: "Etiqueta", value: "grupo" }
    ];
    this.paymentOptions = [
      { name: "Option 1", value: 1 },
      { name: "Option 2", value: 2 },
      { name: "Option 3", value: 3 }
    ];
   }

  ngOnInit(): void {
  }
  onHide(){
    this.onHideEvent.emit(false);
  }
  onShow(){
    this.onOption(this.option);
  }

  onOption(e : string){
    this.list1 = [];
    this.list2 = [];
  }

  onName(data: any){
    this.nameTarget = data.target.value;
  }

  upList2(){

  }

  upList1(){}
  validateRepeatName (name: string,type: string){}
  validateFormsInputs(){}

  onConfirmTag(){}

}
