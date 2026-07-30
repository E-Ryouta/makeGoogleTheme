import assert from "node:assert/strict";
import test from "node:test";
import {
  assertEditorLayerCapacity,
  assertSafeCanvasSize,
  ImageValidationError,
} from "../src/lib/imageValidation.ts";

test("canvas dimensions are bounded by dimension and pixel limits", () => {
  assert.doesNotThrow(() => assertSafeCanvasSize(6000, 6000));
  assert.throws(
    () => assertSafeCanvasSize(8192, 8192),
    (error) =>
      error instanceof ImageValidationError && error.code === "too-many-pixels",
  );
  assert.throws(
    () => assertSafeCanvasSize(8193, 100),
    (error) =>
      error instanceof ImageValidationError &&
      error.code === "dimensions-too-large",
  );
});

test("background editor enforces the layer limit", () => {
  assert.doesNotThrow(() => assertEditorLayerCapacity(19, 1));
  assert.throws(
    () => assertEditorLayerCapacity(20, 1),
    (error) =>
      error instanceof ImageValidationError && error.code === "too-many-layers",
  );
});
