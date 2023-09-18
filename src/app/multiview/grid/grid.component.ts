import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { UserTracker } from '../models/interfaces';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  @Input() items: UserTracker[] = [];

  @Output() itemsChange: EventEmitter<UserTracker[]> = new EventEmitter<UserTracker[]>();
  
  //vehicleInfo: any[] = [];

  gridCol = 0;
  gridRow = 0;

  constructor() { }

  ngOnInit(): void {
    this.calculateStructure();
  }
  calculateStructure() {
    //Calculo el numero de columnas y filas
    this.gridCol = this.calcNColumns(this.items.length);
    this.gridRow = this.calcNRows(this.gridCol,this.items.length)
    //calculo la ubicación y distribución de cada item
    //this.vehicleInfo = [];
    for (let i = 0; i < this.items.length; i++) {
      //Calculo la celda a la que ira este item y cuanto span ocupará
      // Todos ocupan un espacio pero el ultimo elemento ocupa todo el resto de la grilla
      const col = (i % this.gridCol) + 1;
      const row = Math.floor(i / this.gridCol) + 1;
      //Si es el ultimo elemento, ocupara el resto de espacios, caso contrario solo uno.
      const span = (i+1 == this.items.length ? (this.gridCol*this.gridRow)-this.items.length+1 : 1); // Si es el último elemento de la fila, ocupa 2 columnas
      this.items[i].row = row;
      this.items[i].col = col;
      this.items[i].span = span;
      this.items[i].structure_index = i;
    }
    console.log("After calculateStruct: ",this.items);
    this.onChangeItems();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Aquí puedes acceder a los cambios en miVariableDeEntrada
    if (changes.items) {
      console.log("items ha cambiado desde el padre");
      this.calculateStructure();
    }
  }
  onChangeItems(){
    this.itemsChange.emit(this.items);
  }

  onChangeDrops(event : any){
    console.log("Hay un cambio en los drops: ", event);
    const {current, exchanged} = event;
  // ME QUEDE ACA, INTENTABA INTERCAMBIAR LA POSICIÓN DE LOS ELEMENTOS PARA VOLVER
  // A IMOPRIMIR LA GRILLA
  }

  calcNColumns(n: number){
    if(n<1){
      return 0;
    }
    // Calcula la raíz cuadrada
    let res = Math.sqrt(n);
    // Redondea al entero superior si es necesario
    if (!Number.isInteger(res)) {
      res = Math.ceil(res);
    }
    return res;
  }

  calcNRows(nCols:number, n:number){
    let res = n/nCols;
    if (!Number.isInteger(res)) {
      res = Math.ceil(res);
    }
    return res;
  }
}
