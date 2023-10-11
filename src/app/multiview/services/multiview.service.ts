import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { GridItem, ScreenView, StructureGrid, UnitItem, UserTracker } from '../models/interfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MultiviewService {
  public userMultiview: ScreenView[] = [];
  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
    private userDataService: UserDataService,
  ) {
    this.loadUserData();
  }

  selectedUnits: UnitItem[] = [];
  
  public getUserMultiview(){
    return this.userMultiview.filter(item => item.name != "default");
  }
  public loadUserData(){
    if(!this.userDataService.userDataInitialized){
      console.log('(multiviewService) User Data no está listo. Subscribiendo para obtener data...');
      this.userDataService.userDataCompleted.subscribe({
        next: (result: boolean) => {
          if(result){
            this.updateMultiviews();
          }
        },
        error: (errMsg: any) => {
          console.log('(multiviewService) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(multiviewService) User Data está listo. Subscribiendo para obtener data...');
      this.updateMultiviews();
    }
  }
  public async initialize() {
    this.spinner.show('loadingDrivers');
  }

  public async updateMultiviews() {
    this.userMultiview.push(...(JSON.parse(this.userDataService.userData.multiview) as ScreenView[]));
    this.userMultiview.map(it => it.was_edited = false);
    console.log("user mv loaded: ",this.userMultiview);
  }

  public getOperations(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${environment.apiUrl}/api/operations`);
  }

  public getTrackersByOperation(operation_id:string): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${environment.apiUrl}/api/operations/trackers/${operation_id}`);
  }
  public saveMultiview(multiview: ScreenView): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${environment.apiUrl}/api/multiview`,{item:multiview});
  }

  public deleteMultiview(name:string): Observable<ResponseInterface> {
    return this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/multiview/${name}`);
  }

  openScreenView(name:string) {
    localStorage.setItem('screen_'+name, JSON.stringify(this.getMultiviewByName(name)));
    const url = `/multiview/${name}`;
    const newTab = window.open(url, '_blank');
    if (newTab) {
      // Enfoca la nueva ventana si se abrió correctamente
      newTab.focus();
    } else {
      // Manejar el caso en que las ventanas emergentes están bloqueadas
      alert('El bloqueo de ventanas emergentes puede estar impidiendo abrir una nueva ventana.');
    }
  }

  getMultiviewByName(name:string){
    console.log("multiviews: ", this.userMultiview);
    return this.userMultiview.filter( item => item.name == name);
  }

  getMultiviewFromLocalStorage(name: string){
    return JSON.parse(localStorage.getItem('screen_'+name)!);
  }


  exchangeItems(list:any[], current_item:any, exchanged_item: any){
    // Encontrar los índices de los objetos en el array
    const currentIndex = list.findIndex((obj:any) =>
      Object.keys(current_item).every(key =>
        obj[key] === current_item[key]
      )
    );

    const exchangedIndex = list.findIndex((obj:any) =>
      Object.keys(exchanged_item).every(key =>
        obj[key] === exchanged_item[key]
      )
    );

    // Intercambiar los objetos en el array si se encuentran
    if (currentIndex !== -1 && exchangedIndex !== -1) {
      const objTemp = list[currentIndex];
      list[currentIndex] = list[exchangedIndex];
      list[exchangedIndex] = objTemp;
    }
    return list;
  }

  calculateStructure(structures: StructureGrid[]) {
    //The "nombre" attribute must exist in objects inside items array.
    //Calculo el numero de columnas y filas
    const gridCol = this.calcNColumns(structures.length);
    const gridRow = this.calcNRows(gridCol,structures.length)
    //calculo la ubicación y distribución de cada item
    //this.vehicleInfo = [];
    const structureGrids: StructureGrid[] = [];
    for (let i = 0; i < structures.length; i++) {
      //Calculo la celda a la que ira este item y cuanto span ocupará
      // Todos ocupan un espacio pero el ultimo elemento ocupa todo el resto de la grilla
      const col = (i % gridCol) + 1;
      const row = Math.floor(i / gridCol) + 1;
      //Si es el ultimo elemento, ocupara el resto de espacios, caso contrario solo uno.
      const span = (i+1 == structures.length ? (gridCol*gridRow)-structures.length+1 : 1); // Si es el último elemento de la fila, ocupa 2 columnas
      const structureGrid:StructureGrid = {
        row: row,
        col: col,
        span: span,
        structure_index: i,
        gridItem_id: structures[i].gridItem_id,
      }
      structureGrids.push(structureGrid)
    }
    return structureGrids;
  }
  calculateStructureFromUnitItems(unitItems: UnitItem[]) {
    //The "nombre" attribute must exist in objects inside items array.
    //Calculo el numero de columnas y filas
    const gridCol = this.calcNColumns(unitItems.length);
    const gridRow = this.calcNRows(gridCol,unitItems.length)
    //calculo la ubicación y distribución de cada item
    //this.vehicleInfo = [];
    const structureGrids: StructureGrid[] = [];
    for (let i = 0; i < unitItems.length; i++) {
      //Calculo la celda a la que ira este item y cuanto span ocupará
      // Todos ocupan un espacio pero el ultimo elemento ocupa todo el resto de la grilla
      const col = (i % gridCol) + 1;
      const row = Math.floor(i / gridCol) + 1;
      //Si es el ultimo elemento, ocupara el resto de espacios, caso contrario solo uno.
      const span = (i+1 == unitItems.length ? (gridCol*gridRow)-unitItems.length+1 : 1); // Si es el último elemento de la fila, ocupa 2 columnas
      const structureGrid:StructureGrid = {
        row: row,
        col: col,
        span: span,
        structure_index: i,
        gridItem_id: unitItems[i].nombre,
      }
      structureGrids.push(structureGrid)
    }
    return structureGrids;
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

  public arraysAreEqual(arr1:any, arr2: any) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    arr1.sort((a:any, b:any) => a.name - b.name);
    arr2.sort((a:any, b:any) => a.name - b.name);
  
    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];
      // Compara los atributos de los objetos en cada posición
      if (!this.objectsAreEqual(obj1, obj2)) {
        return false;
      }
    }
    return true;
  }
  
  private objectsAreEqual(obj1:any, obj2:any) {
    // Compara los atributos de los objetos
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

}
