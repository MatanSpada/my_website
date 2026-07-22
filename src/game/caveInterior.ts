import { Color3, DynamicTexture, Mesh, MeshBuilder, PhysicsAggregate, PhysicsShapeType, PointLight, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";

export const SPECIALIZATIONS = ["RUNTIME THREAT DETECTION", "LINUX KERNEL & eBPF", "EMBEDDED & IoT SYSTEMS", "OTA & DEVICE FLEETS", "SENSOR DATA PIPELINES"] as const;
export type SpecializationDoor = { id: string; label: string; position: Vector3; state: "CLOSED"; collisionEnabled: true };
export const LINUX_EBPF_DOOR_ID="specialization-1";

const physicalBox = (scene: Scene, name: string, position: Vector3, size: Vector3, material: StandardMaterial) => {
  const mesh = MeshBuilder.CreateBox(name, { width: size.x, height: size.y, depth: size.z }, scene);
  mesh.position.copyFrom(position); mesh.material = material;
  new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0, friction: .92 }, scene);
  mesh.freezeWorldMatrix();
  return mesh;
};

const visualBox = (scene: Scene, name: string, position: Vector3, size: Vector3, material: StandardMaterial) => {
  const mesh = MeshBuilder.CreateBox(name, { width: size.x, height: size.y, depth: size.z }, scene);
  mesh.position.copyFrom(position); mesh.material = material; mesh.freezeWorldMatrix();
  return mesh;
};

const rock = (scene: Scene, name: string, position: Vector3, scaling: Vector3, material: StandardMaterial, turn: number) => {
  const mesh = MeshBuilder.CreateIcoSphere(name, { radius: 1, subdivisions: 2 }, scene);
  mesh.position.copyFrom(position); mesh.scaling.copyFrom(scaling); mesh.rotation.set(turn * .18, turn * .37, turn * .23); mesh.material = material; mesh.freezeWorldMatrix();
  return mesh;
};

const plaque = (scene: Scene, name: string, label: string, position: Vector3, rotationY: number, bronze: StandardMaterial) => {
  const backing = visualBox(scene, `${name}-plaque-stone`, position.add(new Vector3(0, 0, rotationY === Math.PI ? -.08 : .08)), new Vector3(2.7, .72, .12), bronze);
  backing.rotation.y = rotationY;
  const face = MeshBuilder.CreatePlane(`${name}-plaque-text`, { width: 2.46, height: .5 }, scene);
  face.position.copyFrom(position); face.position.z += rotationY === Math.PI ? -.15 : .15; face.rotation.y = rotationY;
  const texture = new DynamicTexture(`${name}-label`, { width: 1024, height: 256 }, scene, false);
  texture.drawText(label, 512, 160, "600 45px Georgia", "#f1dcaa", "#201a12", true, true);
  const labelMaterial = new StandardMaterial(`${name}-label-material`, scene);
  labelMaterial.diffuseTexture = texture; labelMaterial.emissiveTexture = texture; labelMaterial.disableLighting = true;
  face.material = labelMaterial; face.freezeWorldMatrix();
};

export function buildCaveInterior(scene: Scene, stone: StandardMaterial, wood: StandardMaterial) {
  const deepStone = new StandardMaterial("interior-deep-stone", scene); deepStone.diffuseColor = new Color3(.075, .086, .083); deepStone.specularColor = new Color3(.015, .015, .014);
  const accentStone = new StandardMaterial("interior-warm-stone", scene); accentStone.diffuseColor = new Color3(.17, .15, .115); accentStone.specularColor = new Color3(.02, .018, .012);
  const moss = new StandardMaterial("interior-moss", scene); moss.diffuseColor = new Color3(.07, .115, .062); moss.specularColor = Color3.Black();
  const iron = new StandardMaterial("specialization-iron", scene); iron.diffuseColor = new Color3(.09, .105, .105); iron.specularColor = new Color3(.22, .23, .22);
  const bronze = new StandardMaterial("specialization-plaque-bronze", scene); bronze.diffuseColor = new Color3(.16, .115, .055); bronze.specularColor = new Color3(.32, .23, .11);

  // The simple colliders keep the passage reliable. The irregular rock layer is deliberately visual-only.
  physicalBox(scene, "corridor-left-collision", new Vector3(-3.35, 3, -12.5), new Vector3(.7, 6, 12), deepStone);
  physicalBox(scene, "corridor-right-collision", new Vector3(3.35, 3, -12.5), new Vector3(.7, 6, 12), deepStone);
  physicalBox(scene, "corridor-ceiling-collision", new Vector3(0, 6.15, -12.5), new Vector3(7.4, .7, 12), deepStone);
  for (const [i, [x, y, z, sx, sy, sz]] of [[-3.03, 1.1, -8.8, 1.1, 1.2, .8], [3.04, 2.9, -10.2, 1.25, 1.8, .85], [-3.04, 4.65, -12.1, 1.1, 1.15, .75], [3.02, 1.15, -14.2, 1.3, 1.1, .85], [-3.05, 3.25, -15.7, 1.2, 1.7, .8], [3.0, 4.75, -17.3, 1.1, 1.05, .75]].entries()) rock(scene, `corridor-rock-${i}`, new Vector3(x, y, z), new Vector3(sx, sy, sz), i % 2 ? stone : accentStone, i + 2);
  for (const [i, z] of [-8.7, -11.7, -14.8, -17.1].entries()) visualBox(scene, `corridor-floor-ridge-${i}`, new Vector3(i % 2 ? 2.85 : -2.85, .16, z), new Vector3(.45, .18, 1.65), i === 1 ? moss : accentStone);
  for (const z of [-8.5, -12, -15.5]) {
    const light = new PointLight(`corridor-guidance-${z}`, new Vector3(0, 3.75, z), scene);
    light.diffuse = new Color3(.78, .56, .33); light.intensity = 1.5; light.range = 7.5;
    light.includedOnlyMeshes = scene.meshes.filter(mesh => mesh.name.startsWith("corridor"));
  }

  physicalBox(scene, "hall-back-collision", new Vector3(0, 4.2, -27.1), new Vector3(16.4, 8.4, .8), deepStone);
  physicalBox(scene, "hall-left-collision", new Vector3(-8.15, 4.2, -22.5), new Vector3(.8, 8.4, 9.8), deepStone);
  physicalBox(scene, "hall-right-collision", new Vector3(8.15, 4.2, -22.5), new Vector3(.8, 8.4, 9.8), deepStone);
  physicalBox(scene, "hall-ceiling-collision", new Vector3(0, 8.35, -22.5), new Vector3(16.4, .7, 9.8), deepStone);
  for (const [i, [x, z, scale]] of [[-7.3, -18.5, 1.5], [7.25, -18.8, 1.35], [-7.25, -24.8, 1.8], [7.25, -25.6, 1.55], [-3.6, -26.55, 1.1], [3.5, -26.55, 1.15]].entries()) rock(scene, `hall-rock-${i}`, new Vector3(x, scale * .58, z), new Vector3(scale, scale * 1.2, scale * .72), i % 2 ? stone : accentStone, i + 7);
  for (const x of [-6.8, 6.8]) {
    visualBox(scene, `hall-buttress-${x}`, new Vector3(x, 3.5, -22.9), new Vector3(.75, 6.7, 1.05), accentStone);
    visualBox(scene, `hall-buttress-cap-${x}`, new Vector3(x, 6.85, -22.9), new Vector3(1.25, .38, 1.3), stone);
  }
  visualBox(scene, "hall-dais", new Vector3(0, .12, -25.7), new Vector3(5.5, .25, 2.05), accentStone);

  const doors: SpecializationDoor[] = [];
  const positions = [[-5, -20, 0], [5, -20, 1], [-5, -25, 2], [5, -25, 3], [0, -26.5, 4]] as const;
  for (const [x, z, index] of positions) {
    const label = SPECIALIZATIONS[index];
    const isBackDoor = z < -26;
    const rotationY = isBackDoor ? Math.PI : 0;
    const door = index===1 ? { position:new Vector3(x,2.25,z) } : physicalBox(scene, `specialization-${index}`, new Vector3(x, 2.25, z), new Vector3(2.75, 4.5, .42), wood);
    const frameZ = z + (isBackDoor ? -.26 : .26);
    for (const side of [-1.63, 1.63]) visualBox(scene, `specialization-${index}-frame-${side}`, new Vector3(x + side, 2.35, frameZ), new Vector3(.33, 4.9, .5), accentStone);
    visualBox(scene, `specialization-${index}-lintel`, new Vector3(x, 4.72, frameZ), new Vector3(3.55, .42, .5), accentStone);
    for (const y of [1.1, 2.25, 3.4]) visualBox(scene, `specialization-${index}-iron-${y}`, new Vector3(x, y, z + (isBackDoor ? -.25 : .25)), new Vector3(2.82, .13, .12), iron);
    for (const side of [-.95, .95]) visualBox(scene, `specialization-${index}-vertical-${side}`, new Vector3(x + side, 2.25, z + (isBackDoor ? -.25 : .25)), new Vector3(.12, 4.35, .13), iron);
    plaque(scene, `specialization-${index}`, label, new Vector3(x, 5.38, z), rotationY, bronze);
    doors.push({ id: `specialization-${index}`, label, position: door.position.clone(), state: "CLOSED", collisionEnabled: true });
  }
  const hallMeshes = scene.meshes.filter(mesh => mesh.name.startsWith("hall") || mesh.name.startsWith("specialization"));
  const focus = new PointLight("hall-focus", new Vector3(0, 6.4, -23.25), scene); focus.diffuse = new Color3(.84, .64, .4); focus.intensity = 2; focus.range = 15; focus.includedOnlyMeshes = hallMeshes;
  const fill = new PointLight("hall-cool-fill", new Vector3(0, 5.5, -19.2), scene); fill.diffuse = new Color3(.32, .42, .48); fill.intensity = .8; fill.range = 13; fill.includedOnlyMeshes = hallMeshes;
  return doors;
}
