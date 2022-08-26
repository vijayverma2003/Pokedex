export function titleCase(string) {
  if (string) return string[0].toUpperCase() + string.substring(1);
  else return null;
}
