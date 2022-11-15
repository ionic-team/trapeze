export function pluralize(v: number, msg: string) {
  if (v === 0 || v > 1) {
    return `${msg}s`;
  }
  return msg;
}