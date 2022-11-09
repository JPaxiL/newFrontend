import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TabService } from '../panel/services/tab.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {

  constructor(
    private tabService: TabService,
    private titleService: Title,
  ) {
    this.tabService.setCurrentTab('dashboard-tab');
    this.titleService.setTitle('Dashboard');
  }

  ngOnInit(): void {
  }

}
