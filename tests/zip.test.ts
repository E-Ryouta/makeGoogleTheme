import assert from "node:assert/strict";
import test from "node:test";
import { createZip } from "../src/lib/zip.ts";

function localEntryNames(bytes: Uint8Array): string[] {
  const names: string[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;

  while (
    offset + 4 <= bytes.length &&
    view.getUint32(offset, true) === 0x04034b50
  ) {
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    names.push(
      new TextDecoder().decode(
        bytes.slice(offset + 30, offset + 30 + nameLength),
      ),
    );
    offset += 30 + nameLength + extraLength + size;
  }
  return names;
}

test("createZip stores manifest and deterministic image paths", async () => {
  const zip = await createZip([
    {
      name: "manifest.json",
      data: new TextEncoder().encode('{"manifest_version":3}'),
    },
    {
      name: "images/theme_ntp_background.png",
      data: new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
    },
  ]);

  assert.equal(zip.type, "application/zip");
  assert.deepEqual(localEntryNames(new Uint8Array(await zip.arrayBuffer())), [
    "manifest.json",
    "images/theme_ntp_background.png",
  ]);
});
