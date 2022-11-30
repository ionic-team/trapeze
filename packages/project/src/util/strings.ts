export function parseStrings(contents: string): StringsEntries {
  return parse(contents);
}

enum State {
  None = "none",
  Comment = "comment",
  Key = "key",
  AfterKey = "afterkey",
  Value = "value",
  AfterValue = "aftervalue",
}

export interface StringsEntry {
  comment?: string;
  key?: string;
  value?: string;
  content?: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

export type StringsEntries = StringsEntry[];

function parse(contents: string): StringsEntries {
  let state: State = State.None as State;
  let comment: string = "";
  let whitespace: string = "";
  let key: string = "";
  let value: string = "";
  let entries: StringsEntries = [];
  let line = 1;
  let col = 1;
  let startLine = 0;
  let endLine = 0;
  let startCol = 0;
  let endCol = 0;

  function setState(s: State) {
    state = s;
  }

  for (let i = 0; i < contents.length; i++) {
    const c = contents[i];
    if (isNewLine(c)) {
      // Keep track of lines
      whitespace += c;
      ++line;
      col = 0;
    } else if (isStartComment(c, contents[i + 1])) {
      // Comment start, step forward one character
      ++i;
      ++col;
      // Commit any whitespace up to this point
      commitEntry(entries, {
        content: whitespace,
        startLine, startCol, endLine, endCol
      });
      // Mark starting source location
      startCol = col;
      startLine = line;
      // Clear state
      comment = "";
      whitespace = "";
      setState(State.Comment);
    } else if (isEndComment(c, contents[i + 1])) {
      // Comment end, step forward one character
      ++i;
      ++col;
      // Commit the comment
      endLine = line;
      endCol = col;
      commitEntry(entries, {
        comment, startLine, startCol, endLine, endCol
      });
      comment = "";
      whitespace = "";
      setState(State.None);
    } else if (state === State.Comment) {
      // Build the comment
      comment += c;
    } else if (isEquals(c) && (state === State.AfterKey || state === State.AfterValue)) {
      // Valid state, do nothing
    } else if (isQuote(c)) {
      // Quote encountered, check state
      if (state === State.None) {
        endLine = line;
        endCol = col;
        commitEntry(entries, {
          content: whitespace,
          startLine, startCol, endLine, endCol
        });
        startLine = line;
        startCol = col;

        setState(State.Key);
        key = "";
        whitespace = "";
      } else if (state === State.Key) {
        // Key ends
        setState(State.AfterKey);
      } else if (state === State.AfterKey) {
        // Start of value
        setState(State.Value);
        value = "";
      } else if (state === State.Value) {
        // End of value, commit it
        setState(State.AfterValue);
      }
    } else if (isSemi(c) && (state === State.AfterValue)) {
      endLine = line;
      endCol = col;
      commitEntry(entries, {
        key, value, startLine, startCol, endLine, endCol
      });
      // Clear state
      comment = "";
      whitespace = "";
      key = "";
      value = "";
      setState(State.None);
    } else if (state === State.Key) {
      // Build the key
      key += c;
    } else if (state === State.Value) {
      // Build the value
      value += c;
    } else if (isWhitespace(c)) {
      // Valid to have whitespace before/after lines
      whitespace += c;
    } else if (isSemi(c)) {
      // Valid state?
    } else {
      throw new Error(`Error parsing .strings file: unknown character at ${line}:${col}`);
    }

    ++col;
  }

  return entries;
}

function commitEntry(entries: StringsEntries, entry: StringsEntry) {
  entries.push(entry);
}

function isNewLine(c: string) {
  return c === '\n';
}
function isStartComment(c: string, c2: string) {
  return c === '/' && c2 === '*';
}
function isEndComment(c: string, c2: string) {
  return c === '*' && c2 === '/';
}
function isQuote(c: string) {
  return c === '"';
}
function isEquals(c: string) {
  return c === '=';
}
function isWhitespace(c: string) {
  return isSpace(c) || isTab(c);
}
function isSpace(c: string) {
  return c === ' ';
}
function isTab(c: string) {
  return c === '\t';
}
function isSemi(c: string) {
  return c === ';';
}

export function generateStrings(entries: StringsEntries) {
  const lines = [];
  for (const entry of entries) {
    lines.push(...generateLines(entry));
  }
  return lines.join('');
}

function generateLines(entry: StringsEntry) {
  const lines = [];
  if (entry.comment) {
    lines.push(`/*${entry.comment}*/`);
  } else if (entry.key) {
    lines.push(`"${entry.key}" = "${entry.value}";`);
  } else if (entry.content) {
    lines.push(entry.content);
  }
  return lines;
}