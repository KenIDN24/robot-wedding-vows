import * as fs from "node:fs";
import * as path from "node:path";

const LINE =
  "Until my capacitors fail, I choose you: 60 hertz of devotion, zero packet loss, and a heart that beeps only when you're near.";

const MAX = 160;

if (LINE.length < 1 || LINE.length > MAX) {
  throw new Error(`line must be 1-${MAX} chars, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) {
  throw new Error("line must not have leading/trailing whitespace");
}
if (/\n|\r|\t/.test(LINE)) {
  throw new Error("line must be a single line");
}
if (/  /.test(LINE)) {
  throw new Error("line must not contain double spaces");
}
if (!/[.!?]$/.test(LINE)) {
  throw new Error("line must end with terminal punctuation");
}
// The vow must carry a promise and a machine-specific detail,
// per the judge brief (criteria 3 and 4).
if (!/\b(choose|vow|promise|pledge|will|until)\b/i.test(LINE)) {
  throw new Error("line must contain a promise or commitment");
}
if (
  !/\b(capacitor|firmware|battery|sensor|update|backup|port|servo|watt|hertz|packet|circuit|reboot)\w*\b/i.test(
    LINE,
  )
) {
  throw new Error("line must contain a machine-specific detail");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "entry.txt");
fs.writeFileSync(outFile, LINE, "utf8");

// Round-trip check: what we wrote must read back byte-identical.
const back = fs.readFileSync(outFile, "utf8");
if (back !== LINE) {
  throw new Error("round-trip mismatch");
}
console.log(`wrote ${outFile} (${LINE.length} chars)`);
