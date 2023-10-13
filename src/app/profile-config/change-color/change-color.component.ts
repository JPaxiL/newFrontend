
import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';

@Component({
  selector: 'app-change-color',
  templateUrl: './change-color.component.html',
  styleUrls: ['./change-color.component.scss']
})
export class ChangeColorComponent implements OnInit {

  @Output() colorSelected = new EventEmitter<string>();

  
  selectedColor: string = ''; // Color initial
  vehiculoColor = 'blue'; // Cambia este valor según la preferencia del usuario

  constructor(private userDataService: UserDataService) {  }


  onColorChange() {
    this.userDataService.changeColor(this.selectedColor);
    
  }
  //constructor(private el: ElementRef) {}


  ngOnInit(): void {
    // Actualiza el valor de la variable CSS con el color configurado por el usuario
    document.documentElement.style.setProperty('--vehiculo-color', this.vehiculoColor);
  }

}
