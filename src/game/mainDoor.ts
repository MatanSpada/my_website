import { Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, TransformNode, Vector3, type Scene } from "@babylonjs/core";
export type DoorState = "CLOSED" | "OPENING" | "OPEN";
export type MainDoor = { position: Vector3; state: DoorState; angle: number; sealEnabled: boolean; traversable: boolean; root: TransformNode; interact(): boolean; update(dt:number): void; reset(): void };

export function buildMainDoor(scene: Scene, position: Vector3): MainDoor {
  const wood=new StandardMaterial("door-oak",scene); wood.diffuseColor=new Color3(.18,.085,.03); const iron=new StandardMaterial("door-iron",scene); iron.diffuseColor=new Color3(.12,.13,.13);
  const root=new TransformNode("main-door-hinge",scene); root.position.set(position.x-1.9,0,position.z);
  const slab=MeshBuilder.CreateBox("main-door-leaf",{width:3.8,height:4.6,depth:.34},scene); slab.parent=root; slab.position.set(1.9,2.3,0); slab.material=wood;
  for(const x of [.35,1.9,3.45]){const band=MeshBuilder.CreateBox(`door-band-${x}`,{width:.16,height:4.8,depth:.43},scene);band.parent=root;band.position.set(x,2.3,-.03);band.material=iron;}
  for(const y of [1.05,2.3,3.55]){const brace=MeshBuilder.CreateBox(`door-brace-${y}`,{width:3.95,height:.15,depth:.44},scene);brace.parent=root;brace.position.set(1.9,y,-.03);brace.material=iron;}
  let leaf:PhysicsAggregate|undefined; let seal:PhysicsAggregate|undefined; const createColliders=()=>{leaf=new PhysicsAggregate(slab,PhysicsShapeType.BOX,{mass:0,friction:.9},scene); const block=MeshBuilder.CreateBox("main-door-closed-seal",{width:5.05,height:5.2,depth:.9},scene);block.position.set(position.x,2.6,position.z+.1);block.isVisible=false;seal=new PhysicsAggregate(block,PhysicsShapeType.BOX,{mass:0,friction:.95},scene);}; createColliders();
  let state:DoorState="CLOSED", angle=0, released=false; const max=-1.38;
  return { position:position.clone(), get state(){return state;}, get angle(){return angle;}, get sealEnabled(){return !!seal;}, get traversable(){return state==="OPEN";}, root,
    interact(){if(state!=="CLOSED")return false;state="OPENING";return true;},
    update(dt){if(state!=="OPENING")return;angle=Math.max(max,angle-dt*.72);root.rotation.y=angle;if(!released&&Math.abs(angle)>.88){leaf?.dispose();seal?.dispose();leaf=undefined;seal=undefined;released=true;}if(angle===max)state="OPEN";},
    reset(){leaf?.dispose();seal?.dispose();angle=0;root.rotation.y=0;state="CLOSED";released=false;createColliders();}
  };
}
