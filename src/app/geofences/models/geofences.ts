import { TreeNode } from "primeng-lts/api";
import { IGeofence, ITag, IGeofences ,IOperation } from "./interfaces";
import { forEach } from "lodash";
import { GeofencesService } from "../services/geofences.service";

export class Geofences implements IGeofences {
    geofences: IGeofence[]=[];
    public treeTableStatus: boolean = false;
    public operations: any = [];
    public tagGroups: any = [];
    public tags:ITag [] = [];
    public getGeofences (){
    return ;
    }

    public setGeofences(items:IGeofence[],type: string){
        items.forEach(item => {
          item.type = type;
          this.geofences.push(item);
        })
        console.log("Geofencesss Unidosss", this.geofences)
    }
    public async setTags(items:ITag[]):Promise<void>{
      items.forEach(item => {
        this.tags.push(item);
      })
      //console.log("tagss", this.tags);
      Promise.resolve();
    }

    getNameTag(id: any){
      //console.log('find tagsss',this.tags);
      return this.tags.find(tag=>tag.id == id.toString())?.var_name;
    }
    
    public async createTreeNode():Promise <TreeNode[]>{
      let map: any=[];
      this.operations = [];
      this.tagGroups = [];
      let status_operation = false;
      let status_tags = false;
      let prueba = [];
  
      for(const index in this.geofences){
        status_operation = false;
        status_tags= false;
        console.log('id GEO', this.geofences[index]);
        if(this.geofences[index].tags?.length == 0){
          if(this.operations.includes(this.geofences[index]['idoperation'])){
          }else{
            this.operations.push(this.geofences[index]['idoperation']);
            status_operation= true;
          }
          if(this.tagGroups.includes(this.geofences[index]['idoperation']+'_0')){
          }else{
            this.tagGroups.push(this.geofences[index]['idoperation']+'_0');
            status_tags= true;
          } //lógica para agregar a map
          if(status_operation&&status_tags){
            console.log('case defoult:1_1');
            map.push(
              {
                data:{id:this.geofences[index]['idoperation'],name: this.geofences[index]['nameoperation'], col:3, type:'operacion' },
                expanded: true,
                children:[
                  {
                    data:{id:0, name: 'Geocercas Sin Etiquetas', col:3, type:'etiqueta' },
                    expanded: true,
                    children: [
                      {
                        data:this.geofences[index],
                      }
                    ]
                  }
                ]
              }
            );
          }else if(!status_operation&&status_tags){
            console.log('case defoult:0_1');
            const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id == this.geofences[index]['idoperation']);
            const newTag = {
              data:{id:0, name: 'Geocercas Sin Etiquetas', col:3, type:'etiqueta' },
              expanded: true,
              children: [
                {
                  data:this.geofences[index],
                }
              ],
            };
            existingOperation.children.push(newTag);
            
          }else if(status_operation&&!status_tags){
            console.log('case defoult:1_0');
          }else if(!status_operation&&!status_tags){
            console.log('case defoult:0_0');
            const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id == this.geofences[index]['idoperation']);
            const existingTag = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id == 0);
            existingTag.children.push({
              data: this.geofences[index]
            });
          }
        }else{
          for(const indexTag of this.geofences[index].tags!){
            const tagName = this.getNameTag(indexTag);
            
            if(this.operations.includes(this.geofences[index]['idoperation'])){
            }else{
              this.operations.push(this.geofences[index]['idoperation']);
              status_operation= true;
            }
            if(this.tagGroups.includes(this.geofences[index]['idoperation']+'_'+indexTag)){
            }else{
              this.tagGroups.push(this.geofences[index]['idoperation']+'_'+indexTag);
              status_tags= true;
            }
            //
            if(status_operation&&status_tags){
              console.log('case:1_1');
              map.push(
                {
                  data:{id:this.geofences[index]['idoperation'],name: this.geofences[index]['nameoperation'], col:3, type:'operacion' },
                  expanded: true,
                  children:[
                    {
                      data:{id:indexTag, name: tagName, col:3, type:'etiqueta' },
                      expanded: true,
                      children: [
                        {
                          data:this.geofences[index],
                        }
                      ]
                    }
                  ]
                }
              );
            }else if(!status_operation&&status_tags){
              console.log('case:0_1');
              const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === this.geofences[index]['idoperation']);
              const newTag = {
                data:{id:indexTag, name: tagName, col:3, type:'etiqueta' },
                expanded: true,
                children: [
                  {
                    data:this.geofences[index],
                  }
                ],
              };
              existingOperation.children.push(newTag);
              
            }else if(status_operation&&!status_tags){
              console.log('case:1_0');
            }else if(!status_operation&&!status_tags){
              console.log('case:0_0');
              const existingOperation = map.find((item: { data: { id: any; }; }) => item.data.id === this.geofences[index]['idoperation']);
              const existingTag = existingOperation.children.find((item: { data: { id: any; }; }) => item.data.id === indexTag);
              existingTag.children.push({
                data: this.geofences[index]
              });
            }
            status_tags= false;
            status_operation = false;
          }
        }
      }
      console.log("tagss", this.tags);
      console.log('arbol de etiquetas',map);
      return Promise.resolve(map);
  }

  //Funciona correctamente para geocercas crear arbol, por operaciones y grupos :(
    // public creaateTreeNode(): TreeNode[]{
    //     let map: any=[];
    //     this.operations = [];
    //     this.groups = [];
    //     let status_operation = false;
    //     let status_group = false;
    //     let status_tags = false;
    //     let prueba = [];
    
    //     for(const index in this.geofences){
    //       if(this.operations.includes(this.geofences[index]['idoperation'])){
    //       }else{
    //         this.operations.push(this.geofences[index]['idoperation']);
    //         status_operation= true;
    //       }
    //       if(this.groups.includes(this.geofences[index]['idoperation']+'_'+this.geofences[index]['idgrupo'])){
    //       }else{
    //         this.groups.push(this.geofences[index]['idoperation']+'_'+this.geofences[index]['idgrupo']);
    //         status_group= true;
    //       }
    //       if(status_operation&&status_group){
    //         console.log('case : 1 1');
    //         prueba.push(this.geofences[index]['idoperation']+"--"+this.geofences[index]['idgrupo']);
    //         map.push(
    //           {
    //             data:{name: this.geofences[index]['nameoperation'], col:3, type:'operacion', id:this.geofences[index]['idoperation']},
    //             expanded: true,
    //             children:[
    //               {
    //                 data:{name:this.geofences[index]['namegrupo'], col:3, type:'grupo', id:this.geofences[index]['idgrupo']},
    //                 expanded: true,
    //                 children: [
    //                   {
    //                     data:this.geofences[index]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         );
    
    //       }else if(!status_operation&&status_group){
    //         //console.log("YYYYYYYY llegando aquí?????");
    //         prueba.push(this.geofences[index]['idoperation']+"--"+this.geofences[index]['idgrupo']);
    //         //recuperar el id del operation
    //         let index_operation = this.operations.indexOf(this.geofences[index]["idoperation"]);
    //         //recuperar id del group
    //         // let index_convoy = map[index_group]['children']['data']
    //         map[index_operation]['children'].push(
    //           {
    //             data : {name: this.geofences[index]['namegrupo'], col: 3, type:'grupo', id:this.geofences[index]['idgrupo']},
    //             expanded: true,
    //             children: [
    //               {
    //                 data:this.geofences[index]
    //               }
    //             ]
    //           }
    //         );
    //         // //console.log("index_group",index_group)
    //         // map[data]
    //       }else if(status_operation&&!status_group){//igual que el caso 1 1
    //         // prueba.push(data[index]['operation']+"--"+data[index]['group']);
    //         //console.log("Aaaaaaaaaaaaaquí?????");
    //         console.log("this.geofences[index]['grupo']",this.geofences[index]['idgrupo']);
    //         map.push(
    //           {
    //             data:{name: this.geofences[index]['nameoperation'], col: 3, type:'operacion', id:this.geofences[index]['idoperation']},
    //             expanded: true,
    //             children:[
    //               {
    //                 data:{name: this.geofences[index]['namegrupo'], col: 3, type:'grupo', id:this.geofences[index]['idgrupo']},
    //                 expanded: true,
    //                 children: [
    //                   {
    //                     data:this.geofences[index]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         );
    //       }else if(!status_operation&&!status_group){
    //         // prueba.push(data[index]['operation']+"--"+data[index]['group']);
    //         //recuperar el id del operation
    //         let index_operation = this.operations.indexOf(this.geofences[index]["idoperation"]);
    //         //recuperar el id del group dentro del operation
    //         //console.log("mar de opciones", map[index_group]['children'].indexOf({data:{name:"operation LINARES"}}));
    //         //console.log("mar de opciones", map[index_group]['children']);
    //         let e = map[index_operation]['children'];
    //         let b = {data:{name:this.geofences[index]['idgrupo']}};
    //         // //console.log("index-->",e.indexOf(b));
    //         let aux_index: string = "0";
    //         for(const i in e){
    //           // //console.log("group",e[i]['data']['name'])
    //           if(e[i]['data']['idgrupo']==this.geofences[index]['idgrupo']){
    //             // //console.log("exito en "+data[index]["operation"]+"/"+data[index]['group']+" -->",i);
    //             aux_index = i;
    //           }
    //         }
    //         // //console.log("aux_index",aux_index);
    //         map[index_operation]['children'][aux_index]["children"].push({
    //           data:this.geofences[index]
    //         });
    //       }
    //       status_operation=false;
    //       status_group=false;
    //     }
    //     // console.log("create node geofences okkk", map);
    //     // console.log("agurpacionessss de operacionessss", this.operations);
    //     // console.log("agurpacionessss de gruposssss", this.groups);
    //     return map; 
    // }
}