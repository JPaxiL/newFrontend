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
        console.log('User Data Info ->: ', data);
        // console.log('User Data obtenida ======> ',  data.data);
        // console.log('User VEHICLES obtenida ======> ',  data.data2);
        // console.log('User CONFIG DATA obtenida ======> ',  data.data3);
        this.typeVehicles = await data.data2;
        this.typeVehiclesUserData = await data.data3;
        this.userData = await data.data;

        // this.crearCarpetaTemporal(this.typeVehiclesUserData);
        let colorHex;
        this.typeVehicles.forEach(
          async (vehicle: {
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
              vehicle.customurl = `./assets/images/objects/nuevo/default/${vehicleFound.var_icono}`;
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
            vehicle.movement_onda = await this.busSVGCallback2(
              colorHex,
              vehicle.customurl
            );
          }
        );
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

  /*   private crearCarpetaTemporal(vehicle: any[]) {
    this.typeVehiclesUserData.forEach(
      async (vehicle: {
        customurl: string;
        var_icono: any;
        name_type: any;
        customsvg: any;
        var_color: string;
      }) => {
        vehicle.customurl = `./assets/images/objects/nuevo/default/${vehicle.var_icono}`;

        vehicle.customsvg = await this.busSVGCallback(
          vehicle.var_color,
          vehicle.customurl
        );

        console.log('TESTUSERDATA', vehicle);

        const customsvgPath = `./assets/images/objects/nuevo/customsvg/${vehicle.var_icono}`;
        this.guardarSVG(customsvgPath, vehicle.customsvg);
      }
    );

    const carpetaTemporalKey = 'carpetaTemporal';

    // Verificar si la carpeta ya existe
    const carpetaTemporalStr = localStorage.getItem(carpetaTemporalKey);

    if (!carpetaTemporalStr) {
      // Si no existe, crearla
      const carpetaTemporal = vehicle;

      localStorage.setItem(carpetaTemporalKey, JSON.stringify(carpetaTemporal));

      console.log('Carpeta temporal creada con éxito:', carpetaTemporal);
    } else {
      console.log('La carpeta temporal ya existe:', carpetaTemporalStr);

      try {
        // Intentar convertir la cadena JSON a un objeto para imprimirlo
        const carpetaTemporal = JSON.parse(carpetaTemporalStr);
        console.log('Contenido de la carpeta temporal:', carpetaTemporal);
      } catch (error) {
        console.error('Error al analizar la carpeta temporal:', error);
      }
    }
  }

  private guardarSVG(filePath: string, svgContent: string) {

    const fs = require('fs');
    fs.writeFileSync(filePath, svgContent, 'utf-8');
  }
*/

  public getSVGcontent(idtype: number) {
    const contentSVG = this.typeVehicles.find(
      (type: { id: number }) => type.id == idtype
    );
    return contentSVG.customsvg;
  }

  public busSVGCallback(var_color: string, customurl: string): Promise<string> {
    /*  console.log('dato2 color', var_color);
    console.log('dato2 url', customurl); */

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

  // gif con ondas

  public busSVGCallback2(
    var_color: string,
    customurl: string
  ): Promise<string> {
    console.log('dato2 color', var_color);
    console.log('dato2 url', customurl);

    return new Promise<string>((resolve, reject) => {
      this.busSVG2(
        customurl,
        var_color,
        (bussvg2: string) => {
          /* console.log('REGRESAAPROMESA', bussvg2); */
          resolve(bussvg2);
        },
        (error: Error) => {
          console.error('Error al cargar el SVG en getUserData:', error);
          reject(error);
        }
      );
    });
  }

  public busSVGdasdsad(
    svgPath: string,
    colorHex: string,
    callback: (result: string) => void,
    errorCallback: (error: Error) => void
) {
    const svgBase64Promise = fetch(svgPath)
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

                // Convertir el SVG a base64
                return `data:image/svg+xml;base64,${btoa(div.innerHTML)}`;
            } else {
                throw new Error('Elemento <style> no encontrado en el SVG.');
            }
        });

    const gifPath = './assets/images/objects/nuevo/gif/onda_verde.gif';

    // Cargar el GIF y convertirlo a base64
    const gifBase64Promise = fetch(gifPath)
        .then((response) => response.blob())
        .then((gifBlob) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };

                reader.onerror = reject;
                reader.readAsDataURL(gifBlob);
            });
        })
        .catch((error) => {
            console.error('Error al cargar el GIF:', error);
            errorCallback(error);
            throw error; // Propagar el error para detener la ejecución
        });

    // Esperar a que ambas promesas se resuelvan
    Promise.all([svgBase64Promise, gifBase64Promise])
        .then(([svgBase64, gifBase64]) => {
            // Crear el contenido HTML combinado
            const combinedHTML = `
                <div style="position: relative;">
                    <img src="${svgBase64}" alt="SVG en Base64" style="width: 24px; height: 24px; position: absolute;" />
                    <img src="${gifBase64}" alt="GIF en Base64" style="width: 24px; height: 24px; position: absolute;" />
                </div>
            `;

            // Llamar al callback con el resultado combinado en base64
            callback(combinedHTML);

            console.log('Contenido HTML combinado en Base64:', combinedHTML);
        })
        .catch((error) => {
            // El error ya fue manejado anteriormente
        });
}

  
  
  

  public busSVG2(
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
  
          // Convertir el SVG a base64
          const bussvg2 = `data:image/svg+xml;base64,${btoa(div.innerHTML)}`;
          const gifPath = './assets/images/objects/nuevo/gif/onda_verde.gif';
  
          // Ahora cargar el GIF
          fetch(gifPath)
            .then((response) => response.blob())
            .then((gifBlob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                // Convertir el GIF a base64
                const gifBase64 = reader.result as string;
  
                // Crear el contenido HTML combinado
                /* const bussvg2 = `
                  <div style="position: relative;">
                    <img src="${svgBase64}" alt="SVG en Base64" style="width: 24px; height: 24px; position: absolute;" />
                    <img src="${gifBase64}" alt="GIF en Base64" style="width: 24px; height: 24px; position: absolute;" />
                  </div>
                `; */
  
                // Llamar al callback con el resultado combinado
                callback(bussvg2);
  
                /* console.log('Contenido HTML combinado:', bussvg2); */
              };
  
              reader.readAsDataURL(gifBlob);
            })
            .catch((error) => {
              console.error('Error al cargar el GIF:', error);
              errorCallback(error);
            });
        } else {
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
}
