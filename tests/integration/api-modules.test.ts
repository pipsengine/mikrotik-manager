import assert from "node:assert/strict";
import test from "node:test";
import { navigationItems } from "../../packages/shared/src/navigation";

test("every navigation item declares route, permission, breadcrumb and keywords", () => {
  for (const item of navigationItems) {
    assert.ok(item.route.startsWith("/"));
    assert.ok(item.permission);
    assert.ok(item.breadcrumb.length >= 2);
    assert.ok(item.keywords.length >= 1);
  }
});
