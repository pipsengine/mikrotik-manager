import assert from "node:assert/strict";
import test from "node:test";
import { executionGuardrail } from "../../packages/shared/src/workflow";

test("execution guardrail requires approval before execute", () => {
  assert.deepEqual(executionGuardrail.slice(0, 6), ["Read", "Analyze", "Backup", "Plan", "Approval", "Execute"]);
});
