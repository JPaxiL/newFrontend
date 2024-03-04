export const getIconUrlHistory = (event: any): string => {
  let iconUrl = '';
  if (event.tipo == 'zona-de-entrada') {
    iconUrl = 'assets/images/events-history/entrada_zona.svg';
  } else if (event.tipo == 'zona-de-salida') {
    iconUrl = 'assets/images/events-history/salida_zona.svg';
  } else if (event.tipo == 'sos') {
    iconUrl = 'assets/images/events-history/sos.svg';
  } else if (event.tipo == 'tiempo-estadio-zona') {
    iconUrl = 'assets/images/events-history/tiempo_estadia_zona.svg';
  } else if (event.tipo == 'parada-en-zona-no-autorizada') {
    iconUrl = 'assets/images/events-history/parada_zona_no_autorizada.svg';
  } else if (event.tipo == 'manipulacion-de-dispositivo') {
    iconUrl = 'assets/images/events-history/manipulacion_gps.svg';
  } else if (event.tipo == 'dvr-operativo') {
    iconUrl = 'assets/images/events-history/dvr_operativo.svg';
  } else if (event.tipo == 'dvr-inoperativo') {
    iconUrl = 'assets/images/events-history/dvr_inoperativo.svg';
  } else if (event.tipo == 'antena-gps-desconectada') {
    iconUrl = 'assets/images/events-history/antena_gps_desconectada.svg';
  } else if (event.tipo == 'mantenimiento-correctivo') {
    iconUrl = 'assets/images/events-history/mant_correctivo.svg';
  } else if (event.tipo == 'mantenimiento-preventivo') {
    iconUrl = 'assets/images/events-history/mant_preventivo.svg';
  } else if (event.tipo == 'mantenimiento-correctivo-realizado') {
    iconUrl = 'assets/images/events-history/mant_correctivo_realizado.svg';
  } else if (event.tipo == 'mantenimiento-preventivo-realizado') {
    iconUrl = 'assets/images/events-history/mant_preventivo_realizado.svg';
  } else if (event.tipo == 'exceso-velocidad') {
    iconUrl = 'assets/images/events-history/exceso_velocidad.svg';
  } else if (event.tipo == 'infraccion') {
    iconUrl = 'assets/images/events-history/infraccion.svg';
  } else if (event.tipo == 'vehiculo-sin-programacion') {
    iconUrl = 'assets/images/events-history/sin_programacion.svg';
  } else if (event.tipo == 'frenada-brusca') {
    iconUrl = 'assets/images/events-history/frenada_brusca.svg';
  } else if (event.tipo == 'aceleracion-brusca') {
    iconUrl = 'assets/images/events-history/aceleracion_brusca.svg';
  } else if (event.tipo == 'bateria-desconectada') {
    iconUrl = 'assets/images/events-history/bateria_desconectada.svg';
  } else if (event.tipo == 'motor-encendido') {
    iconUrl = 'assets/images/events-history/motor_encendido.svg';
  } else if (event.tipo == 'motor-apagado') {
    iconUrl = 'assets/images/events-history/motor_apagado.svg';
  } else if (event.tipo == 'posible-fatiga') {
    iconUrl = 'assets/images/events-history/posible_fatiga.svg';
  } else if (event.tipo == 'fatiga-extrema') {
    iconUrl = 'assets/images/events-history/fatiga_extrema.svg';
  } else if (event.tipo == 'distraccion') {
    iconUrl = 'assets/images/events-history/distraccion.svg';
  } else if (event.tipo == 'desvio-de-carril-izquierda') {
    iconUrl = 'assets/images/events-history/desvio_izquierda.svg';
  } else if (event.tipo == 'desvio-de-carril-derecha') {
    iconUrl = 'assets/images/events-history/desvio_derecha.svg';
  } else if (event.tipo == 'bloqueo-vision-mobileye') {
    iconUrl = 'assets/images/events-history/bloqueo_mobileye.svg';
  } else if (event.tipo == 'colision-peatones') {
    iconUrl = 'assets/images/events-history/colision_peaton.svg';
  } else if (event.tipo == 'anticolision-frontal') {
    iconUrl = 'assets/images/events-history/colision_delantera.svg';
  } else if (event.tipo == 'no-rostro') {
    iconUrl = 'assets/images/events-history/no-rostro.svg';
  } else if (event.tipo == 'conductor-no-identificado') {
    iconUrl = 'assets/images/events-history/conductor-no-rostro.svg';
  } else if (event.tipo == 'conductor-identificado') {
    iconUrl = 'assets/images/events-history/conductor_identificado.svg';
  } else if (event.tipo == 'error-calibracion-360') {
    iconUrl = 'assets/images/events-history/error_calibracion_360.svg';
  } else if (event.tipo == 'error-de-camara-360') {
    iconUrl = 'assets/images/events-history/error_de_camara_360.svg';
  } else if (event.tipo == 'ignicion-desactivada-360') {
    iconUrl = 'assets/images/events-history/ignicion_desactivada_360.svg';
  } else if (event.tipo == 'ignicion-activada-360') {
    iconUrl = 'assets/images/events-history/ignicion_activada_360.svg';
  } else if (event.tipo == 'conductor-distraido-360') {
    iconUrl = 'assets/images/events-history/conductor_distraido_360.svg';
  } else if (event.tipo == 'conductor-adormitado-360') {
    iconUrl = 'assets/images/events-history/conductor_adormitado_360.svg';
  } else if (event.tipo == 'conductor-somnoliento-360') {
    iconUrl = 'assets/images/events-history/conductor_somnoliento_360.svg';
  } else if (event.tipo == 'conductor-fumando-360') {
    iconUrl = 'assets/images/events-history/conductor_fumando_360.svg';
  } else if (event.tipo == 'cinturon-desabrochado-360') {
    iconUrl = 'assets/images/events-history/cinturon_desabrochado_360.svg';
  } else if (event.tipo == 'uso-de-celular-360') {
    iconUrl = 'assets/images/events-history/celular_detectado_360.svg';
  } else if (event.tipo == 'inicio-sistema-ok-360') {
    iconUrl = 'assets/images/events-history/inicio_sistema_ok_360.svg';
  } else if (event.tipo == 'error-sistema-360') {
    iconUrl = 'assets/images/events-history/error_sistema_360.svg';
  } else if (event.tipo == 'sistema-ok-360') {
    iconUrl = 'assets/images/events-history/sistema_ok_360.svg';
  } else if (event.tipo == 'sistema-reseteado-360') {
    iconUrl = 'assets/images/events-history/sistema_reseteado_360.svg';
  } else if (event.tipo == 'deteccion-manipulacion-360') {
    iconUrl = 'assets/images/events-history/deteccion_manipulacion_360.svg';
  } else if (event.tipo == 'conductor-no-identificado-360') {
    iconUrl = 'assets/images/events-history/conductor_no_identificado_360.svg';
  } else if (event.tipo == 'cambio-conductor-360') {
    iconUrl = 'assets/images/events-history/cambio_conductor_360.svg';
  } else if (event.tipo == 'conductor-ausente-360') {
    iconUrl = 'assets/images/events-history/conductor_ausente_360.svg';
  } else if (event.tipo == 'conductor-identificado-360') {
    iconUrl = 'assets/images/events-history/conductor_identificado_360.svg';
  } else if (event.tipo == 'actualizacion-estado-gps-360') {
    iconUrl = 'assets/images/events-history/actualizacion_gps_icon_360.svg';
  } else {
    iconUrl = 'assets/images/eventos/pin_point.svg';
  }
  return iconUrl;
};

export const getIconUrlPopups = (event: any): string => {
  let iconUrl = '';
  if (event.tipo == 'zona-de-entrada') {
    iconUrl = 'assets/images/events-icons/entrada_zona.svg';
  } else if (event.tipo == 'zona-de-salida') {
    iconUrl = 'assets/images/events-icons/salida_zona.svg';
  } else if (event.tipo == 'sos') {
    iconUrl = 'assets/images/events-icons/sos.svg';
  } else if (event.tipo == 'tiempo-estadio-zona') {
    iconUrl = 'assets/images/events-icons/tiempo_estadia_zona.svg';
  } else if (event.tipo == 'parada-en-zona-no-autorizada') {
    iconUrl = 'assets/images/events-icons/parada_zona_no_autorizada.svg';
  } else if (event.tipo == 'manipulacion-de-dispositivo') {
    iconUrl = 'assets/images/events-icons/manipulacion_gps.svg';
  } else if (event.tipo == 'dvr-operativo') {
    iconUrl = 'assets/images/events-icons/dvr_operativo.svg';
  } else if (event.tipo == 'dvr-inoperativo') {
    iconUrl = 'assets/images/events-icons/dvr_inoperativo.svg';
  } else if (event.tipo == 'antena-gps-desconectada') {
    iconUrl = 'assets/images/events-icons/antena_gps_desconectada.svg';
  } else if (event.tipo == 'mantenimiento-correctivo') {
    iconUrl = 'assets/images/events-icons/mant_correctivo.svg';
  } else if (event.tipo == 'mantenimiento-preventivo') {
    iconUrl = 'assets/images/events-icons/mant_preventivo.svg';
  } else if (event.tipo == 'mantenimiento-correctivo-realizado') {
    iconUrl = 'assets/images/events-icons/mant_correctivo_realizado.svg';
  } else if (event.tipo == 'mantenimiento-preventivo-realizado') {
    iconUrl = 'assets/images/events-icons/mant_preventivo_realizado.svg';
  } else if (event.tipo == 'exceso-velocidad') {
    iconUrl = 'assets/images/events-icons/exceso_velocidad.svg';
  } else if (event.tipo == 'infraccion') {
    iconUrl = 'assets/images/events-icons/infraccion.svg';
  } else if (event.tipo == 'vehiculo-sin-programacion') {
    iconUrl = 'assets/images/events-icons/sin_programacion.svg';
  } else if (event.tipo == 'frenada-brusca') {
    iconUrl = 'assets/images/events-icons/frenada_brusca.svg';
  } else if (event.tipo == 'aceleracion-brusca') {
    iconUrl = 'assets/images/events-icons/aceleracion_brusca.svg';
  } else if (event.tipo == 'bateria-desconectada') {
    iconUrl = 'assets/images/events-icons/bateria_desconectada.svg';
  } else if (event.tipo == 'motor-encendido') {
    iconUrl = 'assets/images/events-icons/motor_encendido.svg';
  } else if (event.tipo == 'motor-apagado') {
    iconUrl = 'assets/images/events-icons/motor_apagado.svg';
  } else if (event.tipo == 'posible-fatiga') {
    iconUrl = 'assets/images/events-icons/posible_fatiga.svg';
  } else if (event.tipo == 'fatiga-extrema') {
    iconUrl = 'assets/images/events-icons/fatiga_extrema.svg';
  } else if (event.tipo == 'distraccion') {
    iconUrl = 'assets/images/events-icons/distraccion.svg';
  } else if (event.tipo == 'distraccion-360') {
    iconUrl = 'assets/images/events-icons/distraccion.svg';
  } else if (event.tipo == 'desvio-de-carril-izquierda') {
    iconUrl = 'assets/images/events-icons/desvio_izquierda.svg';
  } else if (event.tipo == 'desvio-de-carril-derecha') {
    iconUrl = 'assets/images/events-icons/desvio_derecha.svg';
  } else if (event.tipo == 'bloqueo-vision-mobileye') {
    iconUrl = 'assets/images/events-icons/bloqueo_mobileye.svg';
  } else if (event.tipo == 'colision-peatones') {
    iconUrl = 'assets/images/events-icons/colision_peaton.svg';
  } else if (event.tipo == 'anticolision-frontal') {
    iconUrl = 'assets/images/events-icons/colision_delantera.svg';
  } else if (event.tipo == 'no-rostro') {
    iconUrl = 'assets/images/events-icons/no-rostro.svg';
  } else if (event.tipo == 'conductor-no-identificado') {
    iconUrl = 'assets/images/events-icons/conductor-no-rostro.svg';
  } else if (event.tipo == 'conductor-identificado') {
    iconUrl = 'assets/images/events-icons/conductor_identificado.svg';
  } else if (event.tipo == 'error-calibracion-360') {
    iconUrl = 'assets/images/events-icons/error_calibracion_360.svg';
  } else if (event.tipo == 'error-de-camara-360') {
    iconUrl = 'assets/images/events-icons/error_de_camara_360.svg';
  } else if (event.tipo == 'ignicion-desactivada-360') {
    iconUrl = 'assets/images/events-icons/ignicion_desactivada_360.svg';
  } else if (event.tipo == 'ignicion-activada-360') {
    iconUrl = 'assets/images/events-icons/ignicion_activada_360.svg';
  } else if (event.tipo == 'conductor-distraido-360') {
    iconUrl = 'assets/images/events-icons/conductor_distraido_360.svg';
  } else if (event.tipo == 'conductor-adormitado-360') {
    iconUrl = 'assets/images/events-icons/conductor_adormitado_360.svg';
  } else if (event.tipo == 'conductor-somnoliento-360') {
    iconUrl = 'assets/images/events-icons/conductor_somnoliento_360.svg';
  } else if (event.tipo == 'conductor-fumando-360') {
    iconUrl = 'assets/images/events-icons/conductor_fumando_360.svg';
  } else if (event.tipo == 'cinturon-desabrochado-360') {
    iconUrl = 'assets/images/events-icons/cinturon_desabrochado_360.svg';
  } else if (event.tipo == 'uso-de-celular-360') {
    iconUrl = 'assets/images/events-icons/celular_detectado_360.svg';
  } else if (event.tipo == 'inicio-sistema-ok-360') {
    iconUrl = 'assets/images/events-icons/inicio_sistema_ok_360.svg';
  } else if (event.tipo == 'error-sistema-360') {
    iconUrl = 'assets/images/events-icons/error_sistema_360.svg';
  } else if (event.tipo == 'sistema-ok-360') {
    iconUrl = 'assets/images/events-icons/sistema_ok_360.svg';
  } else if (event.tipo == 'sistema-reseteado-360') {
    iconUrl = 'assets/images/events-icons/sistema_reseteado_360.svg';
  } else if (event.tipo == 'deteccion-manipulacion-360') {
    iconUrl = 'assets/images/events-icons/deteccion_manipulacion_360.svg';
  } else if (event.tipo == 'conductor-no-identificado-360') {
    iconUrl = 'assets/images/events-icons/conductor_no_identificado_360.svg';
  } else if (event.tipo == 'cambio-conductor-360') {
    iconUrl = 'assets/images/events-icons/cambio_conductor_360.svg';
  } else if (event.tipo == 'conductor-ausente-360') {
    iconUrl = 'assets/images/events-icons/conductor_ausente_360.svg';
  } else if (event.tipo == 'conductor-identificado-360') {
    iconUrl = 'assets/images/events-icons/conductor_identificado_360.svg';
  } else if (event.tipo == 'actualizacion-estado-gps-360') {
    iconUrl = 'assets/images/events-icons/actualizacion_gps_icon_360.svg';
  } else {
    iconUrl = 'assets/images/eventos/pin_point.svg';
  }
  return iconUrl;
};
export const getContentPopup = (event: any, d: any = '...') => {
  const iconUrl = getIconUrlPopups(event);

  if (event.tipo == 'zona-de-entrada') {
    //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        name_driver: event.namedriver,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: event.referencia,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'zona-de-salida') {
    //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,
        velocidad: event.velocidad,
        referencia: event.referencia,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'tiempo-estadio-zona') {
    //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        tiempo_estadia: event.tiempo_limite,
        referencia: event.referencia,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'parada-en-zona-no-autorizada') {
    //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        tiempo_tolerancia: event.tiempo_limite,
        referencia: event.referencia,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
    //INICIO ULTIMOS CREADOS 16/02/2024
  } else if (event.tipo == 'manipulacion-de-dispositivo') {
    return render_leaflet_tootlip({}, iconUrl);
  } else if (event.tipo == 'dvr-operativo') {
    return render_leaflet_tootlip({}, iconUrl);
  } else if (event.tipo == 'dvr-inoperativo') {
    return render_leaflet_tootlip({}, iconUrl);
  } else if (event.tipo == 'antena-gps-desconectada') {
    return render_leaflet_tootlip({}, iconUrl);

    //FIN ULTIMOS CREADOS 16/02/2024
  } else if (event.tipo == 'mantenimiento-correctivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        int_mant_ultimo_mantenimiento: event.int_mant_ultimo_mantenimiento,
        int_mant_horas_transcurridas: event.int_mant_horas_transcurridas,
        int_mant_horas_restantes: event.int_mant_horas_restantes,
        int_mant_odometro: event.int_mant_odometro,
        referencia: event.referencia,
      },
      iconUrl
    );
  } else if (event.tipo == 'mantenimiento-preventivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        int_mant_ultimo_mantenimiento: event.int_mant_ultimo_mantenimiento,
        int_mant_horas_transcurridas: event.int_mant_horas_transcurridas,
        int_mant_horas_restantes: event.int_mant_horas_restantes,
        int_mant_odometro: event.int_mant_odometro,
        referencia: event.referencia,
      },
      iconUrl
    );
  } else if (event.tipo == 'mantenimiento-correctivo-realizado') {
    var t_restante = string_diffechas(
      new Date(event.dat_correctivo_ini.replace(/-/g, '/')),
      new Date(event.dat_correctivo_fin.replace(/-/g, '/'))
    );
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        int_mant_ultimo_mantenimiento: event.int_mant_odometro,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'mantenimiento-preventivo-realizado') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        ultimo_mantenimiento: event.int_mant_odometro,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } /* else if (event.tipo == 'SOS') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/sos.svg'
    );
  } */ else if (event.tipo == 'exceso-velocidad') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        velocidad_limite: event.velocidad_limite,
        referencia: event.referencia,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'infraccion') {
    if (event.nombre_zona == '') {
      return render_leaflet_tootlip(
        {
          tipo: event.nombre ?? event.name,
          nombre_objeto: event.nombre_objeto,
          latitud: event.latitud,
          longitud: event.longitud,
          name_driver: event.namedriver,
          velocidad: event.velocidad,
          velocidad_limite: event.velocidad_limite,
          referencia: event.referencia,
          fecha_tracker: event.fecha_tracker,
        },
        iconUrl
      );
    } else if (event.nombre_zona != '') {
      // PLATAFORMA
      return render_leaflet_tootlip(
        {
          tipo: event.nombre ?? event.name,
          nombre_objeto: event.nombre_objeto,
          latitud: event.latitud,
          longitud: event.longitud,
          name_driver: event.namedriver,
          velocidad_unidad: event.velocidad,
          velocidad_limite: event.velocidad_limite,
          tiempo_limite_infraccion: event.tiempo_limite_infraccion,
          referencia: event.referencia,
          geocerca: event.nombre_zona,
          fecha_tracker: event.fecha_tracker,
        },
        iconUrl
      );
    }
  } else if (event.tipo == 'vehiculo-sin-programacion') {
    //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'frenada-brusca') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'sos') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/sos.svg'
    );
  } else if (event.tipo == 'aceleracion-brusca') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'bateria-desconectada') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        voltaje: event.voltaje,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'motor-encendido') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      //'assets/images/events-icons/motor.svg'
      iconUrl
    );
  } else if (event.tipo == 'motor-apagado') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      //'assets/images/events-icons/motor.svg'
      iconUrl
    );
  } else if (event.tipo == 'posible-fatiga') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      // 'assets/images/events-icons/fatiga.svg'
      iconUrl
    );
  } else if (event.tipo == 'fatiga-extrema') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      // 'assets/images/events-icons/fatiga.svg'
      iconUrl
    );
  } else if (event.tipo == 'distraccion') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      //'assets/images/events-icons/distraccionWhite.svg'
      iconUrl
    );
  } else if (event.tipo == 'distraccion-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'desvio-de-carril-izquierda') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'desvio-de-carril-derecha') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'bloqueo-vision-mobileye') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'colision-peatones') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
    //Falta icono
  } else if (
    event.tipo == 'anticolision-frontal' ||
    event.tipo == 'anticolision-frontal'
  ) {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/colision_delantera.svg'
    );
  } /* else if (event.tipo == 'posible-fatiga') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/posible-fatiga.svg'
    );
  } */ /* else if (event.tipo == 'fatiga-extrema') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/fatiga.svg'
    );
  } */ else if (event.tipo == 'no-rostro') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-no-identificado') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-identificado') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
      },
      iconUrl
    );
  } else if (event.tipo == 'error-calibracion-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } /* else if (event.tipo == 'error-de-camara-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      'assets/images/events-icons/bloqueo_mobileye.svg'
    );
  } */ else if (event.tipo == 'ignicion-desactivada-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      //'assets/images/events-icons/motor.svg'
      iconUrl
    );
  } else if (event.tipo == 'ignicion-activada-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },

      //'assets/images/events-icons/motor.svg',
      iconUrl
    );
  } else if (event.tipo == 'conductor-distraido-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-adormitado-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-somnoliento-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '', // En eventos de cipia añado la url generada
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-fumando-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'cinturon-desabrochado-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'uso-de-celular-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'error-de-camara-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'inicio-sistema-ok-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      // 'assets/images/events-icons/mant_correctivo_realizado.png'
      iconUrl
    );
  } else if (event.tipo == 'error-sistema-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'sistema-ok-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      // 'assets/images/events-icons/mant_correctivo_realizado.png'
      iconUrl
    );
  } else if (event.tipo == 'sistema-reseteado-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      // 'assets/images/events-icons/mant_preventivo.png'
      iconUrl
    );
  } else if (event.tipo == 'deteccion-manipulacion-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-no-identificado-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'cambio-conductor-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-ausente-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'conductor-identificado-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  } else if (event.tipo == 'actualizacion-estado-gps-360') {
    return render_leaflet_tootlip(
      {
        tipo: event.nombre ?? event.name,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        name_driver: event.namedriver,

        velocidad: event.velocidad,
        referencia: event.referencia,
        fecha_tracker: event.fecha_tracker,
        videoUrl: event.videoUrl ?? '',
        parametros: event.parametros,
        imei: event.imei,
      },
      iconUrl
    );
  }

  return '';
};

function string_diffechas(a: any, b: any) {
  var c = Math.floor((b - a) / 1000) % 60;
  var d = Math.floor((b - a) / 60000) % 60;
  var e = Math.floor((b - a) / 3600000) % 24;
  var f = Math.floor((b - a) / 86400000);
  var g;

  if (f > 0) {
    g = '' + f + ' d ' + e + ' h ' + d + ' min ' + c + ' s';
  } else if (e > 0) {
    g = '' + e + ' h ' + d + ' min ' + c + ' s';
  } else if (d > 0) {
    g = '' + d + ' min ' + c + ' s';
  } else if (c >= 0) {
    g = '' + c + ' s';
  }
  return g;
}

function render_leaflet_tootlip(event_content: any, icon_src: string) {
  return `
    <style>
    .icon_modal_events{
      font-size:13px; 
      display:flex !important; 
      justify-content:center !important;
      align-items:center !important;
    }

    .text_modal_events{
      font-size:0.8rem;
    }


    </style>

    <div style="padding: 0.2rem;">
      <div class="d-flex flex-row" style="font-size: 0.8rem; gap: 1rem; padding-bottom: 0.5rem;">
        <div class="d-flex flex-column justify-content-center" style="height: 45px;">
          <div>
            <img src="${icon_src}" style="max-width: 45px !important; height: 45px; color:red !important"/>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-center fw-bold" style="text-transform: uppercase;">
          <span>EVENTO:</span>
          <span class="text_modal_events">${event_content.tipo}</span>
        </div>
      </div>
      
      <div class="container">
        ${
          typeof event_content.nombre_objeto !== 'undefined'
            ?
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Unidad"><i class="fas fa-car" ></i></span>
              </div>
              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.nombre_objeto}</span>
              </div>
            </div>
          </div>
          `
          : ''
          }
        

        ${
          typeof event_content.name_driver !== 'undefined'
            ?
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Conductor"><i class="fas fa-user-circle"></i></span>
              </div>
              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.name_driver}</span>
              </div>
            </div>
          </div>
          `
          : ''
          }
        
          


        ${
          typeof event_content.luminaria !== 'undefined'
            ?
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-user-circle"></i>LUMINARIA:</span>
              </div>  
              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.luminaria}</span>
              </div>
            </div>
          </div>
          `
          : ''
          }
      

        ${
          typeof event_content.latitud !== 'undefined' &&
          typeof event_content.latitud !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Ubicacion"><i class="fas fa-crosshairs"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events"><a href="http://maps.google.com/maps?q=${event_content.latitud},${event_content.longitud}&amp;t=m" target="_blank" style="color:white !important">${event_content.latitud} °,  ${event_content.longitud} °</a></span>
              </div>
            </div>
          </div>
          `
          : ''
        }


        ${
          typeof event_content.int_mant_ultimo_mantenimiento !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">ÚLTIMO MANTENIMIENTO:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.int_mant_ultimo_mantenimiento} h</span>
              </div>
            </div>
          </div>
          `
            : ''
        }
        ${
          typeof event_content.int_mant_horas_transcurridas !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">HORAS TRANSCURRIDAS:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.int_mant_horas_transcurridas} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.int_mant_horas_restantes !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">HORAS RESTANTES:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.int_mant_horas_restantes} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.int_mant_odometro !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">ODÓMETRO ACTUAL:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.int_mant_odometro} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.ultimo_mantenimiento !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">ÚLTIMO MANTENIMIENTO:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.ultimo_mantenimiento} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.voltaje !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">VOLTAJE:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.voltaje} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.nombre_zona !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">ZONA:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.nombre_zona}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.velocidad !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Velocidad"><i class="fas fa-shipping-fast"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.velocidad} km/h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.velocidad_unidad !== 'undefined'
            ?
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-shipping-fast">VELOCIDAD:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.velocidad_unidad} km/h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.velocidad_limite !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Limite de Velocidad"><i class="fas fa-tachometer-alt"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.velocidad_limite} km/h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.tiempo_limite_infraccion !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">LÍMITE DE TIEMPO</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.tiempo_limite_infraccion} h</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.tiempo_tolerancia !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">TIEMPO DE TOLERANCIA</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.tiempo_tolerancia}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.tiempo_estadia !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span><i class="fas fa-crosshairs">TIEMPO DE ESTADÍA:</i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.tiempo_estadia}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.geocerca !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Geocerca"><i class="fas fa-road"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.geocerca}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        ${
          typeof event_content.referencia !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Referencia"><i class="fas fa-map-marked-alt"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.referencia}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }

        ${
          typeof event_content.fecha_tracker !== 'undefined'
            ? 
          `
          <div class="col-12">
            <div class="row">
              <div class="col-1 icon_modal_events">
                <span data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Fecha - Hora"><i class="fas fa-calendar-alt"></i></span>
              </div>

              <div class="col-10 ps-0">
                <span class="text_modal_events">${event_content.fecha_tracker}</span>
              </div>
            </div>
          </div>
          `
          : ''
        }
        


      </div>


      <!--<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <colgroup>
          <col style="width:1%"></col>
          <col style="width:99%"></col>
        </colgroup>
        <tbody style="font-size: 0.7rem;">
          ${
            typeof event_content.nombre_objeto !== 'undefined'
              ? `<tr><td>UNIDAD:</i></td><td>${event_content.nombre_objeto}</td></tr>`
              : ''
          }
          ${
            typeof event_content.name_driver !== 'undefined'
              ? `<tr><td> CONDUCTOR:</td><td>${event_content.name_driver}</td></tr>`
              : ''
          }
          ${
            typeof event_content.luminaria !== 'undefined'
              ? `<tr><td> LUMINARIA:</td><td>${event_content.luminaria}</td></tr>`
              : ''
          }
          ${
            typeof event_content.latitud !== 'undefined' &&
            typeof event_content.latitud !== 'undefined'
              ? `<tr><td>UBICACIÓN:</td><td><a href="http://maps.google.com/maps?q=${event_content.latitud},${event_content.longitud}&amp;t=m" target="_blank">${event_content.latitud} °,  ${event_content.longitud} °</a></td></tr>`
              : ''
          }
          ${
            typeof event_content.int_mant_ultimo_mantenimiento !== 'undefined'
              ? `<tr><td> ÚLTIMO MANTENIMIENTO:</td><td>${event_content.int_mant_ultimo_mantenimiento} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.int_mant_horas_transcurridas !== 'undefined'
              ? `<tr><td>HORAS TRANSCURRIDAS:</td><td>${event_content.int_mant_horas_transcurridas} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.int_mant_horas_restantes !== 'undefined'
              ? `<tr><td>HORAS RESTANTES:</td><td>${event_content.int_mant_horas_restantes} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.int_mant_odometro !== 'undefined'
              ? `<tr><td>ODÓMETRO ACTUAL:</td><td>${event_content.int_mant_odometro} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.ultimo_mantenimiento !== 'undefined'
              ? `<tr><td>ÚLTIMO MANTENIMIENTO:</td><td>${event_content.ultimo_mantenimiento} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.voltaje !== 'undefined'
              ? `<tr><td>VOLTAJE:</td><td>${event_content.voltaje}</td></tr>`
              : ''
          }
          ${
            typeof event_content.nombre_zona !== 'undefined'
              ? `<tr><td>ZONA:</td><td>${event_content.nombre_zona}</td></tr>`
              : ''
          }
          ${
            typeof event_content.velocidad !== 'undefined'
              ? `<tr><td>VELOCIDAD:</td><td>${event_content.velocidad} km/h</td></tr>`
              : ''
          }
          ${
            typeof event_content.velocidad_unidad !== 'undefined'
              ? `<tr><td>VELOCIDAD:</td><td>${event_content.velocidad_unidad} km/h</td></tr>`
              : ''
          }
          ${
            typeof event_content.velocidad_limite !== 'undefined'
              ? `<tr><td>LÍMITE DE VELOCIDAD:</td><td>${event_content.velocidad_limite} km/h</td></tr>`
              : ''
          }
          ${
            typeof event_content.tiempo_limite_infraccion !== 'undefined'
              ? `<tr><td>LÍMITE DE TIEMPO:</td><td>${event_content.tiempo_limite_infraccion} h</td></tr>`
              : ''
          }
          ${
            typeof event_content.tiempo_tolerancia !== 'undefined'
              ? `<tr><td>TIEMPO DE TOLERANCIA:</td><td>${event_content.tiempo_tolerancia}</td></tr>`
              : ''
          }
          ${
            typeof event_content.tiempo_estadia !== 'undefined'
              ? `<tr><td>TIEMPO DE ESTADÍA:</td><td>${event_content.tiempo_estadia}</td></tr>`
              : ''
          }
          ${
            typeof event_content.geocerca !== 'undefined'
              ? `<tr><td>GEOCERCA:</td><td>${event_content.geocerca}</td></tr>`
              : ''
          }
          ${
            typeof event_content.referencia !== 'undefined'
              ? `<tr><td>REFERENCIA:</td><td>${event_content.referencia}</td></tr>`
              : ''
          }

          ${
            typeof event_content.fecha_tracker !== 'undefined'
              ? `<tr><td>FECHA - HORA:</td><td>${event_content.fecha_tracker}</td></tr>`
              : ''
          }
        </tbody>
      </table>-->
      

      ${
        event_content.parametros && event_content.parametros.gps == 'cipia'
          ? '<div class="multimedia-slider" id="multimedia-' +
            event_content.parametros.eventId +
            '"></div>'
          : ''
      }
    
    
      </div>`;
}

export const getIcon = (event_type: string) => {
  let icon = '';
  switch (event_type) {
    case 'Zona de entrada':
      icon = 'assets/images/events-icons/entrada_zona.svg';
      break;
    case 'Zona de salida':
      icon = 'assets/images/events-icons/salida_zona.svg';
      break;
    case 'Tiempo de estadia en zona':
      icon = 'assets/images/events-icons/tiempo_estadia_zona.svg';
      break;
    case 'parada-en-zona-no-autorizada':
      icon = 'assets/images/events-icons/parada_zona_no_autorizada.svg';
      break;
    case 'Mantenimiento correctivo':
      icon = 'assets/images/events-icons/mant_correctivo.svg';
      break;
    case 'Mantenimiento preventivo':
      icon = 'assets/images/events-icons/mant_preventivo.svg';
      break;
    case 'Mantenimiento correctivo realizado':
      icon = 'assets/images/events-icons/mant_correctivo_realizado.svg';
      break;
    case 'Mantenimiento preventivo realizado':
      icon = 'assets/images/events-icons/mant_preventivo_realizado.svg';
      break;
    case 'SOS':
      icon = 'assets/images/events-icons/sos.svg';
      break;
    case 'Exceso de Velocidad':
      icon = 'assets/images/events-icons/exceso_velocidad.svg';
      break;
    case 'Infraccion':
      icon = 'assets/images/events-icons/infraccion.svg';
      break;
    case 'Vehiculo sin programacion':
      icon = 'assets/images/events-icons/sin_programacion.svg';
      break;
    case 'Frenada brusca':
      icon = 'assets/images/events-icons/frenada_brusca.svg';
      break;
    case 'Aceleracion brusca':
      icon = 'assets/images/events-icons/aceleracion_brusca.svg';
      break;
    case 'Bateria desconectada':
      icon = 'assets/images/events-icons/bateria_desconectada.svg';
      break;
    case 'Motor Encendido':
      icon = 'assets/images/events-icons/motor.svg';
      break;
    case 'Motor apagado':
      icon = 'assets/images/events-icons/motor.svg';
      break;
    case 'Fatiga':
      icon = 'assets/images/events-icons/fatiga.svg';
      break;
    case 'Somnolencia':
      icon = 'assets/images/events-icons/somnolenciaWhite.svg';
      break;
    case 'Distraccion':
    case 'Distracción':
      icon = 'assets/images/events-icons/distraccionWhite.svg';
      break;
    case 'Desvío de carril hacia la izquierda':
      icon = 'assets/images/events-icons/desvio_izquierda.svg';
      break;
    case 'Desvío de carril hacia la derecha':
      icon = 'assets/images/events-icons/desvio_derecha.svg';
      break;
    case 'Bloqueo de visión del mobileye':
      icon = 'assets/images/events-icons/bloqueo_mobileye.svg';
      break;
    case 'Colisión con peatones':
      // Falta icono
      icon = '';
      break;
    case 'Colisión delantera':
    case 'Anticolisión frontal':
      icon = 'assets/images/events-icons/colision_delantera.svg';
      break;
    case 'Posible Fatiga':
      icon = 'assets/images/events-icons/posible-fatiga.svg';
      break;
    case 'Fatiga Extrema':
      icon = 'assets/images/events-icons/fatiga.svg';
      break;
    case 'No Rostro':
      icon = 'assets/images/events-icons/conductor-no-rostro.svg';
      break;
    default:
      icon = '';
      break;
  }

  return icon;
};
