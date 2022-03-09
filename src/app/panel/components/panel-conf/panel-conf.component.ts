import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-panel-conf',
  templateUrl: './panel-conf.component.html',
  styleUrls: ['./panel-conf.component.scss']
})
export class PanelConfComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {
    /* this.recentLogIn = this.router.getCurrentNavigation()?.extras.state.recentLogIn; */
  }

  recentLogIn = false;

  ngOnInit(): void {

    $(document).ready(function() {
        $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
    });
    if(history.state.recentLogIn){
      this.showLogInToastr();
    }

  }

  showLogInToastr(){
    this.toastr.success('Has iniciado sesión satisfactoriamente')
  }
}
