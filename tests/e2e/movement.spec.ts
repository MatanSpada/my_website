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
  await page.goto("/?review=unsupported&profile=invalid"); await expect(page.locator("#game-canvas")).toBeVisible();
  expect(await page.evaluate(() => window.__CAVE_GAME_TEST__)).toBeUndefined();
  await page.goto("/?review=door-interaction"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().world === "cave-entrance");
});

test("first playable completes the exterior-to-hall journey and returns cleanly", async ({ page }) => {
  // SwiftShader screenshots are intentionally serial and can take longer than the real game-time route.
  test.setTimeout(90000);
  const errors: string[] = []; const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:")) external.push(request.url()); });
  await page.goto("/?review=cave-entrance"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__);
  const initial = await snapshot(page);
  expect(initial.world).toBe("cave-entrance"); expect(initial.selectedProfile).toBe("locked");
  expect(initial.spawnPosition).toEqual({ x: 0, y: .9, z: 9 }); expect(initial.doorState).toBe("CLOSED"); expect(initial.doorCollisionEnabled).toBe(true);
  await page.screenshot({ path: "docs/review/cave-003-spawn.png" }); await page.screenshot({ path: "docs/review/cave-007-entry.png" }); await enter(page); await page.keyboard.press("r"); await page.waitForTimeout(450);
  await page.screenshot({ path: "docs/review/cave-006-exterior.png" }); await page.screenshot({ path: "docs/review/cave-007-exterior.png" });
  await move(page, ["w"], 1100); await page.screenshot({ path: "docs/review/cave-003-approach.png" }); await page.screenshot({ path: "docs/review/cave-006-entrance.png" });
  const approach = await snapshot(page); expect(approach.distanceToDoor, JSON.stringify({ initial, approach })).toBeLessThan(initial.distanceToDoor);
  await move(page, ["w"], 3500); const door = await snapshot(page); await page.screenshot({ path: "docs/review/cave-003-main-door.png" }); await page.screenshot({ path: "docs/review/cave-007-main-door.png" });
  expect(door.playerPosition.z).toBeGreaterThan(-4.9); expect(door.distanceToDoor, JSON.stringify(door)).toBeLessThan(2.2); expect(door.doorState).toBe("CLOSED");
  expect(door.interactionAvailable).toBe(true); await page.screenshot({ path: "docs/review/cave-004-interaction-prompt.png" });
  await page.keyboard.press("Enter"); await page.waitForTimeout(180); const afterEnter = await snapshot(page); await page.screenshot({ path: "docs/review/cave-004-opening.png" });
  expect(afterEnter.doorState).toBe("OPENING"); await page.keyboard.press("Enter"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().doorState === "OPEN", undefined, { timeout: 8000 }); const opened=await snapshot(page); await page.screenshot({ path:"docs/review/cave-004-open-door.png" }); expect(opened.doorState).toBe("OPEN"); expect(opened.doorwayTraversable).toBe(true);
  await move(page,["w"],700); await page.screenshot({path:"docs/review/cave-004-threshold.png"}); await page.screenshot({path:"docs/review/cave-005-threshold.png"});
  await move(page,["w"],2500); await page.screenshot({path:"docs/review/cave-005-corridor.png"}); await page.screenshot({path:"docs/review/cave-006-corridor.png"}); await page.screenshot({path:"docs/review/cave-007-corridor.png"});
  await move(page,["w"],4000); const hall = await snapshot(page); expect(hall.zone).toBe("specialization-hall"); expect(hall.specializationDoorStates.map(door => door.label)).toEqual(["RUNTIME THREAT DETECTION", "LINUX KERNEL & eBPF", "EMBEDDED & IoT SYSTEMS", "OTA & DEVICE FLEETS", "SENSOR DATA PIPELINES"]); expect(hall.specializationDoorStates.every(door => door.state === "CLOSED" && door.collisionEnabled)).toBe(true); expect(hall.interactionAvailable).toBe(false); await page.keyboard.press("Enter"); expect((await snapshot(page)).doorState).toBe("OPEN"); await mouseDelta(page, 0, -260); await page.screenshot({path:"docs/review/cave-005-hall-entry.png"}); await page.screenshot({path:"docs/review/cave-005-specialization-hall.png"}); await page.screenshot({path:"docs/review/cave-006-hall-entry.png"}); await page.screenshot({path:"docs/review/cave-006-specialization-hall.png"}); await page.screenshot({path:"docs/review/cave-006-door-detail.png"}); await page.screenshot({path:"docs/review/cave-007-hall.png"}); await mouseDelta(page, 650, 120); await page.screenshot({path:"docs/review/cave-006-wide-hall.png"}); await page.screenshot({path:"docs/review/cave-007-specialization-doors.png"});
  for(const name of ["runtime-door","kernel-door","embedded-door","ota-door","sensor-door"]) await page.screenshot({path:`docs/review/cave-005-${name}.png`});
  await page.keyboard.press("r"); await page.waitForTimeout(180); await page.screenshot({path:"docs/review/cave-004-reset-closed.png"}); await page.screenshot({path:"docs/review/cave-007-reset.png"}); await move(page, ["s"], 850); await page.screenshot({ path: "docs/review/cave-003-wide-entrance.png" });
  const wide = await snapshot(page); expect(wide.playerPosition.z).toBeGreaterThanOrEqual(initial.playerPosition.z); expect(wide.activeGameLoopCount).toBe(1); expect(wide.inputListenerCount).toBe(6);
  expect(errors).toEqual([]); expect(external).toEqual([]);
});

test("entry gate and Pointer Lock recovery prevent unintended movement", async ({ page }) => {
  await page.goto("/?review=cave-entrance"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__);
  const initial = await snapshot(page); await move(page, ["w"], 300);
  expect((await snapshot(page)).playerPosition).toEqual(initial.playerPosition);
  await enter(page); await page.waitForTimeout(120); await page.keyboard.down("w"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().activeInputs.forward); await page.waitForTimeout(700); await page.keyboard.up("w"); const moving = await snapshot(page);
  expect(moving.playerPosition.z).toBeLessThan(initial.playerPosition.z);
  await page.evaluate(() => document.exitPointerLock()); await page.waitForFunction(() => !window.__CAVE_GAME_TEST__?.getSnapshot().pointerLock);
  expect((await snapshot(page)).activeInputs).toEqual({ forward:false, backward:false, left:false, right:false });
  await page.waitForTimeout(180); const released = await snapshot(page); await move(page, ["w"], 250); const inactive = await snapshot(page); expect(Math.abs(inactive.playerPosition.x-released.playerPosition.x)).toBeLessThan(.03); expect(Math.abs(inactive.playerPosition.z-released.playerPosition.z)).toBeLessThan(.03);
  await enter(page); expect((await snapshot(page)).pointerLock).toBe(true);
});

test("repeated door opening and reset do not grow world lifecycle state", async ({ page }) => {
  test.setTimeout(90000); await page.goto("/?review=cave-entrance"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__); await enter(page);
  const baseline = await snapshot(page);
  for (let cycle = 0; cycle < 2; cycle++) {
    await page.keyboard.press("r"); await move(page, ["w"], 4600); expect((await snapshot(page)).interactionAvailable).toBe(true);
    await page.keyboard.press("Enter"); await page.waitForFunction(() => window.__CAVE_GAME_TEST__?.getSnapshot().doorState === "OPEN", undefined, { timeout: 8000 });
    await page.keyboard.press("r"); await page.waitForTimeout(180); const reset = await snapshot(page);
    expect(reset.doorState).toBe("CLOSED"); expect(reset.doorCollisionEnabled).toBe(true); expect(reset.activeDoorAnimationCount).toBe(0);
    expect(reset.activeMeshes).toBe(baseline.activeMeshes); expect(reset.physicsBodyCount).toBe(baseline.physicsBodyCount); expect(reset.activeGameLoopCount).toBe(1); expect(reset.inputListenerCount).toBe(6);
  }
});

test("Linux Kernel and eBPF room opens through its real hall door and returns", async ({ page }) => {
  test.setTimeout(60000); const errors:string[]=[]; const external:string[]=[]; page.on("pageerror",error=>errors.push(error.message)); page.on("request",request=>{if(!request.url().startsWith("http://127.0.0.1:"))external.push(request.url());});
  await page.goto("/?review=linux-ebpf-room"); await page.waitForFunction(()=>window.__CAVE_GAME_TEST__); await enter(page); await page.keyboard.press("r"); await page.waitForTimeout(160);
  await move(page,["w"],700); const before=await snapshot(page);
  expect(before.linuxDoorState).toBe("CLOSED"); expect(before.linuxDoorDistance).toBeLessThan(3.1); expect(before.interactionAvailable).toBe(true); await page.screenshot({path:"docs/review/cave-008-door-prompt.png"});
  await page.keyboard.press("Enter"); await page.waitForFunction(()=>window.__CAVE_GAME_TEST__?.getSnapshot().linuxDoorState==="OPEN",undefined,{timeout:8000}); await page.screenshot({path:"docs/review/cave-008-door-open.png"});
  await move(page,["w"],950); const room=await snapshot(page); expect(room.linuxEbpfRoomEntered).toBe(true); expect(room.exhibitCount).toBe(3); expect(room.nearestExhibitId).not.toBeNull(); await page.screenshot({path:"docs/review/cave-008-room-entry.png"}); await page.screenshot({path:"docs/review/cave-008-linux-ebpf-room.png"}); await mouseDelta(page,-800,0); await page.waitForTimeout(350); await page.screenshot({path:"docs/review/cave-008-ebpf-exhibit.png"}); await mouseDelta(page,1600,0); await page.waitForTimeout(350); await page.screenshot({path:"docs/review/cave-008-kernel-exhibit.png"}); await mouseDelta(page,-800,0); await page.waitForTimeout(350);
  await page.keyboard.down("s"); await page.waitForFunction(()=>window.__CAVE_GAME_TEST__?.getSnapshot().zone==="specialization-hall"); await page.keyboard.up("s"); const returned=await snapshot(page); expect(returned.zone).toBe("specialization-hall"); await page.screenshot({path:"docs/review/cave-008-return-to-hall.png"}); await page.keyboard.press("r"); const reset=await snapshot(page); expect(reset.linuxDoorState).toBe("CLOSED"); expect(reset.activeGameLoopCount).toBe(1); expect(reset.inputListenerCount).toBe(6); console.info("CAVE-008 lifecycle", JSON.stringify({meshes:reset.activeMeshes,bodies:reset.physicsBodyCount,loops:reset.activeGameLoopCount,listeners:reset.inputListenerCount,animations:reset.activeDoorAnimationCount})); expect(errors).toEqual([]); expect(external).toEqual([]);
});

test("cave review routes retain one lifecycle and report stable scene telemetry", async ({ page }) => {
  const samples: Record<string, Awaited<ReturnType<typeof snapshot>>> = {};
  for (const route of ["cave-entrance", "cave-interior", "specialization-hall"]) {
    await page.goto(`/?review=${route}`); await page.waitForFunction(() => window.__CAVE_GAME_TEST__); await enter(page);
    await page.waitForTimeout(600); samples[route] = await snapshot(page);
    expect(samples[route].activeGameLoopCount).toBe(1); expect(samples[route].inputListenerCount).toBe(6);
  }
  await page.keyboard.press("r"); await page.waitForTimeout(160); const afterReset = await snapshot(page);
  expect(afterReset.activeMeshes).toBe(samples["specialization-hall"].activeMeshes);
  expect(afterReset.physicsBodyCount).toBe(samples["specialization-hall"].physicsBodyCount);
  console.info("CAVE-006 performance", JSON.stringify(Object.fromEntries(Object.entries(samples).map(([route, value]) => [route, { frameTime: value.frameTimeSummary, drawCalls: value.drawCalls, meshes: value.activeMeshes, bodies: value.physicsBodyCount, loops: value.activeGameLoopCount, listeners: value.inputListenerCount }]))));
});
