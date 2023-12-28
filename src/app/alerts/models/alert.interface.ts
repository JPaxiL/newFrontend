export interface Alert {
  nr?: number;
  id: string,
  tipo: string,
  nombre?: string,
  activo: string,
  imei: string,
  valor_verificado: string,
  array_geocirc: string,
  sistema_notificacion: string,
  notificacion_email: string,
  notificacion_direcion_email?: string,
  notificacion_sms: boolean,
  notificacion_numero_sms?: string,
  comando_enviado: boolean,
  tipo_comando?: string,
  cadena_comando?: string,
  usuario_id: string,
  fecha_desde: string,
  fecha_hasta: string,
  slug?: string,
  bol_fecha_caducidad: boolean,
  fecha_desdex: string,
  fecha_hastax: string,
  bol_duracion_parada: boolean,
  duracion_parada: string,
  duracion_formato_parada: string,
  int_h_mantenimiento_establecida: string,
  int_h_mantenimiento_antelacion: string,
  bol_fijar_tiempo: boolean,
  tiempo_limite_infraccion: string,
  bol_fijar_velocidad: boolean,
  velocidad_limite_infraccion: string,
  sonido_sistema_bol?:boolean,
  notificacion_email_bol?:boolean,
  activo_bol?:boolean,
  ventana_emergente?:string,
  bol_evaluation?:boolean,
  type_evaluation?: TypeEvaluation,
  event_id?: string,
  evaluations?: Evaluation[],
  evaluated?:number,
}

export type TypeEvaluation = "unique" | "multiple"

export interface Evaluation {
  id?: string,
  usuario_id?: string,
  event_id?: string,
  imei?: string,
  fecha?: string,
  nombre?: string,
  tipo_evento?: string,
  fecha_evaluacion?: string,
  criterio_evaluacion?: string,
  observacion_evaluacion?:string,
  operador_monitoreo?: string,
  senales_posible_fatiga?: boolean,
  identificacion_video?: string,
  valoracion_evento?: string,
  uuid_event?: string
}