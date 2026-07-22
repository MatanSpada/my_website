import { Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";

export const DOOR_STATE = "CLOSED" as const;
export type MainDoor = { state: typeof DOOR_STATE; position: Vector3; collisionEnabled: true };

export function buildMainDoor(scene: Scene, position: Vector3): MainDoor {
  const wood = new StandardMaterial("door-oak", scene); wood.diffuseColor = new Color3(.13, .065, .025); wood.specularColor = new Color3(.04, .025, .01);
  const iron = new StandardMaterial("door-iron", scene); iron.diffuseColor = new Color3(.09, .1, .1); iron.specularColor = new Color3(.16, .17, .16);
  const slab = MeshBuilder.CreateBox("main-door-closed", { width: 3.8, height: 4.6, depth: .34 }, scene); slab.position.copyFrom(position); slab.position.y = 2.3; slab.material = wood;
  new PhysicsAggregate(slab, PhysicsShapeType.BOX, { mass: 0, friction: .9 }, scene);
  // One deliberately oversized CLOSED-state seal closes both leaf-edge and jamb gaps.
  // CAVE-004 can replace this single aggregate when the door begins to animate.
  const seal = MeshBuilder.CreateBox("main-door-closed-seal", { width: 5.05, height: 5.2, depth: .9 }, scene); seal.position.set(position.x, 2.6, position.z + .1); seal.isVisible = false;
  new PhysicsAggregate(seal, PhysicsShapeType.BOX, { mass: 0, friction: .95 }, scene);
  for (const x of [-1.55, 0, 1.55]) { const band = MeshBuilder.CreateBox(`door-band-${x}`, { width: .16, height: 4.8, depth: .43 }, scene); band.position.set(position.x + x, 2.3, position.z - .03); band.material = iron; }
  for (const y of [1.05, 2.3, 3.55]) { const band = MeshBuilder.CreateBox(`door-brace-${y}`, { width: 3.95, height: .15, depth: .44 }, scene); band.position.set(position.x, y, position.z - .03); band.material = iron; }
  for (const x of [-1.72, 1.72]) { const hinge = MeshBuilder.CreateCylinder(`door-hinge-${x}`, { height: 4.8, diameter: .18 }, scene); hinge.position.set(position.x + x, 2.3, position.z + .24); hinge.material = iron; }
  return { state: DOOR_STATE, position: position.clone(), collisionEnabled: true };
}
