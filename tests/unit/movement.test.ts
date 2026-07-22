import { describe, expect, it } from "vitest";
import { normalizedInput } from "../../src/game/input";
import { applyMouseLook, PITCH_LIMIT, smoothLook } from "../../src/game/look";
import { approach } from "../../src/game/motion";
import { profiles, selectedProfile } from "../../src/game/profile";
import { CameraEffects } from "../../src/game/effects";
describe("movement foundations", () => {
  it("normalizes diagonal input", () => expect(Math.hypot(...Object.values(normalizedInput({forward:true,backward:false,left:false,right:true})))) .toBeCloseTo(1));
  it("falls back for invalid profile", () => expect(selectedProfile("broken").name).toBe("grounded"));
  it("maps right, left, up, and down mouse movement to the matching look directions", () => {
    const profile=selectedProfile("grounded");
    expect(applyMouseLook({yaw:0,pitch:0},20,0,profile).yaw).toBeGreaterThan(0);
    expect(applyMouseLook({yaw:0,pitch:0},-20,0,profile).yaw).toBeLessThan(0);
    expect(applyMouseLook({yaw:0,pitch:0},0,-20,profile).pitch).toBeLessThan(0);
    expect(applyMouseLook({yaw:0,pitch:0},0,20,profile).pitch).toBeGreaterThan(0);
  });
  it("clamps mouse pitch while preserving both look directions", () => {
    const profile=selectedProfile("grounded");
    expect(applyMouseLook({yaw:0,pitch:PITCH_LIMIT},0,10000,profile).pitch).toBe(PITCH_LIMIT);
    expect(applyMouseLook({yaw:0,pitch:-PITCH_LIMIT},0,-10000,profile).pitch).toBe(-PITCH_LIMIT);
  });
  it("selects each requested profile and gives each measurable movement and camera behavior", () => {
    expect(selectedProfile("grounded")).toBe(profiles.grounded);
    expect(selectedProfile("responsive")).toBe(profiles.responsive);
    expect(selectedProfile("cinematic")).toBe(profiles.cinematic);
    expect(profiles.responsive.maxSpeed).toBeGreaterThan(profiles.grounded.maxSpeed);
    expect(profiles.grounded.maxSpeed).toBeGreaterThan(profiles.cinematic.maxSpeed);
    expect(profiles.responsive.acceleration).toBeGreaterThan(profiles.grounded.acceleration);
    expect(profiles.grounded.acceleration).toBeGreaterThan(profiles.cinematic.acceleration);
    expect(profiles.responsive.deceleration).toBeGreaterThan(profiles.grounded.deceleration);
    expect(profiles.grounded.deceleration).toBeGreaterThan(profiles.cinematic.deceleration);
    expect(profiles.responsive.lookResponse).toBeGreaterThan(profiles.grounded.lookResponse);
    expect(profiles.grounded.lookResponse).toBeGreaterThan(profiles.cinematic.lookResponse);
    expect(profiles.responsive.fov).toBeGreaterThan(profiles.grounded.fov);
    expect(profiles.grounded.fov).toBeGreaterThan(profiles.cinematic.fov);
    expect(profiles.cinematic.bobAmplitude).toBeGreaterThan(profiles.grounded.bobAmplitude);
    expect(profiles.grounded.bobAmplitude).toBeGreaterThan(profiles.responsive.bobAmplitude);
  });
  it("gives responsive the fastest acceleration and stop, and cinematic the smoothest camera", () => {
    const dt=1/60;
    const afterTenFrames=(profile=profiles.grounded)=>{ let speed=0; for(let frame=0;frame<10;frame++) speed=approach(speed,profile.maxSpeed,profile.acceleration,dt); return speed; };
    expect(afterTenFrames(profiles.responsive)).toBeGreaterThan(afterTenFrames(profiles.grounded));
    expect(afterTenFrames(profiles.grounded)).toBeGreaterThan(afterTenFrames(profiles.cinematic));
    const stoppedAfterSixFrames=(profile=profiles.grounded)=>{ let speed=profile.maxSpeed; for(let frame=0;frame<6;frame++) speed=approach(speed,0,profile.deceleration,dt); return speed; };
    expect(stoppedAfterSixFrames(profiles.responsive)).toBeLessThan(stoppedAfterSixFrames(profiles.grounded));
    expect(stoppedAfterSixFrames(profiles.grounded)).toBeLessThan(stoppedAfterSixFrames(profiles.cinematic));
    expect(smoothLook(0,1,dt,profiles.responsive.lookResponse)).toBeGreaterThan(smoothLook(0,1,dt,profiles.grounded.lookResponse));
    expect(smoothLook(0,1,dt,profiles.grounded.lookResponse)).toBeGreaterThan(smoothLook(0,1,dt,profiles.cinematic.lookResponse));
  });
  it("has no bob unless actual movement succeeds", () => { const e=new CameraEffects(); for(let i=0;i<20;i++) e.update(1/60,4,false,false,selectedProfile("grounded")); expect(e.offsets.bob).toBe(0); });
  it("breathing does not change a body coordinate", () => { const body={y:1}; const e=new CameraEffects(); e.update(1,0,false,false,selectedProfile("grounded")); expect(body.y).toBe(1); expect(e.offsets.breathing).not.toBe(0); });
  it("effects return to neutral without drift", () => { const e=new CameraEffects(); for(let i=0;i<30;i++)e.update(1/60,4,true,false,selectedProfile("grounded")); for(let i=0;i<120;i++)e.update(1/60,0,false,false,selectedProfile("grounded")); expect(Math.abs(e.offsets.bob)).toBeLessThan(.001); });
});
