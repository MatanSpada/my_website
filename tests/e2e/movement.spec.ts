import { test, expect, type Page } from "@playwright/test";

type Snapshot = ReturnType<NonNullable<Window["__CAVE_GAME_TEST__"]>["getSnapshot"]>;

async function enter(page: Page) {
  await page.locator("#entry-overlay").click();
  await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().pointerLock);
}

async function snapshot(page: Page) {
  return page.evaluate(() => window.__CAVE_GAME_TEST__!.getSnapshot());
}

async function mouseDelta(page: Page, x: number, y: number) {
  await page.locator("#game-canvas").evaluate((canvas, delta) => {
    const event = new MouseEvent("mousemove");
    Object.defineProperties(event, { movementX: { value: delta.x }, movementY: { value: delta.y } });
    canvas.dispatchEvent(event);
  }, { x, y });
  await page.waitForTimeout(60);
}

async function move(page: Page, keys: string[], duration: number) {
  for (const key of keys) await page.keyboard.down(key);
  await page.waitForTimeout(duration);
  for (const key of keys) await page.keyboard.up(key);
}

test("locked default has stable physical grounding, precise look, and non-drifting idle effects", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/?review=movement");
  await expect(page.locator("#game-canvas")).toBeVisible();
  await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().activeGameLoopCount === 1);
  expect((await snapshot(page)).selectedProfile).toBe("locked");
  await enter(page);
  await page.waitForTimeout(250);
  const idle = await snapshot(page);
  expect(idle.playerPosition.y).toBeCloseTo(.9, 1);
  expect(Math.abs(idle.velocity.y)).toBeLessThan(.15);
  expect(idle.grounded || (idle.playerPosition.y <= .93 && Math.abs(idle.velocity.y) <= .15), JSON.stringify(idle)).toBe(true);
  expect(idle.cameraPosition.y).toBeCloseTo(1.58, 1);
  expect(idle.headBobOffset).toBe(0);
  let look = idle;
  await mouseDelta(page, 90, 0); let next = await snapshot(page); expect(next.targetYaw).toBeGreaterThan(look.targetYaw); look = next;
  await mouseDelta(page, -90, 0); next = await snapshot(page); expect(next.targetYaw).toBeLessThan(look.targetYaw); look = next;
  await mouseDelta(page, 0, -90); next = await snapshot(page); expect(next.targetPitch).toBeLessThan(look.targetPitch); look = next;
  await mouseDelta(page, 0, 90); next = await snapshot(page); expect(next.targetPitch).toBeGreaterThan(look.targetPitch);
  await mouseDelta(page, 0, 100000); expect((await snapshot(page)).targetPitch).toBeLessThanOrEqual(1.35);
  await mouseDelta(page, 0, -200000); expect((await snapshot(page)).targetPitch).toBeGreaterThanOrEqual(-1.35);
  expect(errors).toEqual([]);
});

test("locked profile supports movement, controlled stop, collision, passage, bob, and stable reset", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/?review=movement&profile=locked");
  await page.waitForFunction(() => window.__CAVE_GAME_TEST__);
  await enter(page);
  await page.waitForTimeout(250);
  const origin = await snapshot(page);
  await move(page, ["w"], 300); const forward = await snapshot(page);
  expect(forward.playerPosition.z).toBeGreaterThan(origin.playerPosition.z);
  expect(Math.abs(forward.headBobOffset)).toBeGreaterThan(0);
  await page.waitForTimeout(500); const stopped = await snapshot(page);
  expect(stopped.planarSpeed).toBeLessThan(.1);
  expect(Math.abs(stopped.breathingOffset)).toBeGreaterThan(0);
  await move(page, ["s"], 180); expect((await snapshot(page)).playerPosition.z).toBeLessThan(forward.playerPosition.z);
  await page.keyboard.press("r"); await page.waitForTimeout(120);
  await move(page, ["d"], 180); expect((await snapshot(page)).playerPosition.x).toBeGreaterThan(0);
  await page.keyboard.press("r"); await page.waitForTimeout(120);
  await move(page, ["w", "d"], 180); const diagonal = await snapshot(page);
  expect(diagonal.playerPosition.x).toBeGreaterThan(0); expect(diagonal.playerPosition.z).toBeGreaterThan(origin.playerPosition.z);
  await page.keyboard.press("r"); await page.waitForTimeout(120);
  await move(page, ["w"], 1800); const atWall = await snapshot(page);
  expect(atWall.playerPosition.z).toBeLessThan(9.5);
  await page.waitForTimeout(260); expect(Math.abs((await snapshot(page)).headBobOffset)).toBeLessThan(.003);
  await move(page, ["d"], 250); expect((await snapshot(page)).playerPosition.x).toBeGreaterThan(atWall.playerPosition.x);
  await page.keyboard.press("r"); await page.waitForTimeout(120);
  await mouseDelta(page, 1571, 0); await page.waitForTimeout(200);
  await move(page, ["w"], 1500); const passage = await snapshot(page);
  expect(passage.playerPosition.z).toBeLessThan(.7);
  await page.keyboard.press("r"); await page.waitForTimeout(150); const reset = await snapshot(page);
  expect(reset.playerPosition.z).toBeCloseTo(7, 1); expect(reset.playerPosition.y).toBeCloseTo(.9, 1); expect(reset.cameraPosition.y).toBeCloseTo(1.58, 1);
  expect(reset.activeGameLoopCount).toBe(1); expect(reset.inputListenerCount).toBe(6);
  await move(page, ["w"], 200); expect((await snapshot(page)).playerPosition.z).toBeGreaterThan(reset.playerPosition.z);
  expect(errors).toEqual([]);
});

test("review URLs retain comparisons and invalid profiles safely select locked", async ({ page }) => {
  const samples: Record<string, { snapshot: Snapshot; moving: number; stopped: number }> = {};
  for (const profile of ["grounded", "responsive", "cinematic", "locked", "invalid"]) {
    await page.goto(`/?review=movement&profile=${profile}`);
    await page.waitForFunction(() => window.__CAVE_GAME_TEST__);
    const initial = await snapshot(page);
    await enter(page);
    await page.keyboard.down("w"); await page.waitForTimeout(170);
    const moving = (await snapshot(page)).planarSpeed;
    await page.keyboard.up("w"); await page.waitForTimeout(250);
    samples[profile] = { snapshot: initial, moving, stopped: (await snapshot(page)).planarSpeed };
    expect(initial.selectedProfile).toBe(profile === "invalid" ? "locked" : profile);
  }
  expect(samples.responsive.snapshot.fov).toBeGreaterThan(samples.locked.snapshot.fov);
  expect(samples.locked.snapshot.fov).toBeGreaterThan(samples.grounded.snapshot.fov);
  expect(samples.grounded.snapshot.fov).toBeGreaterThan(samples.cinematic.snapshot.fov);
  expect(samples.responsive.moving).toBeGreaterThan(samples.locked.moving);
  expect(samples.locked.moving).toBeGreaterThan(samples.grounded.moving);
  expect(samples.responsive.stopped).toBeLessThan(samples.locked.stopped);
  expect(samples.locked.stopped).toBeLessThan(samples.grounded.stopped);
});
