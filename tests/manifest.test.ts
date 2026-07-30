import assert from "node:assert/strict";
import test from "node:test";
import {
  buildManifest,
  isValidChromeVersion,
  validateThemeState,
} from "../src/lib/manifest.ts";
import type { ThemeState } from "../src/types/theme.ts";

const baseState = (): ThemeState => ({
  name: "My Theme",
  version: "1.0",
  images: {},
  colors: {
    frame: [255, 255, 255],
    toolbar: [241, 243, 244],
  },
  properties: {
    ntp_background_alignment: "center",
    ntp_background_repeat: "no-repeat",
  },
});

test("buildManifest creates a minimal valid Chrome theme manifest", () => {
  assert.deepEqual(buildManifest(baseState()), {
    manifest_version: 3,
    name: "My Theme",
    version: "1.0",
    theme: {
      colors: {
        frame: [255, 255, 255],
        toolbar: [241, 243, 244],
      },
      properties: {
        ntp_background_alignment: "center",
        ntp_background_repeat: "no-repeat",
      },
    },
  });
});

test("buildManifest includes only configured image paths", () => {
  const state = baseState();
  state.images.theme_ntp_background = {
    id: "ntp",
    name: "photo.jpg",
    blob: new Blob(),
  };

  assert.deepEqual(buildManifest(state).theme.images, {
    theme_ntp_background: "images/theme_ntp_background.png",
  });
});

test("Chrome version validation follows one-to-four integer components", () => {
  for (const version of ["1", "1.0", "0.1.0.0", "3.1.2.4567", "65535"]) {
    assert.equal(isValidChromeVersion(version), true, version);
  }
  for (const version of ["", "0", "0.0.0.0", "01.2", "1.2.3.4.5", "65536"]) {
    assert.equal(isValidChromeVersion(version), false, version);
  }
});

test("validateThemeState rejects invalid name, version, and colors", () => {
  const state = baseState();
  state.name = " ";
  state.version = "01";
  state.colors.frame = [256, 0, 0];

  assert.deepEqual(validateThemeState(state), [
    "name-required",
    "version-invalid",
    "color-invalid",
  ]);
});
