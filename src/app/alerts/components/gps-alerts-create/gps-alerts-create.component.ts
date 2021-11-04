import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../../alerts/service/alert.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Select2Data } from 'ng-select2-component';



@Component({
  selector: 'app-gps-alerts-create',
  templateUrl: './gps-alerts-create.component.html',
  styleUrls: ['./gps-alerts-create.component.scss']
})
export class GpsAlertsCreateComponent implements OnInit {
  public alertForm!: FormGroup;
  public events:any = [];

  public loading:boolean = true;

  public vehicles:Select2Data = [];

  public disabledEventSoundActive = true;

  public disabledEmail = true;

  constructor(
    private AlertService: AlertService,
    private VehicleService : VehicleService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.alertForm = this.formBuilder.group({
      event: ['',[Validators.required]],
      eventActive: [''],
      eventName: [''],
      vehicles: ['', [Validators.required]],
      eventSoundActive:[false],
      eventSound: [{value:'sonidos/alarm8.mp3', disabled: this.disabledEventSoundActive}],
      email: [{value: '', disabled:this.disabledEmail},[Validators.required, Validators.email]],
      emails: [[]],
      emailActive: [false],
      eventType: ['gps']
    });
    this.loading = false;
    this.loadData();
  }

  public async loadData(){
    this.events = await this.AlertService.getEventsByType('gps');
    this.setDataVehicles();
  }

  onSubmit(){
    console.log('this.alertForm.value =====> ',this.alertForm.value);
  }

  setDataVehicles(){
    let vehicles = this.VehicleService.getVehiclesData();

    this.vehicles = vehicles.map( (vehicle:any) => {
      return {
        value: vehicle.IMEI,
        label: vehicle.IMEI,
        data: { color: 'white', name: vehicle.IMEI },
      }
    });
  }

  playAudio(){

  }

  changeDisabled($event: any){
    if($event.target.checked){
      this.alertForm.controls['eventSound'].enable();
    } else{
      this.alertForm.controls['eventSound'].disable();
    }
  }

  addEmail(){
   if(this.validateEmail(this.alertForm.value.email)){
    if(!this.isInArray(this.alertForm.value.email, this.alertForm.value.emails)){
      this.alertForm.value.emails.push(this.alertForm.value.email);
    }
   } else {
    alert('debe ingresar un email valido.');
   }
  }

  restEmail(index: any){
    this.alertForm.value.emails.splice(index, 1);
  }

  validateEmail(email: any) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isInArray(value: any, array:any[]) {
    return array.indexOf(value) > -1;
  }

  changeDisabledEmail($event:any){
    if($event.target.checked){
      this.alertForm.controls['email'].enable();
    } else{
      this.alertForm.controls['email'].disable();
    }
  }


}
