import { Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, TransformNode, Vector3, type Scene } from "@babylonjs/core";
export type DoorState = "CLOSED" | "OPENING" | "OPEN";
export type MainDoor = { position: Vector3; state: DoorState; angle: number; sealEnabled: boolean; traversable: boolean; root: TransformNode; interact(): boolean; update(dt:number): void; reset(): void };

export type HingedDoorOptions = { id?: string; width?: number; height?: number; sealWidth?: number };
export function buildMainDoor(scene: Scene, position: Vector3, options: HingedDoorOptions = {}): MainDoor {
  const id=options.id??"main-door"; const width=options.width??3.8; const height=options.height??4.6; const sealWidth=options.sealWidth??5.05;
  const wood=new StandardMaterial("door-oak",scene); wood.diffuseColor=new Color3(.18,.085,.03); const iron=new StandardMaterial("door-iron",scene); iron.diffuseColor=new Color3(.12,.13,.13);
  const root=new TransformNode(`${id}-hinge`,scene); root.position.set(position.x-width/2,0,position.z);
  const slab=MeshBuilder.CreateBox(`${id}-leaf`,{width,height,depth:.34},scene); slab.parent=root; slab.position.set(width/2,height/2,0); slab.material=wood;
  for(const x of [width*.09,width/2,width*.91]){const band=MeshBuilder.CreateBox(`${id}-band-${x}`,{width:.16,height:height+.2,depth:.43},scene);band.parent=root;band.position.set(x,height/2,-.03);band.material=iron;}
  for(const y of [height*.23,height/2,height*.77]){const brace=MeshBuilder.CreateBox(`${id}-brace-${y}`,{width:width+.15,height:.15,depth:.44},scene);brace.parent=root;brace.position.set(width/2,y,-.03);brace.material=iron;}
  let leaf:PhysicsAggregate|undefined; let seal:PhysicsAggregate|undefined; let sealMesh:ReturnType<typeof MeshBuilder.CreateBox>|undefined;
  const clearClosedColliders=()=>{ leaf?.dispose(); seal?.dispose(); sealMesh?.dispose(); leaf=undefined; seal=undefined; sealMesh=undefined; };
  const createColliders=()=>{leaf=new PhysicsAggregate(slab,PhysicsShapeType.BOX,{mass:0,friction:.9},scene); sealMesh=MeshBuilder.CreateBox(`${id}-closed-seal`,{width:sealWidth,height:height+.6,depth:.9},scene);sealMesh.position.set(position.x,(height+.6)/2,position.z+.1);sealMesh.isVisible=false;seal=new PhysicsAggregate(sealMesh,PhysicsShapeType.BOX,{mass:0,friction:.95},scene);}; createColliders();
  let state:DoorState="CLOSED", angle=0, released=false; const max=-1.38;
  return { position:position.clone(), get state(){return state;}, get angle(){return angle;}, get sealEnabled(){return !!seal;}, get traversable(){return state==="OPEN";}, root,
    interact(){if(state!=="CLOSED")return false;state="OPENING";return true;},
    update(dt){if(state!=="OPENING")return;angle=Math.max(max,angle-dt*.72);root.rotation.y=angle;if(!released&&Math.abs(angle)>.88){clearClosedColliders();released=true;}if(angle===max)state="OPEN";},
    reset(){clearClosedColliders();angle=0;root.rotation.y=0;state="CLOSED";released=false;createColliders();}
  };
}
