import { IGeofence, IGeofences } from "./interfaces";

export class Geofences implements IGeofences {
    geofences: IGeofence[]=[];
    // constructor (geofences: IGeofence[]){
    //     this.geofences = geofences;
    // }
    public setGeofences(items:IGeofence[]){
        this.geofences.push(...items)
    }
    public createTreeNode () : any{
        let map: any=[];
        console.log("devolviendo arbol de geocercas")        
    }
    public groups: any = [];
    public operations: any = [];

    // public createTreeNode () : any[]{
    //     let aux = "testSenial";
    //     let map: any=[];
    //     this.operations = [];
    //     this.groups = [];
    //     let status_operation = false;
    //     let status_group = false;
    //     let prueba = [];
    
    //     for(const index in this.geofences){
    //       if(this.operations.includes(this.geofences[index]['operation'])){
    //       }else{
    //         this.operations.push(this.geofences[index]['operation']);
    //         status_operation= true;
    //       }
    //       if(this.groups.includes(this.geofences[index]['operation']+'_'+this.geofences[index]['group'])){
    //       }else{
    //         this.groups.push(this.geofences[index]['operation']+'_'+this.geofences[index]['group']);
    //         status_group= true;
    //       }
    //       if(status_operation&&status_group){
    //         prueba.push(this.geofences[index]['operation']+"--"+this.geofences[index]['group']);
    //         map.push(
    //           {
    //             this.geofences:{name: this.geofences[index]['operation'], col:3, type:'operation', id:this.geofences[index]['idoperation']},
    //             expanded: true,
    //             children:[
    //               {
    //                 this.geofences:{name:this.geofences[index]['group'], col:3, type:'group', id:this.geofences[index]['idgroup']},
    //                 expanded: true,
    //                 children: [
    //                   {
    //                     this.geofences:this.geofences[index]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         );
    
    //       }else if(!status_operation&&status_group){
    //         prueba.push(this.geofences[index]['operation']+"--"+this.geofences[index]['group']);
    //         //recuperar el id del operation
    //         let index_operation = this.operations.indexOf(this.geofences[index]["operation"]);
    //         //reucperar id del group
    //         // let index_convoy = map[index_group]['children']['this.geofences']
    //         map[index_operation]['children'].push(
    //           {
    //             this.geofences : {name: this.geofences[index]['group'], col: 3, type:'group', id:this.geofences[index]['idgroup']},
    //             expanded: true,
    //             children: [
    //               {
    //                 this.geofences:this.geofences[index]
    //               }
    //             ]
    //           }
    //         );
    //         // //console.log("index_group",index_group)
    //         // map[this.geofences]
    //       }else if(status_operation&&!status_group){//igual que el caso 1 1
    //         // prueba.push(this.geofences[index]['operation']+"--"+this.geofences[index]['group']);
    //         // //console.log("this.geofences[index]['group']",this.geofences[index]['group']);
    //         map.push(
    //           {
    //             this.geofences:{name: this.geofences[index]['operation'], col: 3, type:'operation', id:this.geofences[index]['idoperation']},
    //             expanded: true,
    //             children:[
    //               {
    //                 this.geofences:{name: this.geofences[index]['group'], col: 3, type:'group', id:this.geofences[index]['idgroup']},
    //                 expanded: true,
    //                 children: [
    //                   {
    //                     this.geofences:this.geofences[index]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         );
    //       }else if(!status_operation&&!status_group){
    //         // prueba.push(this.geofences[index]['operation']+"--"+this.geofences[index]['group']);
    //         //recuperar el id del operation
    //         let index_operation = this.operations.indexOf(this.geofences[index]["operation"]);
    //         //recuperar el id del group dentro del operation
    //         // let index_convoy = map[index_group]['children']['this.geofences']
    
    //         //console.log("mar de opciones", map[index_group]['children'].indexOf({this.geofences:{name:"operation LINARES"}}));
    //         //console.log("mar de opciones", map[index_group]['children']);
    //         let e = map[index_operation]['children'];
    //         let b = {this.geofences:{name:this.geofences[index]['group']}};
    //         // //console.log("index-->",e.indexOf(b));
    //         let aux_index: string = "0";
    //         for(const i in e){
    //           // //console.log("group",e[i]['this.geofences']['name'])
    //           if(e[i]['this.geofences']['name']==this.geofences[index]['group']){
    //             // //console.log("exito en "+this.geofences[index]["operation"]+"/"+this.geofences[index]['group']+" -->",i);
    //             aux_index = i;
    //           }
    //         }
    //         // //console.log("aux_index",aux_index);
    //         map[index_operation]['children'][aux_index]["children"].push({
    //           this.geofences:this.geofences[index]
    //         });
    //       }
    //       status_operation=false;
    //       status_group=false;
    //     }
    //     console.log("create node geofences", map);
    //     return map; 
    // }
}