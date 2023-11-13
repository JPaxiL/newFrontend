import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselWrapper') carouselWrapper!: QueryList<ElementRef>;
  @ViewChildren('carouselContainer') carouselContainer!: QueryList<ElementRef>;
  constructor(private carouselService: CarouselService, private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  private subscription! : Subscription;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subscription = this.carouselService.addItem.subscribe(({component, data}) => {
      const factory = this.resolver.resolveComponentFactory(component);
      const componentRef: ComponentRef<any> = this.container.createComponent(factory);
      // Agregar el componente directamente al contenedor del carrusel
      const divContainer = document.createElement('div');
      divContainer.style.width = '250px';
      divContainer.appendChild(componentRef.location.nativeElement);
      // Asignar datos al componente si existen
      if (data) {
        Object.keys(data).forEach((key) => {
          componentRef.instance[key] = data[key];
        });
      }
      document.querySelector('.carousel-wrapper')!.appendChild(divContainer);
    });
    /*
    const container = this.carouselContainer.first.nativeElement;
    const wrapper = this.carouselWrapper.first.nativeElement;

    // Scroll horizontally with mouse
    container.addEventListener('wheel', (event: WheelEvent) => {
      wrapper.scrollLeft += event.deltaY;
    });
    // Scroll horizontally with touch
    let touchStartX: number;
    container.addEventListener('touchstart', (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
    });

    container.addEventListener('touchmove', (event: TouchEvent) => {
      const touchMoveX = event.touches[0].clientX;
      const scrollAmount = touchStartX - touchMoveX;
      wrapper.scrollLeft += scrollAmount;
      touchStartX = touchMoveX;
    });*/
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
