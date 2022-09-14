export const getContentPopup = (event: any, d: any = '...') => {
  if (event.tipo == 'Zona de entrada') { //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/entrada_zona.svg'
    );

  } else if (event.tipo == 'Zona de salida') { //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/salida_zona.svg'
    );

  } else if (event.tipo == 'Tiempo de estadia en zona') { //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        tiempo_estadia: event.tiempo_limite,
        referencia: d,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/tiempo_estadia_zona.svg',
    );

  } else if (event.tipo == 'Parada en zona no autorizada') { //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        tiempo_tolerancia: event.tiempo_limite,
        referencia: d,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/parada_zona_no_autorizada.svg',
    );

  } else if (event.tipo == 'Mantenimiento correctivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        int_mant_ultimo_mantenimiento: event.int_mant_ultimo_mantenimiento,
        int_mant_horas_transcurridas: event.int_mant_horas_transcurridas,
        int_mant_horas_restantes: event.int_mant_horas_restantes,
        int_mant_odometro: event.int_mant_odometro,
      },
      'assets/images/events-icons/mant_correctivo.svg',
    );

  } else if (event.tipo == 'Mantenimiento preventivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        int_mant_ultimo_mantenimiento: event.int_mant_ultimo_mantenimiento,
        int_mant_horas_transcurridas: event.int_mant_horas_transcurridas,
        int_mant_horas_restantes: event.int_mant_horas_restantes,
        int_mant_odometro: event.int_mant_odometro,
      },
      'assets/images/events-icons/mant_preventivo.svg',
    );

  } else if (event.tipo == 'Mantenimiento correctivo realizado') {
    var t_restante = string_diffechas(
      new Date(event.dat_correctivo_ini.replace(/-/g, '/')),
      new Date(event.dat_correctivo_fin.replace(/-/g, '/'))
    );
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        int_mant_ultimo_mantenimiento: event.int_mant_odometro,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/mant_correctivo_realizado.svg',
    );

  } else if (event.tipo == 'Mantenimiento preventivo realizado') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        luminaria: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        ultimo_mantenimiento: event.int_mant_odometro,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/mant_preventivo_realizado.svg',
    );

  } else if (event.tipo == 'SOS') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/sos.svg',
    );

  } else if (event.tipo == 'Exceso de Velocidad') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        velocidad_limite: event.velocidad_limite,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/exceso_velocidad.svg',
    );

  } else if (event.tipo == 'Infraccion') {
    if (event.nombre_zona == '') {
      return render_leaflet_tootlip(
        {
          tipo: event.tipo,
          nombre_objeto: event.nombre_objeto,
          latitud: event.latitud,
          longitud: event.longitud,
          velocidad: event.velocidad,
          velocidad_limite: event.velocidad_limite,
          referencia: d,
          fecha_tracker: event.fecha_tracker,
        },
        'assets/images/events-icons/infraccion.svg',
      );

    } else if (event.nombre_zona != '') { // PLATAFORMA
      return render_leaflet_tootlip(
        {
          tipo: event.tipo,
          nombre_objeto: event.nombre_objeto,
          latitud: event.latitud,
          longitud: event.longitud,
          velocidad_unidad: event.velocidad,
          velocidad_limite: event.velocidad_limite,
          tiempo_limite_infraccion: event.tiempo_limite_infraccion,
          referencia: d,
          geocerca: event.nombre_zona,
          fecha_tracker: event.fecha_tracker,
        },
        'assets/images/events-icons/infraccion.svg',
      );

    }
  } else if (event.tipo == 'Vehiculo sin programacion') { //PLATAFORMA
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        geocerca: event.nombre_zona,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/sin_programacion.svg',
    );

  } else if (event.tipo == 'Frenada brusca') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/frenada_brusca.svg',
    );

  } else if (event.tipo == 'Aceleracion brusca') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/aceleracion_brusca.svg',
    );

  } else if (event.tipo == 'Bateria desconectada') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        voltaje: event.voltaje,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/bateria_desconectada.svg',
    );

  } else if (event.tipo == 'Motor encendido' || event.tipo == 'Motor apagado') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/motor.svg'
    );

  } else if (event.tipo == 'Fatiga') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/fatiga.svg',
    );

  } else if (event.tipo == 'Somnolencia') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/somnolenciaWhite.svg',
    );

  } else if (event.tipo == 'Distraccion') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/distraccionWhite.svg',
    );

  } else if (event.tipo == 'Distracción' || event.tipo == 'Distracción') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/distraccionWhite.svg',
    );

  } else if (event.tipo == 'Desvío de carril hacia la izquierda') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/desvio_izquierda.svg',
    );

  } else if (event.tipo == 'Desvío de carril hacia la derecha') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/desvio_derecha.svg',
    );

  } else if (event.tipo == 'Bloqueo de visión del mobileye') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/bloqueo_mobileye.svg',
    );

  } else if (event.tipo == 'Colisión con peatones') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/colision_peaton.svg',
    );
    /* Falta icono */

  } else if (event.tipo == 'Colisión delantera') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/colision_delantera.svg',
    );

  } else if (event.tipo == 'Posible Fatiga') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/fatiga.svg',
    );

  } else if (event.tipo == 'Fatiga Extrema') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/fatiga.svg',
    );
  } else if (event.tipo == 'No Rostro') {
    return render_leaflet_tootlip(
      {
        tipo: event.tipo,
        nombre_objeto: event.nombre_objeto,
        latitud: event.latitud,
        longitud: event.longitud,
        velocidad: event.velocidad,
        referencia: d,
        fecha_tracker: event.fecha_tracker,
      },
      'assets/images/events-icons/no-rostro.svg',
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

function render_leaflet_tootlip(event_content: any, icon_src: string){
  return `
    <div style="padding: 0.2rem;">
      <div class="d-flex flex-row" style="font-size: 0.8rem; gap: 1rem; padding-bottom: 0.5rem;">
        <div class="d-flex flex-column justify-content-center" style="height: 45px;">
          <div>
            <img src="${icon_src}" style="max-width: 45px !important; height: 45px;"/>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-center fw-bold" style="text-transform: uppercase;">
          <span>EVENTO:</span>
          <span>${event_content.tipo}</span>
        </div>
      </div>
      <table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <colgroup>
          <col style="width:50%"></col>
          <col style="width:50%"></col>
        </colgroup>
        <tbody style="font-size: 0.7rem;">
          ${(typeof event_content.nombre_objeto !== 'undefined')? `<tr><td>UNIDAD:</td><td>${event_content.nombre_objeto}</td></tr>`:''}
          ${(typeof event_content.luminaria !== 'undefined')? `<tr><td>LUMINARIA:</td><td>${event_content.luminaria}</td></tr>`:''}
          ${(typeof event_content.latitud !== 'undefined' && typeof event_content.latitud !== 'undefined')? `<tr><td>UBICACIÓN:</td><td><a href="http://maps.google.com/maps?q=${event_content.latitud},${event_content.longitud}&amp;t=m" target="_blank">${event_content.latitud} °,  ${event_content.longitud} °</a></td></tr>`:''}
          ${(typeof event_content.int_mant_ultimo_mantenimiento !== 'undefined')? `<tr><td>ÚLTIMO MANTENIMIENTO:</td><td>${event_content.int_mant_ultimo_mantenimiento} h</td></tr>`:''}
          ${(typeof event_content.int_mant_horas_transcurridas !== 'undefined')? `<tr><td>HORAS TRANSCURRIDAS:</td><td>${event_content.int_mant_horas_transcurridas} h</td></tr>`:''}
          ${(typeof event_content.int_mant_horas_restantes !== 'undefined')? `<tr><td>HORAS RESTANTES:</td><td>${event_content.int_mant_horas_restantes} h</td></tr>`:''}
          ${(typeof event_content.int_mant_odometro !== 'undefined')? `<tr><td>ODÓMETRO ACTUAL:</td><td>${event_content.int_mant_odometro} h</td></tr>`:''}
          ${(typeof event_content.ultimo_mantenimiento !== 'undefined')? `<tr><td>ÚLTIMO MANTENIMIENTO:</td><td>${event_content.ultimo_mantenimiento} h</td></tr>`:''}
          ${(typeof event_content.voltaje !== 'undefined')? `<tr><td>VOLTAJE:</td><td>${event_content.voltaje}</td></tr>`:''}
          ${(typeof event_content.nombre_zona !== 'undefined')? `<tr><td>ZONA:</td><td>${event_content.nombre_zona}</td></tr>`:''}
          ${(typeof event_content.velocidad !== 'undefined')? `<tr><td>VELOCIDAD:</td><td>${event_content.velocidad} km/h</td></tr>`:''}
          ${(typeof event_content.velocidad_unidad !== 'undefined')? `<tr><td>VELOCIDAD:</td><td>${event_content.velocidad_unidad} km/h</td></tr>`:''}
          ${(typeof event_content.velocidad_limite !== 'undefined')? `<tr><td>LÍMITE DE VELOCIDAD:</td><td>${event_content.velocidad_limite} km/h</td></tr>`:''}
          ${(typeof event_content.tiempo_limite_infraccion !== 'undefined')? `<tr><td>LÍMITE DE TIEMPO:</td><td>${event_content.tiempo_limite_infraccion} h</td></tr>`:''}
          ${(typeof event_content.tiempo_tolerancia !== 'undefined')? `<tr><td>TIEMPO DE TOLERANCIA:</td><td>${event_content.tiempo_tolerancia}</td></tr>`:''}
          ${(typeof event_content.tiempo_estadia !== 'undefined')? `<tr><td>TIEMPO DE ESTADÍA:</td><td>${event_content.tiempo_estadia}</td></tr>`:''}
          ${(typeof event_content.referencia !== 'undefined')? `<tr><td>REFERENCIA:</td><td>${event_content.referencia}</td></tr>`:''}
          ${(typeof event_content.geocerca !== 'undefined')? `<tr><td>GEOCERCA:</td><td>${event_content.geocerca}</td></tr>`:''}
          ${(typeof event_content.fecha_tracker !== 'undefined')? `<tr><td>FECHA - HORA:</td><td>${event_content.fecha_tracker}</td></tr>`:''}
        </tbody>
      </table>
    </div>`;
}
