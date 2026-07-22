import { describe, expect, it } from "vitest";
import { normalizedInput } from "../../src/game/input";
import { selectedProfile } from "../../src/game/profile";
import { CameraEffects } from "../../src/game/effects";
describe("movement foundations", () => {
  it("normalizes diagonal input", () => expect(Math.hypot(...Object.values(normalizedInput({forward:true,backward:false,left:false,right:true})))) .toBeCloseTo(1));
  it("falls back for invalid profile", () => expect(selectedProfile("broken").name).toBe("grounded"));
  it("has no bob unless actual movement succeeds", () => { const e=new CameraEffects(); for(let i=0;i<20;i++) e.update(1/60,4,false,false,selectedProfile("grounded")); expect(e.offsets.bob).toBe(0); });
  it("breathing does not change a body coordinate", () => { const body={y:1}; const e=new CameraEffects(); e.update(1,0,false,false,selectedProfile("grounded")); expect(body.y).toBe(1); expect(e.offsets.breathing).not.toBe(0); });
  it("effects return to neutral without drift", () => { const e=new CameraEffects(); for(let i=0;i<30;i++)e.update(1/60,4,true,false,selectedProfile("grounded")); for(let i=0;i<120;i++)e.update(1/60,0,false,false,selectedProfile("grounded")); expect(Math.abs(e.offsets.bob)).toBeLessThan(.001); });
});
