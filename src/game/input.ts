export type InputState = { forward: boolean; backward: boolean; left: boolean; right: boolean };
export class PlayerInput {
  readonly state: InputState = { forward: false, backward: false, left: false, right: false };
  private listeners = 0;
  constructor(private readonly onReset: () => void, private readonly review: boolean) {
    window.addEventListener("keydown", this.keyDown); window.addEventListener("keyup", this.keyUp); window.addEventListener("blur", this.clear); document.addEventListener("pointerlockchange", this.onLock); this.listeners = 4;
  }
  private keyDown = (event: KeyboardEvent) => { if (this.review && event.code === "KeyR") this.onReset(); this.set(event.code, true); };
  private keyUp = (event: KeyboardEvent) => this.set(event.code, false);
  private set(code: string, value: boolean) { if (code === "KeyW" || code === "ArrowUp") this.state.forward = value; if (code === "KeyS" || code === "ArrowDown") this.state.backward = value; if (code === "KeyA" || code === "ArrowLeft") this.state.left = value; if (code === "KeyD" || code === "ArrowRight") this.state.right = value; }
  clear = () => { Object.keys(this.state).forEach((key) => { this.state[key as keyof InputState] = false; }); };
  private onLock = () => { if (document.pointerLockElement === null) this.clear(); };
  dispose() { window.removeEventListener("keydown", this.keyDown); window.removeEventListener("keyup", this.keyUp); window.removeEventListener("blur", this.clear); document.removeEventListener("pointerlockchange", this.onLock); this.listeners = 0; }
  get listenerCount() { return this.listeners; }
}
export function normalizedInput(input: InputState) { const x = (input.right ? 1 : 0) - (input.left ? 1 : 0); const z = (input.forward ? 1 : 0) - (input.backward ? 1 : 0); const length = Math.hypot(x, z); return length > 0 ? { x: x / length, z: z / length } : { x: 0, z: 0 }; }
