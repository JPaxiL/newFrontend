

declare let L: any;
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.es';

declare var $: any;
export class MinimapToolbarService {
  map!: L.Map; //guardara el mapa
  toolbar: any;
  showDialog:boolean = false;


  showDistance:boolean = false;


  container = L.DomUtil.create(
    'div',
    'leaflet-bar leaflet-control leaflet-control-custom'
  );

  measureControl = new L.control.measure(
    { position: 'topright',
      primaryLengthUnit: 'kilometers',
      secondaryLengthUnit: 'feet',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      localization: 'es',
      activeColor: 'blue',
      completedColor: '#9900ff',
      captureZIndex: 10000
   });


  constructor() {}

  createToolbar(map: L.Map) {
    this.map = map;
    this.toolbar = {
      options: {
        position: 'topright',
      },

      onAdd: (map: any) => {
        this.createLocation();
        this.createDistance();
        return this.container;
      },
    };

    const toolbar = L.Control.extend(this.toolbar);
    return new toolbar()
  }

  createLocation() {
    var location = L.DomUtil.create('a', 'leaflet-link', this.container);

    location.title = "Mi ubicación";

    var iLocation = L.DomUtil.create('i', 'fa fa-map-marker btn1', location);

    location.onclick = () => {
      var marker: any, circle: any, lat, long, accuracy;

      if (!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!");
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          accuracy = position.coords.accuracy;

          marker = L.marker([lat, long], {
            icon: L.icon({
              iconUrl: '/assets/images/realestate.png',
              iconAnchor: [16, 37],
            }),
          });

          let popup = L.popup({ offset: new L.Point(0, -20) })
            .setLatLng([lat, long])
            .setContent(
              '<span>Usted está a ' +
                position.coords.accuracy +
                ' metros ala <br>redonda aproximadamente.</span>'
            )
            .addTo(this.map);

          circle = L.circle([lat, long], accuracy, {
            radius: accuracy,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.1,
            opacity: 0.3,
            weight: 1,
          });

          var featureGroup = L.featureGroup([marker, circle]).addTo(this.map);

          popup.on('remove', () => {
            this.map.removeLayer(featureGroup);
          });

          this.map.setZoom(15);
          this.map.panTo([lat, long]);
        });
      }
    };
  }

  createDistance(){

    var distance = L.DomUtil.create('a', 'leaflet-link', this.container);

    distance.title = "Distancia";

    var iDistance = L.DomUtil.create('i', 'fa fa-road', distance);

    distance.onclick = () => {

       if(this.showDistance == false){
          this.measureControl.addTo(this.map);
          $('.leaflet-control-measure').css("max-width", "400px");
          this.showDistance = true;
       }else {
          this.map.removeControl(this.measureControl);
          this.showDistance = false;
       }

    };
  }

}
