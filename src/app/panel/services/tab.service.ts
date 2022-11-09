import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  currentTab: string = '';

  @Output() currentTabReady = new EventEmitter<any>();

  constructor() { }

  

  setCurrentTab(newTabLocation: string){
    this.currentTab = newTabLocation;
    this.currentTabReady.emit(true);
    console.log('(TabService) This is the current tab: ', this.currentTab);
  }

  isMainPanel(){
    console.log('Current panel: ', this.currentTab);
    return this.currentTab == 'main-panel';
  }

  requiresVehicleServices(){
    return this.currentTab == 'main-panel'
      || this.currentTab == 'dashboard-tab' 
      || this.currentTab == 'reports-tab';
  }

  requiresEventServices(){
    return this.currentTab == 'main-panel';
  }

  requiresUserDataServices(){
    return this.currentTab == 'main-panel';
  }
}
