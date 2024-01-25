export interface Driver {
    id: number;
    nombre_conductor: string;
    nro_llave: string;
    nro_cipia: string;
    dni_conductor: string;
    telefono_conductor: string;
    nro_licencia:string;
    activo:boolean;
    tracker_imei:string;
    tracker_nombre:string;
    tipo_identificacion:string[];
    id_keyIbutton?:number;
    id_keyIcipia?:number;
    // Otras propiedades del objeto driver, si las hay
  }

  export interface Ibutton {
    id: number;
    value?: string;
    var_llave?: string;
    company_id?: number;
    usuario_id?: number;
  }
  export interface Icipia {
    id: number;
    value: string;
  }

  export type HistoryDriver = {
    id_driver: number;
    name_driver: number;
    type_key: number;
    nro_key: string;
    fecha_ini: Date;
    fecha_fin: Date;
  }