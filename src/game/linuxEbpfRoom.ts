import { Color3, DynamicTexture, MeshBuilder, PhysicsAggregate, PhysicsShapeType, PointLight, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";

export type PortfolioExhibit = { id:string; title:string; description:string; tags:readonly string[]; position:Vector3; rotationY:number };
export const LINUX_EBPF_EXHIBITS: readonly PortfolioExhibit[] = [
  { id:"linux-ebpf-identity", title:"LINUX KERNEL & eBPF", description:"Systems-focused technical chamber.", tags:["Linux","eBPF"], position:new Vector3(5,4.6,-23.65), rotationY:Math.PI },
  { id:"ebpf-execution-flow", title:"eBPF EXECUTION FLOW", description:"Kernel hooks · verified programs · events", tags:["Kernel","Events"], position:new Vector3(4.05,2.9,-22.3), rotationY:Math.PI/2 },
  { id:"kernel-userspace-pipeline", title:"KERNEL → USER SPACE", description:"A concise event-pipeline study.", tags:["Pipeline","User space"], position:new Vector3(6.95,2.9,-22.3), rotationY:-Math.PI/2 }
];

const material=(scene:Scene,name:string,color:Color3)=>{const value=new StandardMaterial(name,scene);value.diffuseColor=color;value.specularColor=color.scale(.12);return value;};
const box=(scene:Scene,name:string,position:Vector3,size:Vector3,mat:StandardMaterial,physical=true)=>{const mesh=MeshBuilder.CreateBox(name,{width:size.x,height:size.y,depth:size.z},scene);mesh.position.copyFrom(position);mesh.material=mat;if(physical)new PhysicsAggregate(mesh,PhysicsShapeType.BOX,{mass:0,friction:.9},scene);mesh.freezeWorldMatrix();return mesh;};
const plaque=(scene:Scene,exhibit:PortfolioExhibit,bronze:StandardMaterial)=>{const face=MeshBuilder.CreatePlane(`${exhibit.id}-plaque`,{width:2.35,height:.72},scene);face.position.copyFrom(exhibit.position);face.rotation.y=exhibit.rotationY;const text=new DynamicTexture(`${exhibit.id}-text`,{width:1024,height:320},scene,false);text.drawText(exhibit.title,512,105,"600 40px Georgia","#ead9a8","#1c1710",true,true);text.drawText(exhibit.description,512,205,"26px Arial","#d5c9ab","#1c1710",true,true);text.drawText(exhibit.tags.join("  ·  "),512,275,"22px Arial","#b89054","#1c1710",true,true);const mat=new StandardMaterial(`${exhibit.id}-material`,scene);mat.diffuseTexture=text;mat.emissiveTexture=text;mat.disableLighting=true;face.material=mat;face.freezeWorldMatrix();};

export function buildLinuxEbpfRoom(scene:Scene){
  const stone=material(scene,"linux-room-stone",new Color3(.09,.1,.1)); const accent=material(scene,"linux-room-accent",new Color3(.18,.13,.07)); const iron=material(scene,"linux-room-iron",new Color3(.09,.12,.12)); const bronze=material(scene,"linux-room-bronze",new Color3(.16,.105,.045));
  // The room is a compact annex behind the hall's Linux/eBPF doorway; collision remains simple and reliable.
  box(scene,"linux-room-left-wall",new Vector3(3.45,3,-22.25),new Vector3(.45,6,4.2),stone); box(scene,"linux-room-right-wall",new Vector3(7.75,3,-22.25),new Vector3(.45,6,4.2),stone); box(scene,"linux-room-end-wall",new Vector3(5.6,3,-24.35),new Vector3(4.7,6,.45),stone); box(scene,"linux-room-ceiling",new Vector3(5.6,6,-22.25),new Vector3(4.7,.45,4.2),stone);
  for(const exhibit of LINUX_EBPF_EXHIBITS){const pedestal=exhibit.id==="linux-ebpf-identity"?new Vector3(2.8,.65,.55):new Vector3(.65,1.4,.55);box(scene,`${exhibit.id}-pedestal`,new Vector3(exhibit.position.x,.35,exhibit.position.z+(exhibit.rotationY===Math.PI?.22:0)),pedestal,accent);plaque(scene,exhibit,bronze);}
  for(const [index,z] of [-21.1,-23.3].entries()){const light=new PointLight(`linux-room-light-${index}`,new Vector3(5.6,4,z),scene);light.diffuse=new Color3(.72,.57,.36);light.intensity=1.25;light.range=5;light.includedOnlyMeshes=scene.meshes.filter(mesh=>mesh.name.startsWith("linux-room")||mesh.name.includes("ebpf")||mesh.name.includes("kernel-userspace"));}
  return LINUX_EBPF_EXHIBITS;
}
