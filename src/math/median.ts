export function median(values: number | number[]): number {
  if(!Array.isArray(values)) {
    if(typeof values !== 'number') {
      return undefined;
    }
    return values;
  }
  if(!values.length) {
    return undefined;
  }
  let midIndex = Math.floor(values.length / 2);

  values.sort((a, b) => ( a === b ) ? 0 : a > b ? -1 : 1 );
  if(values.length % 2 === 0) {
    return (values[ midIndex ] + values[ midIndex - 1 ]) / 2;
  }
  return values[ midIndex ];
}
