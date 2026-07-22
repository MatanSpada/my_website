export type ProfileName = "grounded" | "responsive" | "cinematic" | "locked";
export interface MovementProfile { name: ProfileName; maxSpeed: number; acceleration: number; deceleration: number; fov: number; mouseSensitivity: number; lookResponse: number; eyeHeight: number; bobAmplitude: number; bobFrequency: number; bobResponse: number; breathingAmplitude: number; breathingFrequency: number; }
export const profiles: Record<ProfileName, MovementProfile> = {
  grounded: { name: "grounded", maxSpeed: 4.2, acceleration: 10, deceleration: 7, fov: 1.05, mouseSensitivity: .0018, lookResponse: 12, eyeHeight: 1.58, bobAmplitude: .022, bobFrequency: 8.5, bobResponse: 10, breathingAmplitude: .012, breathingFrequency: 1.4 },
  responsive: { name: "responsive", maxSpeed: 5.7, acceleration: 32, deceleration: 34, fov: 1.13, mouseSensitivity: .0026, lookResponse: 48, eyeHeight: 1.58, bobAmplitude: .012, bobFrequency: 12, bobResponse: 22, breathingAmplitude: .01, breathingFrequency: 1.5 },
  cinematic: { name: "cinematic", maxSpeed: 3.2, acceleration: 5, deceleration: 4, fov: .94, mouseSensitivity: .00135, lookResponse: 4, eyeHeight: 1.58, bobAmplitude: .045, bobFrequency: 7, bobResponse: 5, breathingAmplitude: .016, breathingFrequency: 1.2 },
  locked: { name: "locked", maxSpeed: 4.5, acceleration: 15, deceleration: 13, fov: 1.07, mouseSensitivity: .002, lookResponse: 18, eyeHeight: 1.58, bobAmplitude: .017, bobFrequency: 9.4, bobResponse: 14, breathingAmplitude: .007, breathingFrequency: 1.35 }
};
export const DEFAULT_PROFILE: ProfileName = "locked";
export function selectedProfile(value: string | null): MovementProfile { return profiles[value as ProfileName] ?? profiles[DEFAULT_PROFILE]; }
