export function indent(s: string, char: string, amount: number) {
  if (amount < 0) {
    return '';
  }
  const lines = s.split(/\r?\n/);

  const indentChars = new Array(amount).fill(char).join('');

  const indentedLines = lines.map((l, i) => {
    // Don't indent empty lines that are first/last as those are just filler newlines
    if (l === '') {
      // If this is the first line, return the indented line
      if (i === 0) {
        return indentChars;
      } else if (i === lines.length - 1) {
        return '';
      }
    }
    return indentChars + l;
  });
  return indentedLines.join('\n');
};

export function getIndentation(line: string) {
  return line.match(/(^\s+)/)?.[0];
}