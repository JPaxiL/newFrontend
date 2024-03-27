import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from './permission.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  @Input() appHasPermission: string='';

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private permissionService: PermissionService) {}

  ngOnInit() {
    if (this.permissionService.hasPermission(this.appHasPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      console.log('Permiso Valido');
    } else {
      this.viewContainer.clear();
      console.log('Permiso Invalido');
    }
  }
}
