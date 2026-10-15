import assert from "node:assert/strict";
import test from "node:test";
import { filterSchedule, schedule, stageOptions, teamOptions } from "../app/schedule-data.ts";

const filter = overrides => filterSchedule(schedule, { team: "", stage: "", search: "", ...overrides });

test("defaults and clearing conditions preserve all 22 original matches in order", () => {
  assert.equal(schedule.length, 22);
  assert.deepEqual(filter(), schedule);
  assert.deepEqual(filter({ team: "", stage: "", search: "" }), schedule);
  assert.equal(teamOptions.length, 8);
  assert.equal(stageOptions.length, 6);
});

test("中華 matches Taiwan on either side and preserves its original scores", () => {
  const rows = filter({ team: "中華" });
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map(row => [row[2], row[4]]), [
    ["韓國 vs 台灣", "5：3"], ["台灣 vs 巴基斯坦", "27：0"], ["泰國 vs 台灣", "0：18"],
    ["台灣 vs 菲律賓", "10：0"], ["日本 vs 台灣", "7：10"], ["日本 vs 台灣", "0：3"],
  ]);
});

test("combines team, stage, and multiple search terms with AND", () => {
  assert.deepEqual(filter({ team: "日本", stage: "冠軍賽" }), [schedule[21]]);
  assert.deepEqual(filter({ team: "日本", stage: "冠軍賽", search: "中華 08/23" }), [schedule[21]]);
  assert.deepEqual(filter({ team: "日本", stage: "冠軍賽", search: "08/22" }), []);
  assert.deepEqual(filter({ team: "中華", stage: "B 組預賽" }), []);
});

test("search normalizes Taiwan aliases, whitespace, and full-width characters", () => {
  for (const query of ["中華", "中華隊", "台灣", "臺灣隊"]) assert.equal(filter({ search: query }).length, 6);
  assert.equal(filter({ search: "  ０８／２３  " }).length, 2);
  assert.equal(filter({ search: "A 組預賽" }).length, 6);
  assert.equal(filter({ stage: "A 組預賽" }).length, 6);
  assert.equal(filter({ search: "不會有這場比賽" }).length, 0);
  assert.equal(filter({ search: "   " }).length, 22);
});

test("filtering never mutates the source data", () => {
  const original = JSON.stringify(schedule);
  filter({ team: "香港", stage: "排名賽", search: "泰國" });
  assert.equal(JSON.stringify(schedule), original);
});
