export function sum(values: number | number[]): number {
  if(!Array.isArray(values)) {
    if(typeof values !== 'number') {
      return undefined;
    }
    values = [ values ];
  }
  if(!values.length) {
    return undefined;
  }
  return values.reduce((acc, value) => acc + value, 0);
}
