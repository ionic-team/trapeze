export function parseStrings(contents: string): StringsEntries {
  return parse(contents);
}

enum State {
  None = "none",
  Comment = "comment",
  LineComment = "linecomment",
  Key = "key",
  AfterKey = "afterkey",
  Value = "value",
  AfterValue = "aftervalue",
}

export interface StringsEntry {
  comment?: string;
  lineComment?: string;
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

  function startComment(commentState: State) {
    commitEntry(entries, {
      content: whitespace,
      startLine, startCol, endLine, endCol
    });
    startCol = col;
    startLine = line;
    comment = "";
    whitespace = "";
    setState(commentState);
  }

  function commitLineComment() {
    endLine = line;
    endCol = col;
    commitEntry(entries, {
      lineComment: comment, startLine, startCol, endLine, endCol
    });
    comment = "";
  }

  for (let i = 0; i < contents.length; i++) {
    const c = contents[i];
    if (state === State.Key || state === State.Value) {
      // Inside a quoted string only an unescaped quote has meaning
      if (isQuote(c)) {
        setState(state === State.Key ? State.AfterKey : State.AfterValue);
      } else {
        let text = c;
        if (isEscape(c) && i + 1 < contents.length) {
          // Keep escape sequences such as \" verbatim
          text += contents[++i];
          ++col;
        }
        if (state === State.Key) {
          key += text;
        } else {
          value += text;
        }
      }
    } else if (state === State.LineComment) {
      if (isNewLine(c) || isCarriageReturn(c)) {
        commitLineComment();
        whitespace = c;
        setState(State.None);
      } else {
        comment += c;
      }
    } else if (isStartComment(c, contents[i + 1])) {
      // Comment start, step forward one character
      ++i;
      startComment(State.Comment);
    } else if (isStartLineComment(c, contents[i + 1]) && state === State.None) {
      // Line comment start, step forward one character
      ++i;
      startComment(State.LineComment);
    } else if (isEndComment(c, contents[i + 1])) {
      // Comment end, step forward one character
      ++i;
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
    } else if (isNewLine(c)) {
      whitespace += c;
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
      } else if (state === State.AfterKey) {
        // Start of value
        setState(State.Value);
        value = "";
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
    } else if (isWhitespace(c)) {
      // Valid to have whitespace before/after lines
      whitespace += c;
    } else if (isSemi(c)) {
      // Valid state?
    } else {
      throw new Error(`Error parsing .strings file: unknown character at ${line}:${col}`);
    }

    // Keep track of lines
    if (isNewLine(c)) {
      ++line;
      col = 0;
    }
    ++col;
  }

  // Keep what follows the last entry, such as the final line break
  if (state === State.LineComment) {
    commitLineComment();
  } else if (state === State.None && whitespace) {
    commitEntry(entries, {
      content: whitespace, startLine, startCol, endLine: line, endCol: col
    });
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
function isStartLineComment(c: string, c2: string) {
  return c === '/' && c2 === '/';
}
function isEndComment(c: string, c2: string) {
  return c === '*' && c2 === '/';
}
function isQuote(c: string) {
  return c === '"';
}
function isEscape(c: string) {
  return c === '\\';
}
function isEquals(c: string) {
  return c === '=';
}
function isWhitespace(c: string) {
  return isSpace(c) || isTab(c) || isCarriageReturn(c);
}
function isCarriageReturn(c: string) {
  return c === '\r';
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

const ESCAPED_LINE_BREAKS: Record<string, string> = { '\n': '\\n', '\r': '\\r' };

export function escapeStringsText(text: string) {
  return text.replace(/[\\"\n\r]/g, character => ESCAPED_LINE_BREAKS[character] ?? `\\${character}`);
}

export function generateStrings(entries: StringsEntries) {
  const lines = [];
  for (const entry of entries) {
    lines.push(...generateLines(entry));
  }
  return lines.join('');
}

/**
 * Updates every entry with the given key, or appends a new entry if there is none.
 * The key and value are escaped source text.
 */
export function setStringsEntry(entries: StringsEntries, { key, value }: { key: string; value: string }): StringsEntries {
  if (!entries.some(entry => entry.key === key)) {
    return appendStringsEntry(entries, { key, value });
  }

  return entries.map(entry => entry.key === key ? { ...entry, value } : entry);
}

function appendStringsEntry(entries: StringsEntries, { key, value }: { key: string; value: string }): StringsEntries {
  const lineEnding = detectLineEnding(entries);
  const lastEntry = entries[entries.length - 1];
  // New entries go before the whitespace at the end of the file, so the file keeps its final line break
  const trailingWhitespace = lastEntry?.content !== undefined ? [lastEntry] : [];
  const body = entries.slice(0, entries.length - trailingWhitespace.length);
  const previousEntry = body[body.length - 1];
  const separator: StringsEntries = previousEntry
    ? [{ content: lineEnding.repeat(2), startLine: previousEntry.endLine + 1, startCol: 0, endLine: previousEntry.endLine + 2, endCol: 0 }]
    : [];
  const entry: StringsEntry = {
    key,
    value,
    startLine: previousEntry ? previousEntry.endLine + 3 : 0,
    startCol: 0,
    endLine: previousEntry ? previousEntry.endLine + 4 : 0,
    endCol: 0,
  };

  return [...body, ...separator, entry, ...trailingWhitespace];
}

function detectLineEnding(entries: StringsEntries) {
  return entries.map(entry => entry.content?.match(/\r\n|\n/)?.[0]).find(lineEnding => lineEnding) ?? '\n';
}

function generateLines(entry: StringsEntry) {
  const lines = [];
  if (entry.comment !== undefined) {
    lines.push(`/*${entry.comment}*/`);
  } else if (entry.lineComment !== undefined) {
    lines.push(`//${entry.lineComment}`);
  } else if (entry.key !== undefined) {
    lines.push(`"${entry.key}" = "${entry.value}";`);
  } else if (entry.content) {
    lines.push(entry.content);
  }
  return lines;
}