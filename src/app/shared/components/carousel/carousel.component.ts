import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventPopupComponent } from 'src/app/events/components/event-popup/event-popup.component';
import { CarouselService } from '../../services/carousel.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;
  @ViewChild('carouselSection') carouselSection!: ElementRef;
  @Input() display = true;

  constructor(private carouselService: CarouselService, private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  private subscription! : Subscription;
  scrollDiv!: ElementRef;

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.updateButtonVisibility();
    this.subscription = this.carouselService.addItem.subscribe(({component, data}) => {
      const factory = this.resolver.resolveComponentFactory(component);
      const componentRef: ComponentRef<any> = this.container.createComponent(factory);
      // Agregar el componente directamente al contenedor del carrusel
      const divContainer = document.createElement('div');
      divContainer.style.width = '240px';
      divContainer.id = 'div-'+data["configuration"].mapConf.containerId;
      divContainer.appendChild(componentRef.location.nativeElement);
      const currentWrapperWidth = parseFloat(this.carouselWrapper.nativeElement.style.width) || 0;
      const carouselSectionWidth = parseFloat(this.carouselSection.nativeElement.style.width) || 0;
      const extraWidth = 240 + 8;
      this.carouselWrapper.nativeElement.style.width = `${currentWrapperWidth + extraWidth}px`;
      this.carouselSection.nativeElement.style.width = `${carouselSectionWidth + extraWidth}px`;
      // Asignar datos al componente si existen
      if (data) {
        Object.keys(data).forEach((key) => {
          componentRef.instance[key] = data[key];
        });
      }
      document.querySelector('.carousel-wrapper')!.insertBefore(divContainer,document.querySelector('.carousel-wrapper')!.firstChild);
      this.updateButtonVisibility();
      if (componentRef.instance instanceof EventPopupComponent) {
        componentRef.instance.onDelete.subscribe((valor) => {
          // Hacer algo con el valor emitido por el EventEmitter
          //console.log('Valor emitido por el EventEmitter:', valor);
          this.deleteMap(valor);
        });
      }

      setTimeout(() => {
        this.deleteMap(data["configuration"].mapConf.containerId);
      }, 120000);
    });
  }

  deleteMap(event:any){
    if(document.getElementById('div-'+event)){
      document.getElementById('div-'+event)?.remove();
      const currentWrapperWidth = parseFloat(this.carouselWrapper.nativeElement.style.width) || 0;
      const carouselSectionWidth = parseFloat(this.carouselSection.nativeElement.style.width) || 0;
      const extraWidth = 240 + 8;
      if(currentWrapperWidth != 0 && carouselSectionWidth != 0){
        this.carouselWrapper.nativeElement.style.width = `${currentWrapperWidth - extraWidth}px`;
        this.carouselSection.nativeElement.style.width = `${carouselSectionWidth - extraWidth}px`;
      }
      this.updateButtonVisibility();
    }
  }

  clearPopups(){
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      const popups = Array.from(carouselWrapper.children) as HTMLDivElement[];
      for (const popup of popups) {
        this.deleteMap(popup.id.slice(4));
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  scrollCarousel(amount:number) {
    var contenedor = document.getElementById('scroll-section')!;
    contenedor.scrollLeft += amount;
  }
  
  
  onScroll() {
    this.updateButtonVisibility();
  }

  updateButtonVisibility() {
    const container = this.carouselSection.nativeElement;
    const wrapper = this.carouselWrapper.nativeElement;
    const leftButton = document.getElementById('button-left');
    const rightButton = document.getElementById('button-right');

    if (container.scrollLeft === 0) {
      leftButton?.classList.add('invisible');
    } else {
      leftButton?.classList.remove('invisible');
    }
    //console.log(container.scrollLeft + container.clientWidth, wrapper.scrollWidth);

    if (container.scrollLeft + container.clientWidth === wrapper.scrollWidth) {
      rightButton?.classList.add('invisible');
    } else {
      rightButton?.classList.remove('invisible');
    }
  }
  
  
  

}
