
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  
  constructor(private userDataService: UserDataService) {  }

  ngOnInit(): void {
    
  }

  onColorChange() {
    this.userDataService.changeColor(this.selectedColor);
    
  }

}
