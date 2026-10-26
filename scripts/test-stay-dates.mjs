import assert from "node:assert/strict";
import {
  addDays,
  nightsBetween,
  validISO,
  dateError,
  demoAvailable,
  rooms,
} from "../app/stay-data.ts";
const now = "2026-10-26";
assert.equal(addDays("2028-02-28", 1), "2028-02-29");
assert.equal(addDays("2026-12-31", 1), "2027-01-01");
assert.equal(nightsBetween("2026-12-31", "2027-01-02"), 2);
assert.equal(validISO("2026-02-30"), false);
assert.equal(validISO("2028-02-29"), true);
assert.match(dateError("2026-10-25", "2026-10-27", now), /today or later/);
assert.match(dateError("2026-10-28", "2026-10-28", now), /after arrival/);
assert.match(dateError("2026-10-28", "2026-11-28", now), /30 nights/);
assert.match(dateError("2027-10-26", "2027-10-28", now), /12 months/);
assert.equal(dateError("2026-10-28", "2026-10-30", now), "");
assert.equal(demoAvailable("garden", "2026-10-28", "2026-10-28"), false);
for (const room of rooms) {
  assert.ok(room.guests >= 2);
  assert.ok(room.price > 0);
  assert.ok(room.images.length >= 3);
  let available = 0,
    onRequest = 0;
  for (let i = 0; i < 30; i++) {
    const start = addDays(now, i);
    if (demoAvailable(room.id, start, addDays(start, 1))) available++;
    else onRequest++;
  }
  assert.ok(available > 0 && onRequest > 0);
}
console.log(
  "Stay date, boundary, capacity, rate, and demo calendar checks passed.",
);
