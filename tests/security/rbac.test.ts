import assert from "node:assert/strict";
import test from "node:test";
import { rolePermissions } from "../../packages/shared/src/permissions";

test("super administrator has full platform access", () => {
  assert.ok(rolePermissions["Super Administrator"].includes("admin.roles.manage"));
  assert.ok(rolePermissions["Super Administrator"].includes("change.execute"));
});
