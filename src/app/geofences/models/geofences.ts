import { IGeofence, IGeofences } from "./interfaces";

export class Geofences implements IGeofences {
    geofences: IGeofence[]=[];
    public operations: any = [];
    public groups: any = [];
    public getGeofences (){
        return this.geofences;
    }
    // constructor (geofences: IGeofence[]){
    //     this.geofences = geofences;
    // }
    public setGeofences(items:IGeofence[]){
        this.geofences.push(...items)
    }
    public createTreeNode() : any{
      let map: any=[];
      
    }
    
    // public createTreeNode (data: []) : any{
    //     let map: any=[];
    //     console.log("devolviendo arbol de geocercas") 
    //     let status_operation = false;
    //     let status_group = false;
    //     this.operations = [];
    //     this.groups = [];
    //     for (const index in data) {
    //         //CASOS SI ES UN CREACION DE OPERATION
    //         //CASOS SI ES UN CREACION DE GRUPO      
    //         if(this.operations.includes(data[index]['idoperation'])){
    //         }else{
    //           this.operations.push(data[index]['idoperation']);
    //           status_operation= true;
    //         }
    //         if(this.groups.includes(data[index]['idoperation'] +'_'+ data[index]['idgrupo'])){
    //         // if(this.groups.includes(data[index]['idgrupo'])){
    //         }else{
    //           this.groups.push(data[index]['idoperation'] +'_'+ data[index]['idgrupo']);
    //           // this.groups.push(data[index]['idgrupo']);
    //           status_group= true;
    //         }
    //         // para los status true significa que es uno nuevo , false que ya existe
    //         //posibilidades para Operacion/Grupo
    //         // 4 segun logica binatria 0011010101
    //         //case es una nueva operacion/grupo
    //         if(status_operation&&status_group){
    //           console.log('case : 1 1');
    //           map.push(
    //             {
    //               data:{name: data[index]['nameoperation'], col:3, type:'operacion', id:data[index]['idoperation']},
    //               expanded: true,
    //               children:[
    //                 {
    //                   data:{name:data[index]['namegrupo'], col:3, type:'grupo', id:data[index]['idgrupo']},
    //                   expanded: true,
    //                   children: [
    //                     {
    //                         data:data[index]
    //                     }
    //                   ]
    //                 }
    //               ]
    //             }
    //           );
    //         //case para nueva operacion/grupo pero convoy existente
    //         }else if(status_operation&&status_group){
    //           console.log('case : 1 1'); //caso imposible
    //         }else if(status_operation&&!status_group){
    //           console.log('case : 1 0'); //caso imposible
    //           const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idoperation']);
    //           const newGroup = {
    //             data: { name: data[index]['namegrupo'], col: 3, type: 'grupo', id: data[index]['idgrupo'] },
    //             expanded: true,
    //             children: [
    //                 {
    //                     data: data[index],
    //                   },
    //             ],
    //           };
    //           existingOperation.children.push(newGroup);
    //         }else if(!status_operation&&status_group){
    //           console.log('case : 0 1'); // nunca se va dar
    //           // const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idoperation']);      
    //         }else if(!status_operation&&!status_group){
    //           //logica para cuando ya existe operacion grupo, pero no existe el convoy
    //           console.log('case : 0 0');
    //           const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idoperation']);
    //           const existingGroup = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idgrupo']);
    //           existingGroup.children.push({
    //                 data: data[index],
    //           });
      
    //         }else if(!status_operation&&!status_group){
    //           //case cuando ya existen todos y se agrega el convoy existente
    //           console.log('case : 0 0');
    //           const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idoperation']);
    //           const existingGroup = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id === data[index]['idgrupo']);
    //           existingGroup.children.push({
    //             data: data[index]
    //           });
    //         }
    //         status_group=false;
    //         status_operation=false;
    //     }
    //     map.sort((a: { data: { id: any; }; }, b: { data: { id: any; }; }) => {
    //         const idA = a.data.id;
    //         const idB = b.data.id;
    //         if (idA < idB) {
    //           return -1;
    //         }
    //         if (idA > idB) {
    //           return 1;
    //         }
    //         return 0;
    //     });
    //       // console.log("operations",this.operations);
    //       // console.log("groups",this.groups);
    //     console.log("mapa:",map);
    //       // console.log("prueba:",prueba);
    //     return map;
    // }
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