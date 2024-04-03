import { Injectable } from '@angular/core';
import { Permission } from './interface';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [
    { name: 'admin.access', roles: ['admin', 'manager'] },
    { name: 'vehicle-panel.show', roles: ['admin', 'manager'] },
    { name: 'user.access', roles: ['user', 'admin', 'manager'] },
    { name: 'evaluation.show', roles: ['GLMonitoreo','admin', 'manager'] }, //ATENCION DE EVENTOS
    { name: 'configuration-rotate.show', roles: ['CdsUser','TlineaSupervisor','GLMonitoreo','TLineaOperador','user','admin', 'manager'] }, //CONFIGURACION DE ROTACION
    { name: 'configuration-state-onda.show', roles: ['admin','superadmin', 'manager'] }, //CONFIGURACION DE ONDAS

    // MENU MODULES
    { name: 'm-vehicles.show', roles: ['admin', 'manager'] },
    { name: 'm-alerts.show', roles: ['admin', 'manager'] },
    { name: 'm-geofences.show', roles: ['admin', 'manager'] },
    { name: 'm-geopoints.show', roles: ['admin', 'manager'] },
    { name: 'm-historial.show', roles: ['admin', 'manager'] },
    { name: 'm-dashboard.show', roles: ['admin', 'manager'] },
    { name: 'm-reportes.show', roles: ['admin', 'manager'] },
    { name: 'm-auditoria.show', roles: ['admin', 'manager'] },
    { name: 'm-subaccount.show', roles: ['admin', 'manager'] },
    { name: 'm-multiview.show', roles: ['admin', 'manager'] },
    { name: 'm-drivers.show', roles: ['admin', 'manager'] },
    { name: 'm-events.show', roles: ['admin', 'manager'] },
    { name: 'm-map_config.show', roles: ['admin', 'manager'] },
    { name: 'm-users_info.show', roles: ['admin', 'manager'] },
    { name: 'm-users_config.show', roles: ['admin', 'manager'] },
    // VEHICLES

    // ALERTS
    { name: 'infraccion_geocerca-tiempo.show', roles: ['admin', 'manager'] },

    // GEOFENCES
    { name: 'geofences-edit.show', roles: ['CdsUser','GLMonitoreo','user','admin', 'manager'] },
    // GEOPOINTS
    // HISTORIAL
    // DASHBOARD
    // REPORTES
    // { name: 'report_export_pdf.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_events_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_paradas_movements_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_excesos_limite_personalizado_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_general_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_posicion_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    { name: 'report_entrada_salida_export_excel.show', roles: ['CdsUser','TLineaOperador','GLMonitoreo','user','admin', 'manager'] },
    // AUDITORIA
    // SUBACCOUNT
    // MULTIVIEW
    // DRIVERS
    { name: 'ibuttons.show', roles: ['TlineaSupervisor','GLMonitoreo','TLineaOperador','user','admin', 'manager',] }, //CONFIGURACION DE ONDAS
    { name: 'icipia.show', roles: ['user','admin', 'manager'] }, //CONFIGURACION DE ONDAS
    // EVENTS
    // MAPS
    // USER


    // ROLES
    // manager - superadmin - admin - user - TLineaOperador - GLMonitoreo - TlineaSupervisor - CdsUser - CdsMonitor
  ];

  constructor(private userDataService: UserDataService) {}

  async hasPermission(permissionName: string): Promise<boolean>{
    console.log('SLUG PERMISS ',permissionName);
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
