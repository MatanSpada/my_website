import type { MovementProfile } from "./profile";
import { approach } from "./motion";

export const PITCH_LIMIT = 1.35;

export type LookState = { yaw: number; pitch: number };

export function applyMouseLook(look: LookState, movementX: number, movementY: number, profile: MovementProfile): LookState {
  return {
    yaw: look.yaw + movementX * profile.mouseSensitivity,
    pitch: Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, look.pitch + movementY * profile.mouseSensitivity))
  };
}

export function smoothLook(current: number, target: number, dt: number, response: number) {
  return approach(current, target, response, dt);
}
