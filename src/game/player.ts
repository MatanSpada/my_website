import { MeshBuilder, PhysicsAggregate, PhysicsShapeType, Quaternion, Vector3, type Scene } from "@babylonjs/core";
import { normalizedInput, type InputState } from "./input";
import type { MovementProfile } from "./profile";
export const SPAWN = new Vector3(0, .9, 7);
export const CAPSULE_CENTER_HEIGHT = .9;
export class PhysicalPlayer {
  readonly body; position = SPAWN.clone(); velocity = new Vector3(); grounded = false;
  constructor(scene: Scene) { const capsule = MeshBuilder.CreateCapsule("player-body", { height: 1.8, radius: .32 }, scene); capsule.isVisible = false; capsule.position.copyFrom(this.position); this.body = new PhysicsAggregate(capsule, PhysicsShapeType.CAPSULE, { mass: 80, friction: .8 }, scene); }
  update(dt: number, input: InputState, yaw: number, profile: MovementProfile) { const direction = normalizedInput(input); const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)); const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)); const wanted = forward.scale(direction.z).add(right.scale(direction.x)).scale(profile.maxSpeed); const rate = wanted.lengthSquared() ? profile.acceleration : profile.deceleration; this.velocity.x += (wanted.x - this.velocity.x) * Math.min(1, rate * dt); this.velocity.z += (wanted.z - this.velocity.z) * Math.min(1, rate * dt); const previous = this.position.clone(); const physicalVelocity = this.body.body.getLinearVelocity(); this.body.body.setLinearVelocity(new Vector3(this.velocity.x, physicalVelocity.y, this.velocity.z)); this.position.copyFrom(this.body.transformNode.position); this.velocity.copyFrom(this.body.body.getLinearVelocity()); this.grounded = this.position.y <= 1.02 && this.velocity.y <= .15; return { speed: Math.hypot(this.velocity.x, this.velocity.z), actualMovement: Math.hypot(previous.x - this.position.x, previous.z - this.position.z) > .0001 };
  }
  reset() { this.position.copyFrom(SPAWN); this.velocity.setAll(0); this.body.body.setLinearVelocity(Vector3.Zero()); this.body.body.setAngularVelocity(Vector3.Zero()); this.body.transformNode.position.copyFrom(this.position); this.body.transformNode.rotationQuaternion = Quaternion.Identity(); this.body.body.disablePreStep = false; }
}
