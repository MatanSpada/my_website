import { Color3, DynamicTexture, MeshBuilder, PhysicsAggregate, PhysicsShapeType, PointLight, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
export const SPECIALIZATIONS=["RUNTIME THREAT DETECTION","LINUX KERNEL & eBPF","EMBEDDED & IoT SYSTEMS","OTA & DEVICE FLEETS","SENSOR DATA PIPELINES"] as const;
export type SpecializationDoor={id:string;label:string;position:Vector3;state:"CLOSED";collisionEnabled:true};
const box=(s:Scene,n:string,x:number,y:number,z:number,w:number,h:number,d:number,m:StandardMaterial)=>{const q=MeshBuilder.CreateBox(n,{width:w,height:h,depth:d},s);q.position.set(x,y,z);q.material=m;new PhysicsAggregate(q,PhysicsShapeType.BOX,{mass:0,friction:.9},s);return q;};
export function buildCaveInterior(scene:Scene,stone:StandardMaterial,wood:StandardMaterial){
  for(const x of [-3.2,3.2])box(scene,`corridor-wall-${x}`,x,3,-12.5,.7,6,12,stone); box(scene,"corridor-ceiling",0,6,-12.5,7,1,12,stone);
  for(const z of [-9,-12,-15]){const light=new PointLight(`corridor-light-${z}`,new Vector3(0,3.6,z),scene);light.diffuse=new Color3(.85,.58,.32);light.intensity=34;light.range=8;}
  box(scene,"hall-back",0,4,-27,16,8,.8,stone);for(const x of [-8,8])box(scene,`hall-side-${x}`,x,4,-23,.8,8,9,stone);box(scene,"hall-ceiling",0,8,-23,16,1,9,stone);
  const doors:SpecializationDoor[]=[]; const positions=[[-5,-20,0],[5,-20,1],[-5,-25,2],[5,-25,3],[0,-26.5,4]] as const;
  for(const [x,z,i] of positions){const label=SPECIALIZATIONS[i];const door=box(scene,`specialization-${i}`,x,2.2,z,2.7,4.4,.35,wood);const plaque=MeshBuilder.CreatePlane(`plaque-${i}`,{width:2.45,height:.55},scene);plaque.position.set(x,4.9,z+.2);plaque.rotation.y=z<-26?Math.PI:0;const tex=new DynamicTexture(`label-${i}`,{width:1024,height:256},scene,false);tex.drawText(label,28,155,"bold 54px Arial","#f2d99d","#1b211f",true);const mat=new StandardMaterial(`plaque-mat-${i}`,scene);mat.diffuseTexture=tex;mat.emissiveTexture=tex;mat.disableLighting=true;plaque.material=mat;doors.push({id:`specialization-${i}`,label,position:door.position.clone(),state:"CLOSED",collisionEnabled:true});}
  const hall=new PointLight("hall-focus",new Vector3(0,6,-23),scene);hall.diffuse=new Color3(.8,.58,.36);hall.intensity=60;hall.range=14;return doors;
}
