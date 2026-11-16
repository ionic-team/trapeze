export interface PropertiesEntry {
  source: string;
  key: string;
  value: string;
}

/**
 * A logical line of a Java `.properties` file as `java.util.Properties.load`
 * reads it. `source` holds the original text, including any continuation lines
 * and the line ending, so lines that are not changed are written back as is.
 * Comments and blank lines only have a `source`.
 */
export type PropertiesLine = PropertiesEntry | { source: string };

const NATURAL_LINE = /[^\r\n]*(?:\r\n|\r|\n)|[^\r\n]+$/g;
const LINE_ENDING_AT_END = /(?:\r\n|\r|\n)$/;
const CONTINUATION = /\\(?:\r\n|\r|\n)[ \t\f]*/g;
const LEADING_WHITESPACE = /^[ \t\f]+/;
// Like Java, a comment may follow empty continuation lines
const COMMENT = /^(?:[ \t\f]*\\(?:\r\n|\r|\n))*[ \t\f]*[#!]/;
const KEY = /^(?:\\[\s\S]|[^\\=: \t\f])*/;
const SEPARATOR = /^[ \t\f]*[=:]?[ \t\f]*/;
const ESCAPE_SEQUENCE = /\\(?:u([0-9a-fA-F]{4})|([\s\S]?))/g;

// Characters that would otherwise end the key, start a comment or read as an escape
const KEY_SPECIAL_CHARACTERS = /[\\=: \t\f\r\n]|^[#!]/g;
// Characters that would otherwise read as an escape, end the line or be skipped as leading whitespace
const VALUE_SPECIAL_CHARACTERS = /[\\\r\n]|^[ \t\f]/g;

const UNESCAPED_CHARACTERS: Record<string, string> = { t: '\t', n: '\n', r: '\r', f: '\f' };
const ESCAPED_CHARACTERS: Record<string, string> = { '\t': '\\t', '\n': '\\n', '\r': '\\r', '\f': '\\f' };

export function parseProperties(contents: string): PropertiesLine[] {
  return splitLogicalLines(contents).map(parseLine);
}

export function generateProperties(lines: PropertiesLine[]): string {
  return lines.map(line => line.source).join('');
}

/**
 * The key/value pairs as Java reads them. A later entry wins over an earlier one with the same key.
 */
export function toPropertiesObject(lines: PropertiesLine[]): Record<string, string> {
  const entries = lines.filter(isPropertiesEntry);

  return Object.fromEntries(entries.map(entry => [entry.key, entry.value]));
}

/**
 * Updates every entry with the given key, or appends a new entry if there is none.
 */
export function setProperty(lines: PropertiesLine[], { key, value }: { key: string; value: string }): PropertiesLine[] {
  const isEntryForKey = (line: PropertiesLine): line is PropertiesEntry => isPropertiesEntry(line) && line.key === key;

  if (!lines.some(isEntryForKey)) {
    return appendProperty(lines, { key, value });
  }

  return lines.map(line =>
    isEntryForKey(line) && line.value !== value
      ? createEntry({ key, value, lineEnding: lineEndingOf(line.source) })
      : line
  );
}

function isPropertiesEntry(line: PropertiesLine): line is PropertiesEntry {
  return 'key' in line;
}

function appendProperty(lines: PropertiesLine[], { key, value }: { key: string; value: string }): PropertiesLine[] {
  const lineEnding = detectLineEnding(lines);

  return [...closeLastLine(lines, { lineEnding }), createEntry({ key, value, lineEnding })];
}

function createEntry({ key, value, lineEnding }: { key: string; value: string; lineEnding: string }): PropertiesEntry {
  return { key, value, source: `${escapeKey(key)}=${escapeValue(value)}${lineEnding}` };
}

function closeLastLine(lines: PropertiesLine[], { lineEnding }: { lineEnding: string }): PropertiesLine[] {
  const lastLine = lines[lines.length - 1];

  if (!lastLine) {
    return lines;
  }

  const missingLineEnding = lineEndingOf(lastLine.source) ? '' : lineEnding;
  // Only a blank line ends a continuation that would otherwise take in the next entry
  const blankLine = isContinued(lastLine.source) ? lineEnding : '';

  return [...lines.slice(0, -1), { ...lastLine, source: lastLine.source + missingLineEnding + blankLine }];
}

function detectLineEnding(lines: PropertiesLine[]) {
  return lines.map(line => lineEndingOf(line.source)).find(lineEnding => lineEnding) ?? '\n';
}

function lineEndingOf(source: string) {
  return source.match(LINE_ENDING_AT_END)?.[0] ?? '';
}

function splitLogicalLines(contents: string): string[] {
  const logicalLines: string[] = [];
  let logicalLine = '';

  for (const naturalLine of contents.match(NATURAL_LINE) ?? []) {
    logicalLine += naturalLine;

    if (!isContinued(logicalLine)) {
      logicalLines.push(logicalLine);
      logicalLine = '';
    }
  }

  // The file ends in the middle of a continued line
  if (logicalLine) {
    logicalLines.push(logicalLine);
  }

  return logicalLines;
}

function isContinued(logicalLine: string) {
  // A comment line never continues on the next line
  if (COMMENT.test(logicalLine)) {
    return false;
  }

  const trailingBackslashes = logicalLine.replace(LINE_ENDING_AT_END, '').match(/\\*$/)?.[0] ?? '';

  // An even number of backslashes is a run of escaped backslashes
  return trailingBackslashes.length % 2 === 1;
}

function parseLine(source: string): PropertiesLine {
  if (COMMENT.test(source)) {
    return { source };
  }

  const text = source
    .replace(LINE_ENDING_AT_END, '')
    .replace(CONTINUATION, '')
    .replace(LEADING_WHITESPACE, '');

  if (!text) {
    return { source };
  }

  const rawKey = text.match(KEY)?.[0] ?? '';
  const rawValue = text.slice(rawKey.length).replace(SEPARATOR, '');

  return { source, key: unescapeText(rawKey), value: unescapeText(rawValue) };
}

function unescapeText(text: string) {
  return text.replace(ESCAPE_SEQUENCE, (_, hexCode: string | undefined, character: string) =>
    hexCode ? String.fromCharCode(parseInt(hexCode, 16)) : UNESCAPED_CHARACTERS[character] ?? character
  );
}

function escapeKey(key: string) {
  return key.replace(KEY_SPECIAL_CHARACTERS, escapeCharacter);
}

function escapeValue(value: string) {
  return value.replace(VALUE_SPECIAL_CHARACTERS, escapeCharacter);
}

function escapeCharacter(character: string) {
  return ESCAPED_CHARACTERS[character] ?? `\\${character}`;
}
