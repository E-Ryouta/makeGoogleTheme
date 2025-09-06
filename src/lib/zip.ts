// Minimal ZIP (store only) builder. No compression.
// Supports adding small files as Uint8Array and producing a Blob.

type ZipEntry = {
  name: string;
  data: Uint8Array;
  crc32: number;
};

function crc32Table() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = crc32Table();

function crc32(buf: Uint8Array): number {
  let c = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

function strToUint8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function writeUint32LE(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}
function writeUint16LE(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value & 0xffff, true);
}

export async function createZip(files: { name: string; data: Uint8Array }[]): Promise<Blob> {
  const entries: ZipEntry[] = files.map((f) => ({ name: f.name, data: f.data, crc32: crc32(f.data) }));
  const fileRecords: Uint8Array[] = [];
  const centralRecords: Uint8Array[] = [];

  let offset = 0;
  for (const e of entries) {
    const nameBytes = strToUint8(e.name);
    const localHeader = new ArrayBuffer(30 + nameBytes.length);
    const v = new DataView(localHeader);
    writeUint32LE(v, 0, 0x04034b50); // local file header signature
    writeUint16LE(v, 4, 20); // version needed to extract
    writeUint16LE(v, 6, 0); // general purpose bit flag
    writeUint16LE(v, 8, 0); // compression (0 = store)
    writeUint16LE(v, 10, 0); // last mod time
    writeUint16LE(v, 12, 0); // last mod date
    writeUint32LE(v, 14, e.crc32);
    writeUint32LE(v, 18, e.data.length);
    writeUint32LE(v, 22, e.data.length);
    writeUint16LE(v, 26, nameBytes.length);
    writeUint16LE(v, 28, 0); // extra length
    new Uint8Array(localHeader, 30, nameBytes.length).set(nameBytes);

    fileRecords.push(new Uint8Array(localHeader));
    fileRecords.push(e.data);

    const centralHeader = new ArrayBuffer(46 + nameBytes.length);
    const c = new DataView(centralHeader);
    writeUint32LE(c, 0, 0x02014b50); // central file header signature
    writeUint16LE(c, 4, 20); // version made by
    writeUint16LE(c, 6, 20); // version needed
    writeUint16LE(c, 8, 0); // flags
    writeUint16LE(c, 10, 0); // compression
    writeUint16LE(c, 12, 0); // time
    writeUint16LE(c, 14, 0); // date
    writeUint32LE(c, 16, e.crc32);
    writeUint32LE(c, 20, e.data.length);
    writeUint32LE(c, 24, e.data.length);
    writeUint16LE(c, 28, nameBytes.length);
    writeUint16LE(c, 30, 0); // extra len
    writeUint16LE(c, 32, 0); // comment len
    writeUint16LE(c, 34, 0); // disk number start
    writeUint16LE(c, 36, 0); // internal attrs
    writeUint32LE(c, 38, 0); // external attrs
    writeUint32LE(c, 42, offset); // relative offset of local header
    new Uint8Array(centralHeader, 46, nameBytes.length).set(nameBytes);

    centralRecords.push(new Uint8Array(centralHeader));
    offset += (localHeader.byteLength + e.data.length) >>> 0;
  }

  const centralSize = centralRecords.reduce((s, r) => s + r.byteLength, 0);
  const centralOffset = offset;
  const endRecord = new ArrayBuffer(22);
  const eocd = new DataView(endRecord);
  writeUint32LE(eocd, 0, 0x06054b50); // EOCD signature
  writeUint16LE(eocd, 4, 0); // disk number
  writeUint16LE(eocd, 6, 0); // disk with central directory
  writeUint16LE(eocd, 8, entries.length);
  writeUint16LE(eocd, 10, entries.length);
  writeUint32LE(eocd, 12, centralSize);
  writeUint32LE(eocd, 16, centralOffset);
  writeUint16LE(eocd, 20, 0); // comment length

  const parts: Uint8Array[] = [...fileRecords, ...centralRecords, new Uint8Array(endRecord)];
  const total = parts.reduce((s, p) => s + p.byteLength, 0);
  const out = new Uint8Array(total);
  let ptr = 0;
  for (const p of parts) {
    out.set(p, ptr);
    ptr += p.byteLength;
  }
  return new Blob([out], { type: "application/zip" });
}

