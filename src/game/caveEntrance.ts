import { Color3, HemisphericLight, MeshBuilder, PhysicsAggregate, PhysicsShapeType, PointLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { buildMainDoor, type MainDoor } from "./mainDoor";
import { buildCaveInterior, type SpecializationDoor } from "./caveInterior";

export type WorldInfo = { name: "cave-entrance" | "chamber"; spawn: Vector3; yaw: number; door?: MainDoor; specializationDoors?:SpecializationDoor[] };
const material = (scene: Scene, name: string, color: Color3) => { const value = new StandardMaterial(name, scene); value.diffuseColor = color; value.specularColor = color.scale(.08); return value; };
const staticBox = (scene: Scene, name: string, x: number, y: number, z: number, width: number, height: number, depth: number, mat: StandardMaterial) => { const mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene); mesh.position.set(x, y, z); mesh.material = mat; new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0, friction: .9 }, scene); return mesh; };

export function buildCaveEntrance(scene: Scene): WorldInfo {
  scene.clearColor.set(.025, .035, .05, 1); scene.fogMode = Scene.FOGMODE_EXP2; scene.fogDensity = .016; scene.fogColor = new Color3(.035, .05, .065);
  const ground = material(scene, "wet-slate-ground", new Color3(.11, .125, .105));
  const stone = material(scene, "facade-stone", new Color3(.16, .175, .18));
  const darkStone = material(scene, "deep-stone", new Color3(.03, .04, .045));
  const moss = material(scene, "moss-stone", new Color3(.065, .09, .065));
  const floor = MeshBuilder.CreateGround("exterior-ground", { width: 46, height: 46, subdivisions: 8 }, scene); floor.material = ground; new PhysicsAggregate(floor, PhysicsShapeType.BOX, { mass: 0, friction: .95 }, scene);
  // Large asymmetric facade masses create a natural opening instead of a room-shaped wall.
  staticBox(scene, "facade-left", -5.2, 3.3, -6.7, 6.8, 6.6, 2.8, stone); staticBox(scene, "facade-right", 5.2, 3.3, -6.7, 6.8, 6.6, 2.8, stone);
  staticBox(scene, "facade-crown", 0, 6.1, -6.7, 5.6, 2.8, 2.8, stone);
  const caveDepth=MeshBuilder.CreateBox("cave-depth",{width:5.2,height:6.2,depth:2.4},scene);caveDepth.position.set(0,3.1,-30);caveDepth.material=darkStone;
  for (const [i, data] of [[-7,5.2,-7.8,5.2,7.4,4], [6.7,5,-7.8,5.6,7.2,4.2], [0,8,-8.2,10.5,4.4,4.5]].entries()) { const [x,y,z,w,h,d] = data; const mass=i===2?MeshBuilder.CreateBox(`mountain-crown-${i}`,{width:w,height:h,depth:d},scene):staticBox(scene, `mountain-mass-${i}`, x,y,z,w,h,d, stone); mass.position.set(x,y,z); mass.material=stone; mass.rotation.y = (i - 1) * .18; }
  for (const [i, data] of [[-9,1.6,-3.5,3.4,3.2,3], [8.8,1.4,-2.4,3.8,2.8,3.4], [-8,1.1,2.5,4,2.2,3], [8,1.2,3.8,4.2,2.4,3.2], [-5.5,.75,7,2.4,1.5,2]] .entries()) { const [x,y,z,w,h,d] = data; const rock = staticBox(scene, `outer-rock-${i}`, x, y, z, w, h, d, i % 2 ? stone : moss); rock.rotation.y = i * .37; }
  for (const [i, data] of [[-3.4,-2.8,1.3],[-2.8,-1.8,.8],[2.9,-1.5,1.05],[-4.8,3.6,.7],[4.6,4.8,.95],[1.8,7.2,.65]].entries()) { const [x,z,size] = data; const rock = MeshBuilder.CreateIcoSphere(`detail-rock-${i}`, { radius: size, subdivisions: 2 }, scene); rock.position.set(x, size * .34, z); rock.scaling.y = .62; rock.material = i % 2 ? moss : stone; }
  const grass = material(scene, "sparse-vegetation", new Color3(.12, .22, .1));
  for (const [i, data] of [[-4.1,-.6],[-3.3,.5],[3.8,-.2],[4.6,1.4],[-5,3.4],[2.7,3.2]].entries()) { const [x,z] = data; const tuft=MeshBuilder.CreateCylinder(`grass-tuft-${i}`, { height:.34, diameterTop:0, diameterBottom:.26, tessellation:5 }, scene); tuft.position.set(x,.17,z); tuft.material=grass; }
  const door = buildMainDoor(scene, new Vector3(0, 0, -5.18));
  const interior=buildCaveInterior(scene,stone,material(scene,"interior-wood",new Color3(.12,.055,.02)));
  const arch = material(scene, "arch-stone", new Color3(.15, .155, .15));
  for (const x of [-2.2, 2.2]) staticBox(scene, `door-pier-${x}`, x, 2.45, -5.35, .65, 4.9, .8, arch);
  staticBox(scene, "door-lintel", 0, 4.8, -5.35, 5.1, .65, .8, arch);
  const cool = new HemisphericLight("cold-night", new Vector3(.1, 1, .2), scene); cool.diffuse = new Color3(.48, .58, .67); cool.groundColor = new Color3(.055, .07, .075); cool.intensity = 1.05;
  const guide = new PointLight("entrance-glow", new Vector3(0, 3.7, -2.8), scene); guide.diffuse = new Color3(.9, .62, .34); guide.intensity = 95; guide.range = 19;
  return { name: "cave-entrance", spawn: new Vector3(0, .9, 9), yaw: Math.PI, door, specializationDoors:interior };
}
