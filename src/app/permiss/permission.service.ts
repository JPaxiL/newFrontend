import { Injectable } from '@angular/core';
import { Permission } from './interface';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [
    { name: 'admin.access', roles: ['admin', 'superadmin'] },
    { name: 'user.access', roles: ['user', 'admin', 'superadmin'] },
    { name: 'vehicle-panel.show', roles: ['admin', 'superadmin'] },
    { name: 'evaluation.show', roles: ['admin', 'superadmin'] }, //ATENCION DE EVENTOS
    { name: 'configuration-rotate.show', roles: ['admin', 'superadmin'] }, //CONFIGURACION DE ROTACION
    { name: 'configuration-state-onda.show', roles: ['admin', 'superadmin'] }, //CONFIGURACION DE ONDAS
    { name: 'm-dashboard.show', roles: ['admin', 'superadmin'] },
    { name: 'm-subaccount.show', roles: ['admin', 'superadmin'] },
    { name: 'm-multiview.show', roles: ['admin', 'superadmin'] },

    // ROLES
    // superadmin - admin - user - monitor
  ];

  constructor(private userDataService: UserDataService) {}

  hasPermission(permissionName: string): boolean {
    console.log(permissionName);
    const permission = this.getPermissionByName(permissionName);
    if (permission) {
      return permission.roles.includes(this.userDataService.userData.privilegios);
    }
    return false; // Si no se encuentra el permiso, se considera que no tiene permiso
  }
  private getPermissionByName(permissionName: string): Permission | undefined {
    return this.permissions.find(permission => permission.name === permissionName);
  }

}
