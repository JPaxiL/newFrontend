import { Injectable, Output, EventEmitter, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Vehicle } from 'src/app/vehicles/models/vehicle';


@Injectable({
  providedIn: 'root',
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
  changeItemIcon: string = '';

  reportsUser: any;
  eventsUser: any;
  reportsUserLoaded: boolean = false;
  changeRotateIcon: boolean= false;

  stateVehiclesDirectionSvg: boolean = false;
  stateCustomDirectionSvg: boolean = false;

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public spinner: NgxSpinnerService,
    
  ) {}

  async getUserData() {
    console.log('USER DATA SERVICE LOADING');
    //tambien llamamos los tipos de vehicles
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: async (data) => {
        //this.userData = this.panelService.userData = data[0];
        console.log('User Data Info ->: ', data);
        // console.log('User Data obtenida ======> ',  data.data);
        // console.log('User VEHICLES obtenida ======> ',  data.data2);
        // console.log('User CONFIG DATA obtenida ======> ',  data.data3);
        this.typeVehicles = await data.data2;
        this.typeVehiclesUserData = await data.data3;
        this.userData = await data.data;
        this.changeItemIcon =  await this.getChangeItemColor();
        this.changeRotateIcon = await this.userData.bol_direction;

        // this.crearCarpetaTemporal(this.typeVehiclesUserData);
        let colorHex;
        this.typeVehicles.forEach(
          async (vehicle: {
            customurldownright: any;
            customurldownleft: any;
            customurlupright: any;
            customurlupleft: any;
            customurlright: any;
            customurlleft: any;
            customurldown: any;
            customurltop: any;

            customDirectionSvg: any ;
            relentiDirectionSvg: any ;
            excessDirectionSvg: any ;
            movementDirectionSvg: any ;

            customSanitizerSvg: any;



            id: any;
            var_icono: any;
            var_color: any;
            customurl: any;
            icon_url: any;
            customsvg: any;
            relenti_svg: any;
            excess_svg: any;
            movement_svg: any;
            movement_onda: any;
          }) => {
            const vehicleFound = this.typeVehiclesUserData.find(
              (type: {
                var_color: string;
                var_icono: string;
                type_vehicle_id: number;
              }) => type.type_vehicle_id == vehicle.id
            );
            if (vehicleFound) {
              vehicle.customurl = `./assets/images/objects/nuevo/default/${vehicleFound.var_icono}`; // tomado como direccion arriba y direccion abajo 

              // vehicle.customurltop = `./assets/images/objects/nuevo/default/up/${vehicleFound.var_icono}`; // falta svg o se usa el default
              // vehicle.customurldown = `./assets/images/objects/nuevo/default/down/${vehicleFound.var_icono}`; // falta svg o se usa el default
              // vehicle.customurlleft = `./assets/images/objects/nuevo/default/left/${vehicleFound.var_icono}`;
              // vehicle.customurlright = `./assets/images/objects/nuevo/default/right/${vehicleFound.var_icono}`;
              // vehicle.customurlupleft = `./assets/images/objects/nuevo/default/upleft/${vehicleFound.var_icono}`;
              // vehicle.customurlupright = `./assets/images/objects/nuevo/default/upright/${vehicleFound.var_icono}`;
              // vehicle.customurldownleft = `./assets/images/objects/nuevo/default/downleft/${vehicleFound.var_icono}`;
              // vehicle.customurldownright = `./assets/images/objects/nuevo/default/downright/${vehicleFound.var_icono}`;

              vehicle.icon_url = `backup/${vehicleFound.var_color}/${vehicleFound.var_icono}`;
              vehicle.var_icono = vehicleFound.var_icono;
              colorHex = vehicleFound.var_color;
            } else {
              vehicle.customurl = `./assets/images/objects/nuevo/default/${vehicle.var_icono}`;
              vehicle.icon_url = `backup/c4c2c1/${vehicle.var_icono}`;
              vehicle.var_icono = vehicle.var_icono;
              colorHex = 'c4c2c1';
            }



            vehicle.customsvg = await this.busSVGCallback(
              colorHex,
              vehicle.customurl
            );

            
            vehicle.customSanitizerSvg = await this.sanitizer.bypassSecurityTrustResourceUrl(vehicle.customsvg);

            if(this.changeItemIcon== "vehicles"){
              vehicle.excess_svg = await this.busSVGCallback(
                'FB472A',
                vehicle.customurl
              );

              vehicle.relenti_svg = await this.busSVGCallback(
                '0396F6',
                vehicle.customurl
              );
              vehicle.movement_svg = await this.busSVGCallback(
                '04DE04',
                vehicle.customurl
              );

              if( this.changeRotateIcon == true){ 
                vehicle.relentiDirectionSvg = await this.generateDirectionSvg('0396F6',vehicle.customurl);
                vehicle.excessDirectionSvg = await this.generateDirectionSvg('FB472A',vehicle.customurl);
                vehicle.movementDirectionSvg = await this.generateDirectionSvg('04DE04',vehicle.customurl);

                 if(vehicle.relentiDirectionSvg && vehicle.excessDirectionSvg && vehicle.movementDirectionSvg){
                  this.stateVehiclesDirectionSvg= true;
                } 
                
              }

            }
            
            if( this.changeRotateIcon == true){
              vehicle.customDirectionSvg = await this.generateDirectionSvg(colorHex,vehicle.customurl);
              
               if(vehicle.customDirectionSvg){
              this.stateCustomDirectionSvg = true;
              } 
            }


          },
          console.log("SUPREMOVECHICLE",this.typeVehicles)
        );
        console.log("sanitizar",this.typeVehicles)
        this.userName = data.data.nombre_usuario
          .normalize('NFKD')
          .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '')
          .replace(/  +/g, ' ')
          .trim();
        this.userEmail = data.data.var_email;
        this.companyName = data.data.var_nombre_comercial; //Otro var_razon_social
        this.userDataInitialized = true;
        this.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
        
        console.log('USER DATA SERVICE LOADED');
        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);

        console.log('vehicle');
      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      },
    });
  }

  public getDirectionSvg(type: string,state:string,direction?:string):any{

      const typeConfigVehicle = this.typeVehicles.find(
        (typevh: { 
          relentiDirectionSvg: any ;
          excessDirectionSvg: any ;
          movementDirectionSvg: any ;
          customsvg: any;
          relenti_svg: any;
          excess_svg: any;
          movement_svg: any;
          customDirectionSvg: any,
          id: number }) => typevh.id == parseInt(type)
      );
      if(!direction){
        if(state == 'default'){
          return typeConfigVehicle.customsvg;
        }else if(state == 'excess'){
          return typeConfigVehicle.excess_svg;
        } else if(state=='movement'){
          return typeConfigVehicle.movement_svg;
        } else if(state == 'relenti'){
          return typeConfigVehicle.relenti_svg;
        }
      } else{
        if(state == 'default'){
           return this.getDirection(typeConfigVehicle.customDirectionSvg,direction); 
          
        }else if(state == 'excess'){
          return this.getDirection(typeConfigVehicle.excessDirectionSvg,direction); 
          
        } else if(state=='movement'){
          return this.getDirection(typeConfigVehicle.movementDirectionSvg,direction);
          
        } else if(state == 'relenti'){
           return this.getDirection(typeConfigVehicle.relentiDirectionSvg,direction); 
          
        }
      }
  }

  private getDirection(directionssvg:any,direction:string):string {
    if(direction == 'upleft'){
      return directionssvg.UpLeft
    }else if(direction == 'downleft'){
      return directionssvg.DownLeft
    }else if(direction == 'left'){
      return directionssvg.Left
    }else if(direction == 'right'){
      return directionssvg.Right
    }else if(direction == 'upright'){
      return directionssvg.UpRight
    }else if(direction == 'downright'){
      return directionssvg.DownRight
    }
    return directionssvg.DownLeft
  }

  public async generateDirectionSvg(color:string, url: string):Promise<any>
  {
    var urlDirectionUpLeft = url.replace('default/','default/upleft/');
    var urlDirectionDownLeft = url.replace('default/','default/downleft/');
    var urlDirectionLeft = url.replace('default/','default/left/');
    var urlDirectionRight = url.replace('default/','default/right/');
    var urlDirectionUpRight = url.replace('default/','default/upright/');
    var urlDirectionDownRight = url.replace('default/','default/downright/');


    return {
       UpLeft : await this.busSVGCallback(color,urlDirectionUpLeft),
       DownLeft : await this.busSVGCallback(color,urlDirectionDownLeft),
       Left : await this.busSVGCallback(color,urlDirectionLeft),
       Right : await this.busSVGCallback(color,urlDirectionRight),
       UpRight : await this.busSVGCallback(color,urlDirectionUpRight),
       DownRight : await this.busSVGCallback(color,urlDirectionDownRight),
    }

  }

  public async getSanitizerSVG(idtype: number) {
    const contentSVG = this.typeVehicles.find(
      (type: { id: number }) => type.id == idtype
    );
    return contentSVG.customSanitizerSvg;
  }

  public busSVGCallback(var_color: string, customurl: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      this.busSVG(
        customurl,
        var_color,
        (bussvg: string) => {
          resolve(bussvg);
        },
        (error: Error) => {
          console.error('Error al cargar el SVG en getUserData:', error);
          reject(error);
        }
      );
    });
  }

  public busSVG(
    svgPath: string,
    colorHex: string,
    callback: (result: string) => void,
    errorCallback: (error: Error) => void
  ) {
    fetch(svgPath)
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
        const styleElement = svgDocument.querySelector('style');

        if (styleElement) {
          let styleContent = styleElement.innerHTML;
          styleContent = styleContent.replace(/\.cls-14\s*\{[^}]*\}/, (match) =>
            match.replace(/fill\s*:\s*#[^;]*/, `fill: #${colorHex}`)
          );
          styleElement.innerHTML = styleContent;

          const div = document.createElement('div');
          div.appendChild(svgDocument.documentElement.cloneNode(true));

          //const bussvg = div.innerHTML;

          const bussvg = `data:image/svg+xml;base64,${btoa(div.innerHTML)}`;
          callback(bussvg);
          /*  console.log('Icon URL actualizado:', bussvg); */
        } else {
          /*  console.log('Elemento <style> no encontrado en el SVG.'); */
          errorCallback(new Error('Elemento <style> no encontrado en el SVG.'));
        }
      })
      .catch((error) => {
        console.error('Error al cargar el SVG:', error);
        errorCallback(error);
      });
  }




  public getReportsForUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/getPermissReports`);
  }

  updateUserConfig(updatedUserConfig: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/userconfig`,
      updatedUserConfig
    );
  }
  changePasswordUser(infoUser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/changePassword`, infoUser);
  }

  get firstLetter() {
    let letter = this.userName.charAt(0);
    if (letter === letter.toLowerCase()) {
      return letter.toUpperCase();
    } else {
      return letter;
    }
  }

  //FUNCION PARA SABER SI EL VEHICULO CAMBIA ESTADO O NO
  async getChangeItemColor() {
    if (this.userData.bol_ondas) {
      return 'ondas';
    } else if (this.userData.bol_vehicle) {
      return 'vehicles';
    } else if (this.userData.bol_cursor) {
      return 'cursor';
    } else {
      return '';
    }
  }

  async setDefaultStatusUserData() {
    this.userDataInitialized = false;
  }
}
