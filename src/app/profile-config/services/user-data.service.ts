import { Injectable, Output, EventEmitter, ElementRef  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  svgContents: { [key: string]: string } = {}; // Almacena los contenidos de los SVG
  svgContentsSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsGreenSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsBlueSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG
  svgContentsRedSafe: { [key: string]: SafeHtml } = {}; // Almacena los contenidos seguros de los SVG

  userData: any = {};
  userName: string = '';
  userEmail: string = '';
  companyName: string = '';
  userDataInitialized: boolean = false;
  userConfigDataInitialized: boolean = false;
  apiUrl = environment.apiUrl; 
  typeVehicles: any = {};
  typeVehiclesUserData: any = {};
  changeItemIcon :string = '';

  reportsUser : any;
  eventsUser : any;
  reportsUserLoaded: boolean = false;  

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(private http: HttpClient,private sanitizer: DomSanitizer,public spinner: NgxSpinnerService) {}

  getUserData(){
    console.log('Getting User Data');
    //tambien llamamos los tipos de vehicles
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: async data => {
        //this.userData = this.panelService.userData = data[0];
        console.log('User DataFULL obtenida: ',data);
        // console.log('User Data obtenida ======> ',  data.data);
        // console.log('User VEHICLES obtenida ======> ',  data.data2);
        // console.log('User CONFIG DATA obtenida ======> ',  data.data3);
        this.typeVehicles = await data.data2;
        this.typeVehiclesUserData = await data.data3;
        // await this.getTypeVehiclesForUser();
        // await this.getUserConfigData();
        this.userData = await data.data;
        this.userName = data.data.nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
        this.userEmail = data.data.email;
        this.companyName = data.data.company_name;
        this.userDataInitialized = true;
        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);
        this.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
        // await this.preloadSVGs();
        this.changeItemIcon = this.getChangeItemColor();

      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      }});
  }


  public getReportsForUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/getPermissReports`);
  }

  updateUserConfig(updatedUserConfig: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/userconfig`, updatedUserConfig);
  } 
  changePasswordUser(infoUser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/changePassword`, infoUser);
  } 

  //PARA ICONOS SVG PRELOAD
  async preloadSVGs() {
    console.log('INICIANDO Preload SVGS ...');
    let svgNames: string[] = this.typeVehiclesUserData.map((vehicle: any) => vehicle.var_icono);
    if (!svgNames.length || !this.typeVehiclesUserData.length){
      svgNames = this.typeVehicles.map((vehicle: any) => vehicle.var_icono);
    }
    svgNames.forEach(async (svgName) => {
      const svgPath = `assets/images/objects/nuevo/${svgName}`;
      const svgContent = await this.http.get(svgPath, { responseType: 'text' }).toPromise();
      
      // Obtener el color correspondiente para este SVG
      const svgUserData = this.typeVehiclesUserData.find((vehicle: any) => vehicle.var_icono == svgName);
      const userColor = svgUserData ? svgUserData.var_color : '#c3c4c4'; // Color por defecto si no se encuentra
      //c3c4c4 color gris
      const modifiedSVG = await this.modifyUserSVG(svgContent, userColor); // Modificar el SVG cargado con el color
      const sanitizedSVG = this.sanitizer.bypassSecurityTrustHtml(modifiedSVG); // Sanitizar el SVG
      this.svgContents[svgName] = svgContent;
      this.svgContentsSafe[svgName] = sanitizedSVG; // Almacenar el SVG sanitizado
      // console.log(`Contenido de `, svgNames); // Mostrar contenido del SVG cargado en la consola
    });
  }

  get firstLetter(){
    let letter = this.userName.charAt(0);
    if(letter === letter.toLowerCase()){
      return letter.toUpperCase();
    }else{
      return letter;
    }
  }


  //FUNCION PARA SABER SI EL VEHICULO CAMBIA ESTADO O NO
  getChangeItemColor(){
    if (this.userData.bol_ondas){
      return 'ondas';
    }else if (this.userData.bol_vehicle){
      return 'vehicles';
    }else if (this.userData.bol_cursor){
      return 'cursor';
    }else{
      return '';
    }
  }

  
  
  async modifyUserSVG(svgContent: string, color: string): Promise<string> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.documentElement;
  
    // Buscar todos los elementos que tienen la clase .body dentro del SVG
    const bodyElements = svgElement.querySelectorAll('.body');
  
    if (bodyElements) {
      // Modificar el color de todos los elementos con la clase .body
      bodyElements.forEach(async (bodyElement) => {
       await bodyElement.setAttribute('style', `fill: ${color}`);
      });
    }

    return svgElement.outerHTML;
  }

  getSVGContentSafe(svgName: string): SafeHtml | undefined {
    const svgRaw = this.svgContents[svgName];
    if (svgRaw) {
      return this.sanitizer.bypassSecurityTrustHtml(svgRaw);
    }
    return ''; // En caso de que el SVG no esté disponible
  }

  getSVGContent(svgName: string): string {
    return this.svgContents[svgName]; // Retorna el contenido del SVG, si está cargado
  }

  async colorTypeVehicleDefault(typeVehicleId: string): Promise<string> {
    const vehiculoEncontrado = this.typeVehiclesUserData.find((vehiculo: { type_vehicle_id: any; }) => vehiculo.type_vehicle_id == typeVehicleId);
    let var_icono;
    let var_color;

    if (vehiculoEncontrado) {
      var_icono = vehiculoEncontrado.var_icono;
      var_color = vehiculoEncontrado.var_color;
    } else {
      // console.log('NO ENCONTRO EL ICONO ...');
      const vehicleInTypeVehicles = this.typeVehicles.find((vh: { id: any; }) => vh.id == typeVehicleId);
      var_icono = vehicleInTypeVehicles.var_icono;
      var_color = '#c3c4c4';
      // console.log(var_icono,var_color);
    }

    const svgContent = await this.getSVGContent(var_icono);
    return this.modifySVGColor(svgContent, var_color,var_icono);
  }

  modifySVGColor(svgContent: string, color: string,var_icono:string): string {
    const div = document.createElement('div');
    div.innerHTML = svgContent;
    // console.log('ANTES ......',div.innerHTML);
    // Obtener el elemento específico que deseas cambiar
    //POR DEFECTO SOLO SE DEBERA MODIFICAR LA CLASE BODY
    if (color != '#c3c4c4'){
      let bodyElements: NodeListOf<HTMLElement>;
      if (var_icono == 'carga.svg') {
        bodyElements = div.querySelectorAll('.cls-4') as NodeListOf<HTMLElement>;
        // console.log('Se ecnontra una carga.svg -->',div.innerHTML);
      } else {
        bodyElements = div.querySelectorAll('.body') as NodeListOf<HTMLElement>;
        // Cambiar el color del elemento
         bodyElements.forEach((bodyElement: HTMLElement) => {
          bodyElement.style.fill = color;
        });
      }
      
    }else{
      const def = document.createElement('div');
      return def.innerHTML=svgContent;
    }
    // Obtener el string del SVG modificado
    const modifiedSVGString = new XMLSerializer().serializeToString(div);
    // console.log(modifiedSVGString);

    return modifiedSVGString;
    // return div.innerHTML;
  }


}