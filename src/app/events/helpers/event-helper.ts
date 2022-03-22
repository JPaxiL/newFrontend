export const getContentPopup = (event: any, d: any = '...') => {
  if (event.tipo == 'Zona de entrada') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
              <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/entrada_zona.png" style="max-width: 35px !Important; max-height: 40px;"/>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px;" >
                <b>EVENTO:</b>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
              <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${d}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
            </tr>
          </table>`;
  } else if (event.tipo == 'Zona de salida') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
              <td rowspan="3"  width:"16%" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/salida_zona.png" style="max-width: 35px !Important; max-height: 40px;"/>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px;">
                <b>EVENTO:</b>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
              <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_zona} </td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${d}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
            </tr>
          </table>`;
  } else if (event.tipo == 'Tiempo de estadia en zona') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
            <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/tiempo_estadia_zona.png" style="max-width: 35px !Important; max-height: 40px;"/>
            </td>
            </tr>
            <tr>
            <td style="font-size: 13px;">
                <b>EVENTO:</b>
            </td>
            </tr>
            <tr>
            <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
            <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
            </tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>TIEMPO DE ESTADÍA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.tiempo_limite}</td>
            </tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${d}</td>
            </tr>
            <tr>
            <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
            </tr>
        </table>`;
  } else if (event.tipo == 'Parada en zona no autorizada') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
              <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/parada_zona_desautorizada.png" style="max-width: 35px !Important; max-height: 40px;"/>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px;">
                <b>EVENTO:</b>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto} </td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
              <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>TIEMPO DE TOLERANCIA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.tiempo_limite}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${d}</td>
            </tr>
            <tr>
              <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
              <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
            </tr>
        </table>`;
  } else if (event.tipo == 'Mantenimiento correctivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }

    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
                <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                    <img src="assets/images/events-icons/mant_correctivo.png" style="max-width: 35px !Important; max-height: 40px;"/>
                </td>
            </tr>
            <tr>
                <td style="font-size: 13px;">
                    <b>EVENTO:</b>
                </td>
            </tr>
            <tr>
                <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>LUMINARIA:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
                <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>ÚLTIMO MANTENIMIENTO:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_ultimo_mantenimiento} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>HORAS TRANSCURRIDAS:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_horas_transcurridas} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>HORAS ENTRANTES: </b></td>
                <td style="font-size: 10px; width: 20%;" >${event.int_mant_horas_restantes} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>ODÓMETRO ACTUAL:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_odometro} h</td>
            </tr>
       </table>`;
  } else if (event.tipo == 'Mantenimiento preventivo') {
    if (event.int_mant_odometro == null) {
      event.int_mant_odometro =
        event.int_mant_ultimo_mantenimiento +
        event.int_mant_horas_transcurridas;
    }

    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
            <tr>
                <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/mant_preventivo.png" style="max-width: 35px !Important; max-height: 40px;"/>
                </td>
            </tr>
            <tr>
                <td style="font-size: 13px;">
                <b>EVENTO:</b>
                </td>
            </tr>
            <tr>
                <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
            </tr>
            <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>LUMINARIA:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
                <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>ÚLTIMO MANTENIMIENTO:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_ultimo_mantenimiento} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>HORAS TRANSCURRIDAS:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_horas_transcurridas} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>HORAS RESTANTES:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_horas_restantes} h</td>
            </tr>
            <tr>
                <td style="font-size: 10px; width: 20%;" ><b>ODÓMETRO ACTUAL:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_odometro} h</td>
            </tr>
        </table>`;
  } else if (event.tipo == 'Mantenimiento correctivo realizado') {
    var t_restante = string_diffechas(
      new Date(event.dat_correctivo_ini.replace(/-/g, '/')),
      new Date(event.dat_correctivo_fin.replace(/-/g, '/'))
    );

    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;">
      <img src="assets/images/events-icons/mant_correctivo_realizado.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>LUMINARIA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>ÚLTIMO MANTENIMIENTO:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.int_mant_odometro} h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Mantenimiento preventivo realizado') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
              <tr>
                <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/mant_preventivo_realizado.png" style="max-width: 35px !Important; max-height: 40px;"/>
                </td>
              </tr>
              <tr>
                <td style="font-size: 13px;">
                  <b>EVENTO:</b>
                </td>
              </tr>
              <tr>
                <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
              </tr>
              <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
              <tr>
                <td style="font-size: 10px; width: 20%;" ><b>LUMINARIA:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
              </tr>
              <tr>
                <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
                <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
              </tr>
              <tr>
                <td style="font-size: 10px; width: 20%;" ><b>ÚLTIMO MANTENIMIENTO:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.int_mant_odometro} h</td>
              </tr>
              <tr>
                <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
                <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
              </tr>
            </table>`;
  } else if (event.tipo == 'SOS') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <tr>
        <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
            <img src="assets/images/events-icons/sos.png" style="max-width: 35px !Important; max-height: 40px;"/>
        </td>
        </tr>
        <tr>
        <td style="font-size: 13px;">
            <b>EVENTO:</b>
        </td>
        </tr>
        <tr>
        <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
        </tr>
        <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
        <tr>
        <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
        <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
        </tr>
        <tr>
        <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
        <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
        </tr>
        <tr>
        <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
        <td style="font-size: 10px; width: 80%;" >${d}</td>
        </tr>
        <tr>
        <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
        <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
        </tr>
    </table>`;
  } else if (event.tipo == 'Exceso de Velocidad') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <tr>
            <td rowspan="3" style="font-size: 13px; width: 16% !important;">
                <img src="assets/images/events-icons/exceso_velocidad.png" style="max-width: 35px !Important; max-height: 40px;"/>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px;">
                <b>EVENTO:</b>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
        </tr>
        <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>UNIDAD:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.nombre_objeto}</td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
            <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>LÍMITE DE VELOCIDAD:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.velocidad_limite} km/h</td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${d}</td>
        </tr>
        <tr>
            <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA:</b></td>
            <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
        </tr>
    </table>`;
  } else if (event.tipo == 'Infraccion') {
    if (event.nombre_zona == '') {
      return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <tr>
          <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
            <img src="assets/images/events-icons/infraccion.png" style="max-width: 35px !Important; max-height: 40px;"/>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px;">
            <b>EVENTO:</b>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
        </tr>
        <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
          <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>VELOCIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.velocidad} km/h</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>LIMITE DE VELOCIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.velocidad_limite} km/h</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>REFERENCIA:</b></td>
          <td style="font-size: 10px; width: 80%;">${d}</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>FECHA - HORA:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.fecha_tracker}</td>
        </tr>
        </table>`;
    } else if (event.nombre_zona != '') {
      return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
        <tr>
          <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
            <img src="assets/images/events-icons/infraccion.png" style="max-width: 35px !Important; max-height: 40px;"/>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px;">
            <b>EVENTO:</b>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
        </tr>
        <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
          <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>ZONA:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.nombre_zona}</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>VELOCIDAD UNIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.velocidad} km/h</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>LIMITE DE VELOCIDAD:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.velocidad_limite} km/h</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>LIMITE DE TIEMPO:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.tiempo_limite_infraccion} Segundos</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>REFERENCIA:</b></td>
          <td style="font-size: 10px; width: 80%;">${d}</td>
        </tr>
        <tr>
          <td style="font-size: 10px; width: 20%;"><b>FECHA - HORA:</b></td>
          <td style="font-size: 10px; width: 80%;">${event.fecha_tracker}</td>
        </tr>
        </table>`;
    }
  } else if (event.tipo == 'Vehiculo sin programacion') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/sin_programacion.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>ZONA:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_zona}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${d}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Frenada brusca') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/frenada_brusca.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Aceleracion brusca') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/aceleracion_brusca.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Bateria desconectada') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/sin_programacion.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VOLTAJE:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.voltaje} V</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Motor encendido' || event.tipo == 'Motor apagado') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/sin_programacion.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Fatiga') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/fatiga.png" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Somnolencia') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/somnolenciaWhite.svg" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${d}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Distraccion') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/distraccionWhite.svg" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${d}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
  } else if (event.tipo == 'Alcoholemia') {
    return `<table class="dl-horizontal" style="border-collapse: separate; border-spacing: 2px;">
    <tr>
      <td rowspan="3" style="font-size: 13px; width: 16% !important;" >
        <img src="assets/images/events-icons/alcoholemiaWhite.svg" style="max-width: 35px !Important; max-height: 40px;"/>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px;">
        <b>EVENTO:</b>
      </td>
    </tr>
    <tr>
      <td style="font-size: 13px; text-transform: uppercase;"><b>${event.tipo}</b></td>
    </tr>
    <tr><td colspan="2" style="font-size: 13px;" ></td></tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>DESCRIPCION:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.mensaje_alerta}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;"><b>UNIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;">${event.nombre_objeto}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>UBICACIÓN:</b></td>
      <td style="font-size: 10px; width: 80%;" ><a href="http://maps.google.com/maps?q=${event.latitud},${event.longitud}&amp;t=m" target="_blank" style="color: white">${event.latitud} °,  ${event.longitud} °</a></td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>ZONA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.nombre_zona}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>VELOCIDAD:</b></td>
      <td style="font-size: 10px; width: 80%;" >${event.velocidad} km/h</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>REFERENCIA:</b></td>
      <td style="font-size: 10px; width: 80%;" >${d}</td>
    </tr>
    <tr>
      <td style="font-size: 10px; width: 20%;" ><b>FECHA - HORA: </b></td>
      <td style="font-size: 10px; width: 80%;" >${event.fecha_tracker}</td>
    </tr>
    </table>`;
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
