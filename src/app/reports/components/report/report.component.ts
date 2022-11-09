import { Component, OnInit } from '@angular/core';
import { TabService } from 'src/app/panel/services/tab.service';

import { ReportService } from '../../services/report.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    public reportService: ReportService,
    public tabService: TabService,
  ) {
    this.tabService.setCurrentTab('reports-tab');
  }

  ngOnInit(): void {
    document.querySelector('body')!.style.backgroundColor = 'rgb(237,232,232)';
  }

}
