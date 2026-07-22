export function approach(current: number, target: number, rate: number, dt: number) {
  return current + (target - current) * Math.min(1, rate * dt);
}
