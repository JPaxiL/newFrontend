import { Component, OnInit } from '@angular/core';
import { TabService } from '../panel/services/tab.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {

  constructor(
    private tabService: TabService,
  ) {
    this.tabService.setCurrentTab('dashboard-tab');
  }

  ngOnInit(): void {
  }

}
