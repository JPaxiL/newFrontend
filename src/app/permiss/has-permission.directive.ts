import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from './permission.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  @Input() appHasPermission: string='';
  public bol_negative :boolean = false;
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private permissionService: PermissionService) {}

  async ngOnInit() {
    console.log(this.appHasPermission);
    this.appHasPermission = await this.verifyDirective(this.appHasPermission);
    if(!this.bol_negative){
      if (await this.hasPermiss()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        console.log('Permiso Valido');
      } else {
        this.viewContainer.clear();
        console.log('Permiso Invalido');
      }
    }else{
      if (await this.hasPermiss()) {
        this.viewContainer.clear();
        console.log('Negative Permiso Valido');
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
        console.log('Negative Permiso Invalido');
      }
    }
  }

  private async hasPermiss():Promise<boolean>{
    return await this.permissionService.hasPermission(this.appHasPermission);
  }
  private async verifyDirective(permission:string):Promise<string>{
    if (permission.charAt(0) == '!') {
      permission = await this.subString(permission);
      this.bol_negative = true;
    }else{
      this.bol_negative = false;
    }
    return permission;
  }
  private async subString(text:string):Promise<string>{
    return text.substring(1);
  }
}
