import { Injectable } from '@angular/core';
import { Permission } from './interface';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [
    { name: 'admin.access', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'vehicle-panel.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'user.access', roles: ['user', 'admin', 'superadmin', 'manager'] },
    { name: 'evaluation.show', roles: ['admin', 'superadmin', 'manager'] }, //ATENCION DE EVENTOS
    { name: 'configuration-rotate.show', roles: ['admin', 'superadmin', 'manager'] }, //CONFIGURACION DE ROTACION
    { name: 'configuration-state-onda.show', roles: ['superadmin', 'manager'] }, //CONFIGURACION DE ONDAS

    // MENU MODULES
    { name: 'm-vehicles.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-alerts.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-geofences.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-geopoints.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-historial.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-dashboard.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-reportes.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-auditoria.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-subaccount.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-multiview.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-drivers.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-events.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-maps.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-users_info.show', roles: ['admin', 'superadmin', 'manager'] },
    { name: 'm-users_config.show', roles: ['admin', 'superadmin', 'manager'] },
    // VEHICLES
    // ALERTS
    // GEOFENCES
    // GEOPOINTS
    // HISTORIAL
    // DASHBOARD
    // REPORTES
    // AUDITORIA
    // SUBACCOUNT
    // MULTIVIEW
    // DRIVERS
    { name: 'ibuttons.show', roles: ['superadmin', 'manager'] }, //CONFIGURACION DE ONDAS
    { name: 'icipia.show', roles: ['superadmin', 'manager'] }, //CONFIGURACION DE ONDAS
    // EVENTS
    // MAPS
    // USER


    // ROLES
    // manager - superadmin - admin - user - monitor
  ];

  constructor(private userDataService: UserDataService) {}

  async hasPermission(permissionName: string): Promise<boolean>{
    console.log(permissionName);
    const permission = this.getPermissionByName(permissionName);
    if (permission) {
      if(this.userDataService.userDataInitialized){
        return permission.roles.includes(this.userDataService.userData.privilegios);
      }else{
        return permission.roles.includes(await this.userDataService.userData.privilegios);
      }
    }else{
      return false;
    }
  }
  private getPermissionByName(permissionName: string): Permission | undefined {
    return this.permissions.find(permission => permission.name === permissionName);
  }

}
