import { Injectable, Output, EventEmitter, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

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

  @Output() userDataCompleted = new EventEmitter<any>();
  @Output() geofencesPrivileges = new EventEmitter<any>();
  @Output() geopointsPrivileges = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public spinner: NgxSpinnerService
  ) {}

  async getUserData() {
    console.log('USER DATA SERVICE LOADING');
    //tambien llamamos los tipos de vehicles
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: async (data) => {
        //this.userData = this.panelService.userData = data[0];

        this.typeVehicles = await data.data2;

        this.typeVehiclesUserData = await data.data3;

        this.userData = await data.data;

        this.typeVehiclesUserData.forEach(
          async (vehicle: {
            customurl: string;
            var_icono: any;
            name_type: any;
            customsvg: any;
            var_color: string;
          }) => {
            vehicle.customurl = `./assets/images/objects/nuevo/${vehicle.name_type.toLowerCase()}/${
              vehicle.var_icono
            }`;

            vehicle.customsvg = await this.busSVGCallback(
              vehicle.var_color,
              vehicle.customurl
            );

            console.log('TESTUSERDATA', vehicle);
          }
        );

        console.log('TYPEVEHICLES', this.typeVehiclesUserData);

        console.log('User Data obtenida ======> ', data.data);
        console.log('User VEHICLES obtenida ======> ', data.data2);
        console.log('User CONFIG DATA obtenida ======> ', data.data3);

        this.userName = data.data.nombre_usuario
          .normalize('NFKD')
          .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '')
          .replace(/  +/g, ' ')
          .trim();
        this.userEmail = data.data.var_email;
        this.companyName = data.data.var_nombre_comercial; //Otro var_razon_social
        this.userDataInitialized = true;
        this.spinner.hide('loadingAlertData'); // Nombre opcional, puedes usarlo para identificar el spinner
        this.changeItemIcon = this.getChangeItemColor();
        console.log('USER DATA SERVICE LOADED');

        /* this.busSVGCallback(); */

        this.userDataCompleted.emit(true);
        this.geofencesPrivileges.emit(true);
        this.geopointsPrivileges.emit(true);
      },
      error: (errorMsg) => {
        console.log('No se pudo obtener datos del usuario', errorMsg);
      },
    });
  }

  public getSVGcontent(idtype: number) {
    const contentSVG = this.typeVehiclesUserData.find(
      (type: { type_vehicle_id: number }) => type.type_vehicle_id == idtype
    );
    return contentSVG.customsvg;
  }

  public busSVGCallback(var_color: string, customurl: string): Promise<string> {
    /* const dato2 = this.typeVehiclesUserData;

    console.log('Datos2', dato2);

    const colorHex = dato2[0].var_color;
    const svgPath = dato2[0].customurl;
*/
    console.log('dato2 color', var_color);
    console.log('dato2 url', customurl);

    return new Promise<string>((resolve, reject) => {
      this.busSVG(
        customurl,
        var_color,
        (bussvg: string) => {
          console.log('Icon URL actualizado en getUserData:', bussvg);
          resolve(bussvg);
        },
        (error: Error) => {
          console.error('Error al cargar el SVG en getUserData:', error);
          reject(error);
        }
      );
    });
  }

  /* public busSVGCallback(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const dato2 = this.typeVehiclesUserData;
  
      console.log('Datos2', dato2);
  
      const colorHex = dato2[0].var_color;
      const svgPath = dato2[0].customurl;
  
      console.log('dato2 color', colorHex);
      console.log('dato2 url', svgPath);
  
      this.busSVG(
        svgPath,
        colorHex,
        (bussvg: string) => {
          console.log('Icon URL actualizado en getUserData:', bussvg);
          resolve(bussvg); // Resuelve la promesa con la URL actualizada
        },
        (error: Error) => {
          console.error('Error al cargar el SVG en getUserData:', error);
          reject(error); // Rechaza la promesa en caso de error
        }
      );
    });
  } */

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
  getChangeItemColor() {
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

  private busSVG(
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

          const bussvg = `data:image/svg+xml;base64,${btoa(div.innerHTML)}`;
          callback(bussvg);
          console.log('Icon URL actualizado:', bussvg);
        } else {
          console.log('Elemento <style> no encontrado en el SVG.');
          errorCallback(new Error('Elemento <style> no encontrado en el SVG.'));
        }
      })
      .catch((error) => {
        console.error('Error al cargar el SVG:', error);
        errorCallback(error);
      });
  }
}
