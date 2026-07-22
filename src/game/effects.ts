import type { MovementProfile } from "./profile";
import { approach } from "./motion";
export class CameraEffects {
  private phase = 0; private bob = 0; private breathing = 0;
  update(dt: number, speed: number, moving: boolean, backwards: boolean, profile: MovementProfile) { this.phase += dt; this.breathing = Math.sin(this.phase * profile.breathingFrequency) * profile.breathingAmplitude; if (moving && speed > .12) { const target = Math.sin(this.phase * profile.bobFrequency) * profile.bobAmplitude * (backwards ? .72 : 1); this.bob = approach(this.bob, target, profile.bobResponse, dt); } else this.bob = approach(this.bob, 0, profile.bobResponse, dt); return { bob: this.bob, breathing: this.breathing }; }
  reset() { this.phase = 0; this.bob = 0; this.breathing = 0; }
  get offsets() { return { bob: this.bob, breathing: this.breathing }; }
}
