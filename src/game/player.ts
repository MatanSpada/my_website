import { MeshBuilder, PhysicsAggregate, PhysicsShapeType, Quaternion, Vector3, type Scene } from "@babylonjs/core";
import { normalizedInput, type InputState } from "./input";
import { approach } from "./motion";
import type { MovementProfile } from "./profile";
// The 1.8 m capsule rests with its transform center .9 m above the flat floor.
// Its vertical velocity is constrained in this flat CAVE-002 chamber so gravity cannot
// introduce a camera-height settle between otherwise planar movement samples.
export const CAPSULE_CENTER_HEIGHT = .9;
export const SPAWN = new Vector3(0, CAPSULE_CENTER_HEIGHT, 7);
export class PhysicalPlayer {
  readonly body; position = SPAWN.clone(); velocity = new Vector3(); grounded = false;
  constructor(scene: Scene, spawn = SPAWN) { this.position.copyFrom(spawn); const capsule = MeshBuilder.CreateCapsule("player-body", { height: 1.8, radius: .32 }, scene); capsule.isVisible = false; capsule.position.copyFrom(this.position); this.body = new PhysicsAggregate(capsule, PhysicsShapeType.CAPSULE, { mass: 80, friction: .8, radius: .32, pointA: new Vector3(0, -.58, 0), pointB: new Vector3(0, .58, 0) }, scene); }
  update(dt: number, input: InputState, yaw: number, profile: MovementProfile) { const direction = normalizedInput(input); const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)); const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)); const wanted = forward.scale(direction.z).add(right.scale(direction.x)).scale(profile.maxSpeed); const rate = wanted.lengthSquared() ? profile.acceleration : profile.deceleration; this.velocity.x = approach(this.velocity.x, wanted.x, rate, dt); this.velocity.z = approach(this.velocity.z, wanted.z, rate, dt); const previous = this.position.clone(); this.body.body.setLinearVelocity(new Vector3(this.velocity.x, 0, this.velocity.z)); this.position.copyFrom(this.body.transformNode.position); this.position.y = CAPSULE_CENTER_HEIGHT; this.body.transformNode.position.y = CAPSULE_CENTER_HEIGHT; this.velocity.copyFrom(this.body.body.getLinearVelocity()); this.velocity.y = 0; this.grounded = true; return { speed: Math.hypot(this.velocity.x, this.velocity.z), actualMovement: Math.hypot(previous.x - this.position.x, previous.z - this.position.z) > .0001 };
  }
  reset(spawn = SPAWN) { this.position.copyFrom(spawn); this.velocity.setAll(0); this.body.body.setLinearVelocity(Vector3.Zero()); this.body.body.setAngularVelocity(Vector3.Zero()); this.body.transformNode.position.copyFrom(this.position); this.body.transformNode.rotationQuaternion = Quaternion.Identity(); this.body.body.disablePreStep = false; }
}
