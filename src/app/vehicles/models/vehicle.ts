export class Vehicle {
  constructor(
    public IMEI: string,
    public active: boolean,
    public altitud: number,
    public angulo: string,
    public bol_correctivo_fin: boolean,
    public bol_correctivo_ini: boolean,
    public convoy: string,
    public dat_correctivo_fin: string,
    public dat_correctivo_ini: string,
    public dt_server: string,
    public dt_tracker: string,
    public empresa: string | null,
    public grupo: string,
    public icon: string,
    public id: number,
    public id_conductor: number | null,
    public idconvoy: number | null,
    public idgrupo: number | null,
    public iluminaria_h_i: string,
    public int_correctivo_h: number,
    public int_preventivo_h: number,
    public latitud: string,
    public longitud: string,
    public model: string | null,
    public name: string,
    public nombre_conductor: string | null,
    public parametros: string,
    public plate_number: string,
    public señal_gps: number,
    public señal_gsm: number,
    public sim_number: string,
    public speed: number,
    public tanque: string,
    public tipo: string,
    public tolva: string
  ){}
}
