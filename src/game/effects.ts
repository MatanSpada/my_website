import type { MovementProfile } from "./profile";
export class CameraEffects {
  private phase = 0; private bob = 0; private breathing = 0;
  update(dt: number, speed: number, moving: boolean, backwards: boolean, profile: MovementProfile) { this.phase += dt; this.breathing = Math.sin(this.phase * profile.breathingFrequency) * profile.breathingAmplitude; if (moving && speed > .12) { const target = Math.sin(this.phase * profile.bobFrequency) * profile.bobAmplitude * (backwards ? .72 : 1); this.bob += (target - this.bob) * Math.min(1, dt * 14); } else this.bob += (0 - this.bob) * Math.min(1, dt * 12); return { bob: this.bob, breathing: this.breathing }; }
  reset() { this.phase = 0; this.bob = 0; this.breathing = 0; }
  get offsets() { return { bob: this.bob, breathing: this.breathing }; }
}
