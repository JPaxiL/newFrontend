import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-config-color',
  templateUrl: './config-color.component.html',
  styleUrls: ['./config-color.component.scss']
})
export class ConfigColorComponent implements OnInit {

  @Output() colorSelected = new EventEmitter<string>();
  selectedColor: string = '#000000'; // Color inicial

  colorForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.colorForm = this.fb.group({
      color: ['#RRGGBB'] // Control para el código hexadecimal del color
    });
  }

  onColorChange(): void {
    this.colorSelected.emit(this.selectedColor);
  }
  
  ngOnInit(): void {
  }

}
