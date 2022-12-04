export function parseXCConfig(contents: string): XCConfigEntries {
  return parse(contents);
}

enum State {
  None = "none",
  Comment = "comment",
  Include = "include",
  IncludeValue = "includevalue",
  Key = "key",
  AfterKey = "afterkey",
  Value = "value",
  AfterValue = "aftervalue",
}

export interface XCConfigEntry {
  comment?: string;
  include?: string;
  key?: string;
  value?: string;
  content?: string;
}

export type XCConfigEntries = XCConfigEntry[];

function parse(contents: string): XCConfigEntries {
  let state: State = State.None as State;
  let c: string = "";
  let include = "";
  let comment = "";
  let whitespace = "";
  let key = "";
  let value = "";
  let entries: XCConfigEntries = [];
  let line = 1;
  let col = 1;

  function printContext() {
    console.log(`
    Key: ${key}
    Value: ${value}
    Comment: ${comment}
    Whitespace: ${whitespace?.replace(' ', '_').replace('\n', 'N')}
    Include: ${include}
    `);
  }
  function setState(s: State) {
    if (state !== s) {
      console.log(state, '->', s, `(${c})`);
      // console.trace();
      // printContext();
    }
    state = s;
  }
  function clearState() {
    whitespace = "";
    key = "";
    value = "";
    comment = "";
    include = "";
}


  function commit(entry: XCConfigEntry) {
    console.log('COMMIT', entry);
    // printContext();
    // console.trace();
    entries.push(entry);
  }

  for (let i = 0; i < contents.length; i++) {
    c = contents[i];

    if (isNewLine(c)) {
      // Keep track of lines
      whitespace += c;

      console.log('NEWLINE, comitting');
      if (state === State.Comment) {
        commit({
          comment,
        });
      } else if (state === State.Value) {
        // xcconfigs are newline-delimited so ends-of-lines commit values
        commit({
          key,
          value,
        });
      } 

      commit({
        content: '\n',
      });

      ++line;
      col = 0;
      // Everything is single-line, so newlines terminate
      clearState();
      setState(State.None);
    }
    
    else if (isStartComment(c, contents[i + 1])) {
      // Comment start, step forward one character
      ++i;

      // Commit any whitespace up to this point
      if (state === State.Value) {
        // Handle comments after values
        commit({
          key,
          value: value.trimEnd()
        });
      }

      if (whitespace.length) {
        commit({
          content: whitespace,
        });
      }

      clearState();
      setState(State.Comment);
    }
    
    else if (state === State.Comment) {
      // Build the comment
      comment += c;
    }

    else if (isEquals(c) && (state === State.AfterKey || state === State.AfterValue)) {
      // Valid state, do nothing
    }
    
    else if (isQuote(c)) {
      // Quote encountered, check state
      if (state === State.None) {
        commit({
          content: whitespace,
        });
        setState(State.Key);
        clearState();
      } 
      else if (state === State.IncludeValue) {
        commit({
          include,
        });
        setState(State.None);
        clearState();
      }
      else if (state === State.Include) {
        setState(State.IncludeValue);
      }
      else if (state === State.Key) {
        // Key ends
        setState(State.AfterKey);
      }
      else if (state === State.AfterKey) {
        // Start of value
        setState(State.Value);
        value = "";
      }
      else if (state === State.Value) {
        // End of value, commit it
        setState(State.AfterValue);
      }
    }

    else if (isInclude(contents, i) && state !== State.Include) {
      // Start of include statement
      i += 7;
      col += 7;
      setState(State.Include);
    }

    else if (state === State.IncludeValue) {
      include += c;
    }
    
    else if (isKey(c) && state !== State.Value && state !== State.AfterKey) {
      if (state === State.None) {
        setState(State.Key);
      }
      
      if (state === State.Key) {
        key += c;
      }
    }

    else if (isValueStart(c) && state !== State.Key && state !== State.Value) {
      if (state === State.AfterKey) {
        setState(State.Value);
      } else if (state === State.None) {
        setState(State.Key);
      }
      value += c;
    }

    else if (isValue(c) && state === State.Value) {
      value += c;
    }
    
    else if (isWhitespace(c)) {
      if (state === State.Key) {
        setState(State.AfterKey);
      }

      // Valid to have whitespace before/after lines
      whitespace += c;
    }

    else if (isSemi(c)) {
      // Semi's are ignored
    }
    
    else {
      throw new Error(`Error parsing xcconfig file: unknown character ${c} at ${line}:${col} (${state})`);
    }

    ++col;
  }

  if (state === State.Comment) {
    commit({
      comment,
    });
  } else if (state === State.Value) {
    commit({
      key, value,
    });
  }

  console.log('Ending in state', state);

  return entries;
}


function isNewLine(c: string) {
  return c === '\n';
}
function isStartComment(c: string, c2: string) {
  return c === '/' && c2 === '/';
}
function isInclude(contents: string, i: number) {
  // #include
  return contents.slice(i, i + 8) === '#include';
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
function isKey(c: string) {
  return /[a-zA-Z0-9_$()=*<>@\/\[\]]/.test(c);
}
function isValueStart(c: string) {
  // No spaces
  return /[a-zA-Z0-9_$()=*<>@\/\[\]]/.test(c);
}
function isValue(c: string) {
  // Spaces allowed
  return /[a-zA-Z0-9_$()=* <>@\/\[\]]/.test(c);
}

export function generateXCConfig(entries: XCConfigEntries) {
  const lines = [];
  for (const entry of entries) {
    lines.push(...generateLines(entry));
  }
  return lines.join('');
}

function generateLines(entry: XCConfigEntry) {
  const lines = [];
  if (typeof entry.comment !== 'undefined') {
    lines.push(`//${entry.comment}`);
  } else if (entry.key) {
    lines.push(`${entry.key} = ${entry.value}`);
  } else if (entry.include) {
    lines.push(`#include "${entry.include}"`);
  } else if (entry.content) {
    lines.push(entry.content);
  }
  return lines;
}