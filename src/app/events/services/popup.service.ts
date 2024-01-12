import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { EventService } from './event.service';
import { getIcon } from '../helpers/event-helper';
import { Vehicle } from 'src/app/vehicles/models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private popupContainer: HTMLElement = document.createElement('div');
  popupCount: number = 0;
  map!: L.Map;

  constructor(private eventService: EventService) { }

  toggleClosePopup(popup_id: string) {
    let popup = document.querySelector("#" + popup_id);
    if (popup) {
      popup.remove();
    }
  }

  createMap(popup: string, event: any) {
    this.map = L.map(popup, {
      preferCanvas: true,
      renderer: L.canvas(),
      zoom: 18,
      maxZoom: 18,
      editable: false
    }).setView([event.latitud, event.longitud], 18);

    this.setLayers();
  }

  setLayers() {
    const mainLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        // minZoom: 4,
        maxZoom: 18,
        attribution:
          '&copy; ',
      }
    );

    mainLayer.addTo(this.map);
  }

  createPopup(event: any, vehicle: Vehicle) {

    const elementsPopUp = document.querySelectorAll('.popup-events');
    const countPopUp = elementsPopUp.length;

    // Si los popups son mas de 10 se elimina el primero para mostrar el ultimo evento
    if (countPopUp >= 10) {
      const firstPopup = elementsPopUp[0];
      firstPopup!.parentNode!.removeChild(firstPopup);
    }

    this.popupContainer = document.getElementById('popupContainer')!!;

    let lastRow = document.querySelector('.popup-row:last-child');

    if (!lastRow || lastRow.children.length >= 5) {
      lastRow = document.createElement('div');
      lastRow.classList.add('popup-row');
      this.popupContainer.appendChild(lastRow);
    }
    // Crear el elemento de div para el bloque de popup
    const popupDiv = document.createElement('div');
    popupDiv.classList.add('popup-events');
    popupDiv.id = `popup${this.popupCount}`;

    // Crear el contenido del bloque de popup
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-popup-events');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-popup-events');
    const titleSpan = document.createElement('span');
    titleSpan.innerHTML = `<span>${vehicle.name}</span>`;
    titleDiv.appendChild(titleSpan);

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('icons-popup-events');
    iconsDiv.appendChild(this.setIcon(['fa', 'far', 'fa-street-view']));
    iconsDiv.appendChild(this.setIcon(['fa', 'far', 'fa-globe']));
    iconsDiv.appendChild(this.setIcon(['fa', 'fas', 'fa-map']));

    const toggleButton = document.createElement('span');
    toggleButton.classList.add('popup-events-toggle');
    toggleButton.textContent = 'x';
    toggleButton.addEventListener('click', () => this.toggleClosePopup(popupDiv.id));

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-popup-events');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-popup-events');
    let icon = getIcon(event.tipo);
    infoDiv.innerHTML = `<img src="${icon}" style="max-width: 20px !important; height: 20px;"/> <span>${event.tipo}</span>`;

    const divElement = document.createElement('div');
    divElement.classList.add('map-content-popup-events');
    divElement.id = `map-event-${this.popupCount}`

    const footerDiv = document.createElement('div');
    footerDiv.classList.add('footer-popup-events');
    let driver = vehicle.namedriver != null ? vehicle.namedriver : 'Sin conductor';
    footerDiv.innerHTML = `<i class="fa fa-user me-2"></i><span>${driver}</span>`;

    // Construir la estructura del bloque de popup
    titleDiv.appendChild(iconsDiv);
    titleDiv.appendChild(toggleButton);
    headerDiv.appendChild(titleDiv);

    contentDiv.appendChild(infoDiv);
    contentDiv.appendChild(divElement);
    contentDiv.appendChild(footerDiv);

    popupDiv.appendChild(headerDiv);
    popupDiv.appendChild(contentDiv);

    // Agregar el bloque de popup al documento
    lastRow.appendChild(popupDiv);

    //crear el mapa
    this.createMap(`map-event-${this.popupCount}`, event);
    // se agrega elvehiculo en el mapa donde ocurrio el evento
    this.setIconVehicle(vehicle, event);

    // Eliminar la ventana después de 2 minuto
    setTimeout(() => {
      if (popupDiv.parentNode) {
        popupDiv.parentNode.removeChild(popupDiv);
      }
    }, 120000);

    this.popupCount++;
  }

  setIconVehicle(vehicle: Vehicle, event: any) {
    let iconUrl = './assets/images/objects/nuevo/' + vehicle.icon;
    if (vehicle.speed > 0) {
      iconUrl = './assets/images/accbrusca.png';
    }

    const iconMarker = L.icon({
      iconUrl: iconUrl,
      iconSize: [40, 40],
      iconAnchor: [25, 40],
      popupAnchor: [-3, -40]
    });
    const googleMapsLink = `https://www.google.com/maps?q=${vehicle.latitud},${vehicle.longitud}`;
    const popupText = '<div class="row"><div class="col-6" align="left"><strong>' + vehicle.name + '</strong></div><div class="col-6" align="right"><strong>' + vehicle.speed + ' km/h</strong></div></div>' +
      '<aside #popupText class="">' +
      '<small>CONVOY: ' + vehicle.nameconvoy + '</small><br>' +
      // '<small>UBICACION: ' + vehicle.latitud + ', ' + vehicle.longitud + '</small><br>' +
      '<small><a href="' + googleMapsLink + '" target="_blank">UBICACION: ' + vehicle.latitud + ', ' + vehicle.longitud + '</a></small><br>' +
      '<small>REFERENCIA: ' + 'NN' + '</small><br>' +
      '<small>FECHA DE TRANSMISION: ' + vehicle.dt_tracker + '</small><br>' +
      '<small>TIEMPO DE PARADA: Calculando ...</small>' +
      '</aside>';

    const tempMarker = L.marker([event.latitud, event.longitud], { icon: iconMarker }).bindPopup(popupText);

    tempMarker.bindTooltip(`<span>${vehicle.name}</span>`, {
      permanent: true,
      offset: [0, 12],
      className: 'vehicle-tooltip'
    });

    tempMarker.addTo(this.map);
  }

  setIcon(classIcon: string[]) {
    const icon = document.createElement('i');
    icon.classList.add(...classIcon);
    return icon;
  }
}
