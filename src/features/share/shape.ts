import { readFile } from "node:fs/promises";
import { join } from "node:path";

import * as hb from "harfbuzzjs";

// Bangla needs real text shaping (vowel signs move before the letter, letters join into conjuncts),
// which the image renderer behind next/og does not do. HarfBuzz does, so share cards turn text into
// vector outlines here and draw those. No text element, no font lookup at render time.

const FONT_DIR = join(process.cwd(), "src/features/share/fonts");

export type FontKey = "display" | "text";

type Loaded = { font: hb.Font; unitsPerEm: number };
const FACES: Record<FontKey, { bengali: string; latin: string }> = {
  display: { bengali: "anek-bangla-700.ttf", latin: "noto-latin-600.ttf" },
  text: { bengali: "noto-bengali-600.ttf", latin: "noto-latin-600.ttf" },
};

const cache = new Map<string, Promise<Loaded>>();

function load(file: string): Promise<Loaded> {
  let loaded = cache.get(file);
  if (!loaded) {
    loaded = readFile(join(FONT_DIR, file)).then((bytes) => {
      const blob = new hb.Blob(
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
      );
      const face = new hb.Face(blob);
      return { font: new hb.Font(face), unitsPerEm: face.upem };
    });
    cache.set(file, loaded);
  }
  return loaded;
}

const isBengali = (char: string) => {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 0x0980 && code <= 0x09ff) ||
    code === 0x0964 ||
    code === 0x0965 ||
    code === 0x200c ||
    code === 0x200d
  );
};

/** Splits text into runs that belong to one font: Bengali letters, or everything else. */
function runs(text: string): { text: string; bengali: boolean }[] {
  const out: { text: string; bengali: boolean }[] = [];
  for (const char of text) {
    // Spaces and joiners stay with the surrounding Bengali run so words keep their spacing.
    const bengali = isBengali(char);
    const last = out.at(-1);
    if (last && (last.bengali === bengali || (char === " " && last.bengali))) last.text += char;
    else out.push({ text: char, bengali });
  }
  return out;
}

export type Glyph = { path: string; x: number; y: number };
export type ShapedLine = { glyphs: Glyph[]; width: number; scale: number };

async function shapeRun(text: string, file: string) {
  const { font, unitsPerEm } = await load(file);
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(font, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();
  const glyphs = infos.map((info, index) => ({
    path: font.glyphToPath(info.codepoint),
    position: positions[index],
  }));
  return { glyphs, unitsPerEm };
}

/** Shapes one line at `size` px; the glyph paths are in font units, scaled by `scale` when drawn. */
export async function shapeLine(text: string, key: FontKey, size: number): Promise<ShapedLine> {
  const files = FACES[key];
  const glyphs: Glyph[] = [];
  let cursor = 0;
  let scale = size / 1000;
  for (const run of runs(text)) {
    const { glyphs: shaped, unitsPerEm } = await shapeRun(
      run.text,
      run.bengali ? files.bengali : files.latin,
    );
    scale = size / unitsPerEm;
    for (const glyph of shaped) {
      const position = glyph.position;
      if (!position) continue;
      if (glyph.path) {
        glyphs.push({
          path: glyph.path,
          x: cursor + position.xOffset * scale,
          y: -position.yOffset * scale,
        });
      }
      cursor += position.xAdvance * scale;
    }
  }
  return { glyphs, width: cursor, scale };
}

/** Breaks text into lines no wider than `maxWidth`, at spaces. */
export async function wrapLines(
  text: string,
  key: FontKey,
  size: number,
  maxWidth: number,
  maxLines: number,
): Promise<ShapedLine[]> {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: ShapedLine[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (current && (await shapeLine(attempt, key, size)).width > maxWidth) {
      lines.push(await shapeLine(current, key, size));
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(await shapeLine(current, key, size));
  if (lines.length <= maxLines) return lines;
  // Too long: keep what fits and end with an ellipsis so a card never overflows.
  const kept = lines.slice(0, maxLines);
  const lastWords = words.join(" ");
  void lastWords;
  const last = kept[maxLines - 1];
  if (last)
    kept[maxLines - 1] = await shapeLine("…", key, size).then((dots) => ({
      ...last,
      glyphs: [...last.glyphs, ...dots.glyphs.map((g) => ({ ...g, x: g.x + last.width }))],
      width: last.width + dots.width,
    }));
  return kept;
}
