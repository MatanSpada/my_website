export type ProfileName = "grounded" | "responsive" | "cinematic";
export interface MovementProfile { name: ProfileName; maxSpeed: number; acceleration: number; deceleration: number; fov: number; mouseSensitivity: number; eyeHeight: number; bobAmplitude: number; bobFrequency: number; breathingAmplitude: number; breathingFrequency: number; }
export const profiles: Record<ProfileName, MovementProfile> = {
  grounded: { name: "grounded", maxSpeed: 4.4, acceleration: 18, deceleration: 22, fov: 1.05, mouseSensitivity: .002, eyeHeight: 1.58, bobAmplitude: .035, bobFrequency: 10, breathingAmplitude: .012, breathingFrequency: 1.4 },
  responsive: { name: "responsive", maxSpeed: 5.2, acceleration: 28, deceleration: 30, fov: 1.12, mouseSensitivity: .00225, eyeHeight: 1.6, bobAmplitude: .028, bobFrequency: 11, breathingAmplitude: .01, breathingFrequency: 1.5 },
  cinematic: { name: "cinematic", maxSpeed: 3.9, acceleration: 11, deceleration: 14, fov: .98, mouseSensitivity: .00165, eyeHeight: 1.56, bobAmplitude: .042, bobFrequency: 8.5, breathingAmplitude: .016, breathingFrequency: 1.2 }
};
export function selectedProfile(value: string | null): MovementProfile { return profiles[value as ProfileName] ?? profiles.grounded; }
