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
    console.log('EXIT', state);
    state = s;
    console.log('ENTER', state);
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
      commitEntry(entries, {
        content: whitespace,
        startLine, startCol, endLine, endCol
      });
      startCol = col;
      startLine = line;
      whitespace = "";
      setState(State.Comment);
      comment = "";
    } else if (isEndComment(c, contents[i + 1])) {
      ++i;
      console.log('End comment', comment);
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
    // } else if ((isWhitespace(c)) && (state === State.AfterKey || state === State.AfterValue)) {
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
        console.log('KEY', key);
        setState(State.AfterKey);
      } else if (state === State.AfterKey) {
        // Start of value
        setState(State.Value);
        value = "";
      } else if (state === State.Value) {
        // End of value, commit it
        console.log('VALUE', value);

        setState(State.AfterValue);
      }
    } else if (isSemi(c) && (state === State.AfterValue)) {
      console.log('Semicolon, committing');
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
      key += c;
    } else if (state === State.Value) {
      value += c;
    } else if (isWhitespace(c)) {
      /*
      if (state === State.None || state === State.AfterKey || state === State.AfterValue) {
        setState(State.Whitespace);
        startCol = col;
        startLine = line;
      }
      */
      // Valid to have whitespace before/after lines
      whitespace += c;
    } else if (isSemi(c)) {
      console.log('Semicolon but state is', state);
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
  let line = 1;
  let col = 1;
  for (const entry of entries) {
    lines.push(...generateLines(entry));
    col = entry.endCol;
    line = entry.endLine;
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