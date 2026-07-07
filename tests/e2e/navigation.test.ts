import assert from "node:assert/strict";
import test from "node:test";
import { navigationGroups } from "../../packages/shared/src/navigation";

test("enterprise sidebar contains required top-level groups", () => {
  assert.equal(navigationGroups.length, 13);
});
